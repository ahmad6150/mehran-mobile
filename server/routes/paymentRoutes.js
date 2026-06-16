import express from 'express';
import {
  createPaymentIntent,
  stripeWebhook,
  getStripeKey,
} from '../controllers/paymentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/key', getStripeKey);
router.post('/create-intent', protect, createPaymentIntent);
router.post('/webhook', stripeWebhook);

export default router;