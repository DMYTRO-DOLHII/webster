import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';
import { LuBrainCircuit } from 'react-icons/lu';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useOAuth, useOAuthCallback } from '../../utils/oauth';
import LoadingSpinner from '../../components/LoadingSpinner';
import { userStore } from '../../store/userStore';
import { redirectToStripeCheckout } from '../../utils/stripe';
import toast from 'react-hot-toast';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { googleLogin, loginWithGitHub, loginWithDiscord } = useOAuth();

    useOAuthCallback('github');
    useOAuthCallback('discord');

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = login.includes('@') ? login : '';
        setLogin(email ? '' : login);

        try {
            const message = await userStore.login(email, password, login);
            if (message) {
                const selectedPlan = localStorage.getItem("selectedPlan");

                if (selectedPlan) {
                    localStorage.removeItem("selectedPlan");
                    redirectToStripeCheckout(userStore?.user?.subscription, selectedPlan, userStore?.user?.id);
                }
                else navigate('/');
            }
        } catch (error) {
            console.log(error);
            if (error.status === 401) {
                toast.error('Invalid login or password')
                return
            }
            if (error.status === 400) {
                toast.error('User does not exist')
                return
            } else {
                toast.error('Something went wrong. Please try again tommorow');
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgot = () => {
        navigate('/password-reset');
    };

    const handleOAuth = (provider) => {
        window.location.href = `/auth/${provider}`;
    };

    return loading ? (<LoadingSpinner />) : (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

            {/* Background Floating Blobs */}
            <div className="absolute inset-0 flex items-center justify-center z-0">
                {/* Blob Container with pulse */}
                <div className="relative w-[600px] h-[600px] animate-slow-pulse">

                    {/* Top Left Blob — Float Y */}
                    <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-blue-400 via-orange-400 to-pink-400 rounded-full blur-[200px] opacity-30 top-0 left-0 animate-float-y" />

                    {/* Bottom Right Blob — Float X */}
                    <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-blue-400 via-purple-500 to-indigo-500 rounded-full blur-[200px] opacity-30 bottom-0 right-0 animate-float-x" />

                    {/* Optional: Center Blob — Float Y & Spin Slow */}
                    <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-cyan-300 via-pink-400 to-indigo-400 rounded-full blur-[160px] opacity-20 top-1/3 left-1/3 animate-float-y animate-spin-slow" />

                </div>
            </div>



            {/* Logo Section */}
            <div className="absolute top-16 flex flex-col items-center z-10 animation-gradientBlur">
                <Link to="/" className="flex items-center gap-2 text-black font-bold text-2xl hover:opacity-80 transition">
                    <LuBrainCircuit className="text-[#B52478]" />
                    <span className='text-white'>McOkster</span>
                </Link>
            </div>


            {/* Login Box */}
            <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-gray-300 shadow-xl z-10">
                <h2 className="text-3xl font-normal text-center text-black mb-6">
                    Welcome back
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email or Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-[#B52478] text-white font-semibold hover:bg-[#a11e69] transition"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">or login with</div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => handleOAuth('google')}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(234,67,53,0.5)]"
                    >
                        <FaGoogle size={25} />
                    </button>
                    <button
                        onClick={() => handleOAuth('github')}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(51,51,51,0.5)]"
                    >
                        <FaGithub size={25} />
                    </button>
                    <button
                        onClick={() => handleOAuth('discord')}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(88,101,242,0.5)]"
                    >
                        <FaDiscord size={25} />
                    </button>
                </div>

                <div className="mt-6 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <button onClick={() => navigate('/register')} className="text-[#B52478] hover:underline">
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
