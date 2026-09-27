const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user cart
// @route   GET /api/v1/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'title slug price oldPrice discount image vendor stock',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => {
      const product = item.product;
      let finalPrice = product.price;
      if (product.discount > 0) {
        finalPrice = product.oldPrice
          ? Math.round(product.oldPrice * (1 - product.discount / 100))
          : Math.round(product.price * (1 - product.discount / 100));
      }
      return {
        product: {
          _id: product._id,
          title: product.title,
          slug: product.slug,
          price: product.price,
          oldPrice: product.oldPrice,
          discount: product.discount,
          finalPrice,
          image: product.image,
          vendor: product.vendor,
          stock: product.stock,
        },
        quantity: item.quantity,
      };
    });

  const subtotal = items.reduce((sum, item) => sum + item.product.finalPrice * item.quantity, 0);

  res.json({
    success: true,
    cart: {
      _id: cart._id,
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: Math.round(subtotal),
    },
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product id is required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }
    existingItem.quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Item added to cart',
    cart,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/update/:productId
// @access  Private
const updateCartQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const existingItem = cart.items.find((item) => item.product.toString() === productId);

  if (!existingItem) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  if (quantity > product.stock) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  existingItem.quantity = quantity;
  await cart.save();

  res.json({
    success: true,
    message: 'Cart updated',
    cart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  res.json({
    success: true,
    message: 'Item removed from cart',
    cart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = [];
  await cart.save();

  res.json({
    success: true,
    message: 'Cart cleared',
    cart,
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};