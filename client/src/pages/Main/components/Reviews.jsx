import React from "react";

const testimonials = [
    {
        name: "Alice Johnson",
        role: "Product Manager",
        feedback: "This service exceeded our expectations. Highly recommended!",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        name: "Mark Thompson",
        role: "Developer",
        feedback: "A seamless experience from start to finish.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Sarah Lee",
        role: "Designer",
        feedback: "Visually stunning and functionally brilliant.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        name: "Tommy Rivers",
        role: "Engineer",
        feedback: "The best investment we've made for our team.",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        name: "Linda Kim",
        role: "CEO",
        feedback: "Reliable and powerful — a game-changer!",
        image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
        name: "James Lee",
        role: "QA Specialist",
        feedback: "Smooth and bug-free experience throughout.",
        image: "https://randomuser.me/api/portraits/men/58.jpg",
    },
    {
        name: "Anna Bell",
        role: "Marketing Lead",
        feedback: "Increased our engagement tenfold.",
        image: "https://randomuser.me/api/portraits/women/23.jpg",
    },
    {
        name: "Carlos Gomez",
        role: "CTO",
        feedback: "Simple, fast, and efficient — exactly what we needed.",
        image: "https://randomuser.me/api/portraits/men/19.jpg",
    },
    {
        name: "Rachel Adams",
        role: "Content Writer",
        feedback: "Inspiring and easy to use.",
        image: "https://randomuser.me/api/portraits/women/30.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
    {
        name: "Brian Parker",
        role: "HR Manager",
        feedback: "User-friendly and scalable for our growing needs.",
        image: "https://randomuser.me/api/portraits/men/66.jpg",
    },
];

const Reviews = () => {
    return (
        <div className="relative py-16 px-4 md:px-12 lg:px-20">

            <h2 className="text-4xl text-white mb-10 text-center relative z-10">Join the community</h2>
            <h4 className="text-md text-white/50 mb-10 text-center relative z-10 font-code-pro">Discover what our community has to say about their McOkster experience.</h4>

            {/* Vignette (bottom) */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-380 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent z-10" />

            <div className="max-w-screen-xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-auto">
                {testimonials.map((t, i) => (
                    <div
                        key={i}
                        className={`bg-[#2A2A2A] rounded-xl shadow-lg p-5 text-white flex flex-col gap-4 ${i % 2 == 0 ? 'purpleGlow' : 'greenGlow'} transform transition duration-300 hover:scale-[1.05]`}
                        onClick={i === 1 ? () => window.open('https://github.com/kitska', '_blank') : undefined}
                    >
                        <p className="text-sm leading-relaxed italic">"{t.feedback}"</p>
                        <div className="flex items-center gap-4 mt-auto">
                            <img
                                src={t.image}
                                alt={t.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-sm font-code-pro">{t.name}</p>
                                <p className="text-xs text-gray-400 font-code-pro">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
