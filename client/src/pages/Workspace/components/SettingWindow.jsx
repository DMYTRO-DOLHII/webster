import React, { useState } from "react";

const SettingWindow = ({ onClose }) => {
    const [email, setEmail] = useState("Dmytro Dolhii");
    const [selectedPlan, setSelectedPlan] = useState("Basic");

    const subscriptionColors = {
        Basic: "bg-[#0b132b]/60 border border-blue-800",
        Advanced: "bg-[#0b2b13]/60 border border-green-800",
        Pro: "bg-[#1c0b2b]/60 border border-purple-800",
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[720px] max-w-[95vw] rounded-xl p-6 bg-black/30 text-white shadow-xl border border-white/10 backdrop-blur-2xl pb-24">
                {/* Top tabs and close */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-6 text-sm font-medium">
                        <button className="hover:text-gray-300">Account</button>
                        <button className="hover:text-gray-300">Security</button>
                    </div>
                    <button
                        className="text-white text-xl hover:text-gray-300"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <hr className="border-gray-600 mb-6" />

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                    <div className="w-28 h-28 bg-pink-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-md relative">
                        D
                        <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer text-xs">
                            ✎
                        </div>
                    </div>
                </div>

                <hr className="border-gray-600 mb-6" />

                {/* Name section */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Name</label>
                        <p className="text-lg font-medium">{email}</p>
                    </div>
                    <button className="text-sm border border-gray-500 px-3 py-1 rounded-md hover:bg-gray-700">
                        Edit
                    </button>
                </div>

                <hr className="border-gray-600 mb-6" />

                {/* Email section */}
                <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-1">Email address</label>
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 p-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none"
                        />
                        <button className="px-4 py-1 rounded-md border border-white/20 hover:bg-white/10">
                            Cancel
                        </button>
                        <button className="bg-purple-600 px-4 py-1 rounded-md">
                            Save
                        </button>
                    </div>
                </div>

                <hr className="border-gray-600 mb-6" />

                {/* Subscription plans */}
                <div className="mb-6">
                    <h4 className="text-sm text-gray-300 mb-3">Subscription</h4>
                    <div className="flex gap-4">
                        {["Basic", "Advanced", "Pro"].map((plan) => (
                            <div
                                key={plan}
                                onClick={() => setSelectedPlan(plan)}
                                className={`flex-1 h-[150px] p-5 rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between items-center text-center ${subscriptionColors[plan]} ${
                                    selectedPlan === plan ? "ring-2 ring-white" : "hover:ring hover:ring-white/30"
                                }`}
                            >
                                <div className="mt-2">
                                    <div className="text-lg font-semibold mb-1">{plan}</div>
                                    <div className="text-sm text-gray-300">
                                        {plan === "Basic"
                                            ? "$0/mo"
                                            : plan === "Advanced"
                                                ? "$9.99/mo"
                                                : "$19.99/mo"}
                                    </div>
                                </div>
                                <button className="w-full border border-white py-1 rounded-md text-sm mt-3">
                                    {selectedPlan === plan ? "Selected" : "Choose Plan"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delete Account Button */}
                <div className="absolute bottom-4 left-6">
                    <button className="border border-gray-500 px-4 py-1 text-sm hover:bg-red-500 hover:text-white rounded-md transition-all">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingWindow;
