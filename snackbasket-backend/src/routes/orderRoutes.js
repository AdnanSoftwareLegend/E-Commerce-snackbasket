const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create', createOrder);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;