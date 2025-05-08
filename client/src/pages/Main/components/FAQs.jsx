import React, { useState } from "react";

const faqs = [
    {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee on all plans.",
    },
    {
        question: "Can I upgrade my plan later?",
        answer: "Yes, you can upgrade anytime from your account settings.",
    },
    {
        question: "Do you offer customer support?",
        answer: "Absolutely! Our support team is available 24/7 via chat and email.",
    },
    {
        question: "Can I invite team members?",
        answer: "Yes, you can add unlimited team members depending on your plan.",
    },
    {
        question: "Are there discounts for students or nonprofits?",
        answer: "Yes, we offer special pricing. Contact us for more details.",
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept credit/debit cards, PayPal, and wire transfers.",
    },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="py-12 px-4">
            <div className="max-w-3xl mx-auto text-white">
                <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="rounded-xl overflow-hidden"
                            style={{ border: "1px solid rgba(224, 173, 255, 0.69)" }}
                        >
                            <button
                                onClick={() => toggle(index)}
                                className="w-full px-6 py-4 text-left focus:outline-none flex justify-between items-center"
                            >
                                <span className="text-lg font-medium">{faq.question}</span>
                                <span className="text-xl transform transition-transform duration-300">
                                    {openIndex === index ? "−" : "+"}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4 text-gray-300">{faq.answer}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
