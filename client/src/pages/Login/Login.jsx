import { FaGithub, FaGoogle, FaDiscord } from 'react-icons/fa';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Logging in with:', login, password);
    };

    const handleOAuth = (provider) => {
        window.location.href = `/auth/${provider}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-gray-300 shadow-xl">
                <h2 className="text-3xl font-bold text-center text-black mb-6">Login to <span className='text-[#B52478]'>McOkster</span></h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Email or Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-[#B52478] text-white font-semibold hover:bg-[#a11e69] transition"
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
