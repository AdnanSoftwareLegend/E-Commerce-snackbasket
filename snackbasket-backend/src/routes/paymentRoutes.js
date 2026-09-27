const express = require('express');
const {
  gatewayInit,
  gatewayCallback,
  createStripePaymentIntent,
  stripeWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/stripe/payment-intent', protect, createStripePaymentIntent);
router.post('/stripe/webhook', stripeWebhook);

router.post('/:gateway/init', protect, gatewayInit);
router.get('/:gateway/success', gatewayCallback);
router.get('/:gateway/cancel', gatewayCallback);
router.get('/:gateway/fail', gatewayCallback);

module.exports = router;