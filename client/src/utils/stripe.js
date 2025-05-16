import { api } from "../services/api";

export const redirectToStripeCheckout = async (planTitle, userId) => {
    try {
        const reponse = await api.post(`${import.meta.env.VITE_API_URL}/stripe/create-checkout-session`, { plan: planTitle.toLowerCase(), userId })

        if (reponse.data.url) {
            window.location.href = reponse.data.url;
        } else {
            alert("Unable to start checkout session.");
        }
    } catch (err) {
        console.error("Checkout error:", err);
    }
};