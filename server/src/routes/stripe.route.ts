import { Router } from 'express';
import { StripeController } from '../controllers/StripeController';
import express from 'express'

const router = Router();

router.post("/create-checkout-session", StripeController.createCheckout.bind(StripeController))

export default router;