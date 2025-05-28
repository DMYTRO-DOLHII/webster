import { useNavigate } from 'react-router-dom';

const Error404 = ({ message = "Page not found", buttonText = "Go To Main", redirectPath = "/", errorCode = "404" }) => {
    const navigate = useNavigate();

    return (
        <div className="h-screen relative flex gap-10 font-sans p-15 overflow-hidden">
            {/* Left Side */}
            <div className="relative w-1/2 bg-white/20 p-10 flex flex-col justify-between text-black rounded-2xl overflow-hidden">
                {/* Diagonal blurred gradient background */}
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-bl from-[#9B34BA] to-[#4ab021] blur-[150px] opacity-30 pointer-events-none z-0" />

                {/* Background 404 */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-[20rem] font-extrabold text-gray-300 opacity-30 z-0 select-none">{errorCode}</h1>
                </div>

                {/* Top-Left Text */}
                <div className="z-10">
                    <h2 className="text-[3rem] text-white font-semibold">{message}</h2>
                </div>

                {/* Bottom-Left Button */}
                <div className="z-10">
                    <button
                        onClick={() => navigate(redirectPath)}
                        className="border-1 border-solid text-white px-6 py-2 rounded-lg shadow hover:opacity-80 transition"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-1/2">
                <img
                    // src="./src/assets/okak.png"
                    src='https://kz.kursiv.media/wp-content/uploads/2025/05/img_8458-1280x720.jpeg'
                    alt="404 illustration"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

export default Error404;
