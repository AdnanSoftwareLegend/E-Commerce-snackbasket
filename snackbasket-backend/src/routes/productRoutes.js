const express = require("express");
const {
  getProducts,
  getProductById,
  getSellerProducts,
  createProduct,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, upload.single("image"), createProduct);

router.get("/my-products", protect, getSellerProducts);
router.route("/:id").get(getProductById);

module.exports = router;
