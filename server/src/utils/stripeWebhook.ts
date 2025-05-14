// routes/webhook.ts
import express from 'express';
import { StripeController } from '../controllers/StripeController';

const router = express.Router();

router.post('/', express.raw({ type: 'application/json' }), StripeController.handleStripeWebhook.bind(StripeController));

export default router;
