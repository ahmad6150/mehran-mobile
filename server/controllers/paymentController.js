import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payment/create-intent
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency = 'usd' } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error('Amount is required');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata: {
      userId: req.user._id.toString(),
      shop: 'Mehran Mobile',
    },
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// @desc    Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public (Stripe)
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle payment success
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Find order by payment intent id and update
    const order = await Order.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });

    if (order) {
      order.paymentStatus = 'paid';
      order.paidAt = Date.now();
      await order.save();
    }
  }

  res.json({ received: true });
});

// @desc    Get Stripe publishable key
// @route   GET /api/payment/key
// @access  Public
const getStripeKey = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export { createPaymentIntent, stripeWebhook, getStripeKey };