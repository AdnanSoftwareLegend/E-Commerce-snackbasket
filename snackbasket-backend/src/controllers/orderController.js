const Order = require('../models/Order');

// @desc Create New Order
// @route POST /api/v1/orders/create
const createOrder = async (req, res) => {
  try {
    const { customerDetails, items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    const order = new Order({
      user: req.user ? req.user._id : null,
      customerDetails,
      items,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get User Orders
// @route GET /api/v1/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders };