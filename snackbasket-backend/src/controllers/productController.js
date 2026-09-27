const Product = require("../models/Product");
const Category = require("../models/Category");

const makeSlug = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `product-${Date.now()}`;

// @desc Get All Products (With Search & Category Filter)
// @route GET /api/v1/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, maxPrice } = req.query;
    let query = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (category) {
      const categoryDocument = await Category.findOne({
        slug: category,
      }).select("_id");
      query.category = categoryDocument ? categoryDocument._id : category;
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Single Product
// @route GET /api/v1/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name",
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get seller's own products
// @route GET /api/v1/products/my-products
const getSellerProducts = async (req, res) => {
  try {
    if (!req.user || !["seller", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only sellers can view their products." });
    }

    const query = req.user.role === "admin" ? {} : { seller: req.user._id };
    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Product
// @route POST /api/v1/products
const createProduct = async (req, res) => {
  try {
    if (!req.user || !["seller", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Only sellers can add products." });
    }

    const productData = { ...req.body };

    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    if (!productData.image && !req.file) {
      return res.status(400).json({ message: "Product image is required." });
    }

    if (!productData.slug) {
      productData.slug = makeSlug(productData.title || "new-product");
    }

    productData.seller = req.user._id;

    const product = new Product(productData);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
};
