import { useNavigate } from "react-router-dom";
import { RxRadiobutton } from "react-icons/rx";
import clsx from "clsx";
import { Button } from "@mui/material";
import { userStore } from '../../../store/userStore'
import { api } from "../../../services/api";
import { redirectToStripeCheckout } from '../../../utils/stripe'
import Swal from "sweetalert2";

const pricingData = [
    { title: "Basic", price: "$0", oldPrice: null, features: ["3 projects", "No templates"] },
    { title: "Advanced", price: "$9.99", oldPrice: null, features: ["10 projects", "10 templates"] },
    { title: "Premium", price: "$19.99", oldPrice: null, features: ["Unlimited projects", "Unlimited templates"] },
];

const cardStyles = [
    "defaultGradient bg-[#0a171f]",
    "greenGradient",
    "purpleGradient"
];

const Pricing = () => {
    const navigate = useNavigate();

    const handlePlanSelect = async (planTitle) => {
        const currentPlan = userStore?.user?.subscription;
        if (currentPlan === planTitle.toLowerCase()) return;

        // Save the selected plan in localStorage
        localStorage.setItem("selectedPlan", planTitle)

        if (!userStore?.user) {
            // Not logged in — redirect to login
            navigate('/login')
        } else {
            if ((currentPlan === "advanced" || currentPlan === "premium") && planTitle === "Basic") {
                const result = await Swal.fire({
                    title: "Confirm Plan Change",
                    text: "Are you sure you want to downgrade to the Basic plan? This will cancel your current subscription.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, downgrade",
                    cancelButtonText: "No, keep current plan"
                });

                if (result.isConfirmed) {
                    try {
                        await api.patch(`/users/${userStore?.user?.id}`, {
                            plan: planTitle
                        });
                        userStore.user.subscription = "basic"; // update locally
                        Swal.fire("Success", "Your plan was updated to Basic.", "success");
                    } catch (err) {
                        console.error("Subscription update failed:", err);
                        Swal.fire("Error", "Something went wrong while updating your subscription.", "error");
                    }
                }

                return;
            }
            // Logged in — go directly to checkout
            redirectToStripeCheckout(currentPlan, planTitle, userStore?.user?.id);
        }
    };

    return (
        <section className="relative w-full py-24 px-6 text-white backdrop-blur">
            {/* Background Layer */}
            <div className="bg-layer">
                <div className="bg-text" style={{ top: "5%", left: "10%" }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it t
                </div>
                <div className="bg-text" style={{ top: "10%", right: "15%" }}>
                    m aliquet ligula ut mi porttitor, in scelerisque sapien venenatis. Pellentesque dignissim egestas magna vehicula fringilla. Nulla nisl massa, auctor non libero vel, dictum hendrerit elit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce suscipit sed velit sed pellentesque. Morbi nec tortor in erat iaculis pretium convallis a lorem. Nulla sed accumsan metus. Vivamus faucibus, risus in dignissim fringilla, odio lorem sodales diam, ac dapibus felis eros in neque. Maecenas interdum suscipit nulla. Maecenas mollis semper mi, ac lacinia orci iaculis po
                </div>
                <div className="bg-text" style={{ bottom: "15%", left: "3%" }}>
                    olestie sem sit amet erat maximus facilisis. Curabitur ut gravida elit. Sed nulla nibh, tincidunt vel justo in, luctus cursus velit. Cras eget sem sit amet tortor interdum lacinia. In volutpat ex nisl, at posuere ligula tristique sit amet. Vivamus dapibus imperdiet facilisis. Suspendisse potenti. Nullam id tempor diam. Integer quis bibendum eros, et suscipit dui. Nam id pellentesque magna. Nunc ultricies vitae nibh sit a
                </div>
                <div className="bg-text" style={{ bottom: "10%", right: "5%" }}>
                    Ut finibus sem sit amet suscipit elementum. Ut rhoncus non erat in feugiat. Praesent sed pellentesque elit, aliquam accumsan enim. Integer consequat, enim eget tempus commodo, nisi ligula suscipit velit, sit amet efficitur ligula est eu eros. Phasellus porttitor lobortis libero. Nulla
                </div>
            </div>

            <h2 className="text-4xl mb-10 text-center relative z-10">Pricing</h2>

            {/* Cards */}
            <div className="relative z-10 flex justify-center flex-wrap gap-10">
                {pricingData.map((plan, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "w-90 min-h-[450px] rounded-2xl p-6 shadow-xl transition duration-300 ease-in-out transform hover:brightness-125 flex flex-col justify-between",
                            cardStyles[index]
                        )}
                    >
                        <div>
                            <h3 className="text-2xl mb-2 text-left font-bold textBlackGradient">{plan.title}</h3>
                            <div className="text-left mb-4">
                                {plan.oldPrice && (
                                    <span className="line-through textBlackGradient mr-2">{plan.oldPrice}/mo</span>
                                )}
                                <span className="text-2xl textBlackGradient">{plan.price}/mo</span>
                            </div>
                            <ul className="text-left divide-y divide-white/40">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 py-2">
                                        <RxRadiobutton /> <span className="font-code-pro">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            onClick={() => handlePlanSelect(plan.title)}
                            variant="outlined"
                            sx={{
                                color: userStore?.user?.subscription === plan.title.toLowerCase() ? "black" : "white",
                                borderColor: "#fff",
                                borderRadius: "0.5rem",
                                padding: "0.5rem 1rem",
                                textTransform: "none",
                                width: "100%",
                                backgroundColor: userStore?.user?.subscription === plan.title.toLowerCase() ? "white" : "transparent",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderColor: "#fff",
                                },
                            }}
                        >
                            {userStore?.user?.subscription === plan.title.toLowerCase() ? "Current Plan" : "Select Plan"}
                        </Button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Pricing;
