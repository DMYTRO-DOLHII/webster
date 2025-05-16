import Stripe from "stripe";
import { Request, Response } from 'express';
import { SubscriptionType, User } from "../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Simulated plan data (normally from DB or config)
const subscriptionPlans: Record<string, { priceId?: string; name: string; price: number }> = {
    // basic: { priceId: "price_1ROfeZDqdZ089aWc4QadPjuv", name: "Basic", price: 0 }, // Free, no Stripe session needed
    // advanced: { priceId: "price_1ROfgYDqdZ089aWclwJtF9Zd", name: "Advanced", price: 9.99 },
    // pro: { priceId: "price_1ROfh9DqdZ089aWc5IMt9oyd", name: "Pro", price: 19.99 },
    basic: { priceId: "price_1ROfjJDqdZ089aWciEols63X", name: "Basic", price: 0 }, // Free, no Stripe session needed
    advanced: { priceId: "price_1ROfjjDqdZ089aWcouZC4iac", name: "Advanced", price: 9.99 },
    premium: { priceId: "price_1ROfkNDqdZ089aWcHbfL8iQw", name: "Premium", price: 19.99 },
};

export const StripeController = {
    async handleStripeWebhook(req: Request, res: Response): Promise<Response> {
        const sig = req.headers["stripe-signature"] as string;

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            console.error("Webhook error:", err);
            return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        }

        // 🎯 Handle checkout session completed
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;

            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan;

            console.log(`✅ Subscription completed for user ${userId} on plan ${plan}`);

            // TODO: Update user subscription in your database here
            const user = await User.findOne({
                where: { id: userId }
            });

            if (!user) {
                res.status(404).json({ message: "No user found" }); 
                return;
            }

            user.subscription = plan == 'basic' ? SubscriptionType.BASIC 
                              : plan == 'advanced' ? SubscriptionType.ADVANCED 
                              : plan == 'premium' ? SubscriptionType.PREMIUM : SubscriptionType.BASIC;

            await user.save();
        }

        res.status(200).json({ received: true });
    },

    async createCheckout(req: Request, res: Response): Promise<Response> {
        const { plan, userId } = req.body;

        const selectedPlan = subscriptionPlans[plan];

        if (!selectedPlan) {
            return res.status(400).json({ error: "Invalid subscription plan." });
        }

        // if (selectedPlan.price === 0) {
        //     // Basic plan: activate directly, no Stripe session
        //     // TODO: Update user subscription in DB
        //     console.log(`User ${userId} subscribed to free Basic plan.`);
        //     return res.status(200).json({ message: "Free plan activated." });
        // }

        try {
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                line_items: [
                    {
                        price: selectedPlan.priceId!,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.FRONT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONT_URL}/subscription/cancel`,
                metadata: {
                    userId: String(userId),
                    plan,
                },
            });

            return res.status(200).json({ url: session.url });
        } catch (err) {
            console.error("Stripe session error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};
