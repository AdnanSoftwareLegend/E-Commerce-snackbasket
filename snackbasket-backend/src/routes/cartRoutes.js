const express = require('express');
const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .delete(protect, clearCart);

router.post('/add', protect, addToCart);
router.put('/update/:productId', protect, updateCartQuantity);
router.delete('/remove/:productId', protect, removeFromCart);

module.exports = router;