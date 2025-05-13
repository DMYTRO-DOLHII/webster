import { FaRegDotCircle } from 'react-icons/fa';

const OurServices = () => {

    const img_url = 'https://img.freepik.com/free-vector/dark-wavy-background-with-colourful-fluid-effect_23-2148400713.jpg';
    return (
        <section
            className="text-white px-0 bg-cover bg-center relative min-h-[600px] flex items-stretch"
            style={{
                backgroundImage: `url('${img_url}')`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-0" />

            {/* Main Content */}
            <div className="relative z-10 flex flex-col md:flex-row w-full">
                {/* Left Panel */}
                <div className="w-full md:w-[65%] bg-white/10 backdrop-blur-md px-8 md:px-20 py-12 shadow-lg flex flex-col justify-center min-h-[600px]">
                    <div className="max-w-[60%] ml-25">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                        <p className="text-white/70 mb-6 leading-relaxed">
                            We offer a range of cutting-edge digital solutions designed to accelerate your business. From web development to AI integration — we handle it all with precision.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {[
                                "Custom Web Applications",
                                "AI-Powered Tools",
                                "Seamless Integrations",
                                "Full-Stack Support",
                            ].map((feature, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <FaRegDotCircle className="text-[#9B34BA]" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition rounded-full font-medium">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Right Spacer */}
                <div className="hidden md:block w-[35%]" />
            </div>
        </section>
    );
};

export default OurServices;
