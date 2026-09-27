let stripeInstance;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripeInstance) {
    stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

const Order = require('../models/Order');

const SUPPORTED_GATEWAYS = ['sslcommerz', 'bkash', 'nagad'];

// @desc    Initiate payment (Demo for sslcommerz/bkash/nagad)
// @route   POST /api/v1/payments/:gateway/init
// @access  Private
const gatewayInit = async (req, res) => {
  const { gateway } = req.params;
  const { orderId, amount } = req.body;

  if (!SUPPORTED_GATEWAYS.includes(gateway)) {
    return res.status(400).json({ message: 'Unsupported payment gateway' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const finalAmount = amount || order.totalAmount;

  return res.json({
    success: true,
    gateway,
    orderId: order._id,
    amount: finalAmount,
    paymentUrl: `/api/v1/payments/${gateway}/success?orderId=${order._id}`,
    message: 'Demo payment initiated. In production, use real merchant API.',
  });
};

// @desc    Payment callback (success/fail/cancel)
// @route   GET /api/v1/payments/:gateway/success|cancel|fail
// @access  Public
const gatewayCallback = async (req, res) => {
  const { gateway } = req.params;
  const { orderId, status } = req.query;

  const order = await Order.findById(orderId);
  if (order && status === 'success') {
    order.paymentStatus = 'Paid';
    await order.save();
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/order/${orderId}?payment=success`);
  }

  return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout?payment=cancel`);
};

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/stripe/payment-intent
// @access  Private
const createStripePaymentIntent = async (req, res) => {
  const { amount, currency = 'usd', orderId, customerDetails } = req.body;

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(400).json({ message: 'Stripe is not configured (STRIPE_SECRET_KEY missing)' });
  }

  const stripe = getStripe();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      metadata: { orderId: orderId?.toString() || '' },
      receipt_email: customerDetails?.email,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Stripe Webhook (payment_intent.succeeded etc.)
// @route   POST /api/v1/payments/stripe/webhook
// @access  Public
const stripeWebhook = async (req, res) => {
  let event = { type: req.body.type, data: { object: req.body.data && req.body.data.object } };

  if (event.type === 'payment_intent.succeeded') {
    const orderId = event.data.object.metadata.orderId;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Paid' });
    }
  }

  res.json({ received: true });
};

module.exports = {
  gatewayInit,
  gatewayCallback,
  createStripePaymentIntent,
  stripeWebhook,
};