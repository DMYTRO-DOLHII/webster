import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userStore } from '../../store/userStore';
import { FaGoogle, FaGithub, FaDiscord } from 'react-icons/fa';
import { LuBrainCircuit } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useOAuth, useOAuthCallback } from '../../utils/oauth';
import { LoaderIcon } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner'

const Register = () => {
    const [form, setForm] = useState({
        fullName: '',
        login: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const { googleLogin, loginWithGitHub, loginWithDiscord } = useOAuth();
    const navigate = useNavigate();

    useOAuthCallback('github');
    useOAuthCallback('discord');

    const validate = () => {
        const errors = {};
        if (!form.fullName) errors.fullName = "Full name is required";
        if (!form.login) errors.login = "Full name is required";
        // if (!username) errors.username = "Username is required";
        if (form.fullName.length < 2) errors.fullName = "Full name must be at least 2 characters";
        if (form.login.length < 2) errors.login = "Full name must be at least 2 characters";
        // if (username.length < 2) errors.username = "Username must be at least 2 characters";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errors.email = "Valid Email is required";
        if (form.password.length < 6) errors.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords must match";
        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        setLoading(true);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const message = await userStore.register(form.fullName, form.email, form.password, form.login);
                if (message) {
                    toast('Confirm your email!');
                    navigate('/login');
                }
            } catch (error) {
                toast(error.response?.data?.message || 'Registration failed')
                // setServerError(error.response?.data?.message || 'Registration failed');
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleOAuth = (provider) => {
        // TODO: Redirect to your backend OAuth endpoint
        window.location.href = `/auth/${provider}`;
    };

    return loading ? (<LoadingSpinner />) : (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* 🔹 Background Floating Blobs */}
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

            <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-white/20 shadow-xl z-10">

                <h2 className="text-3xl font-bold text-center text-black mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <input
                            name='fullName'
                            type="text"
                            placeholder="Full Name"
                            value={form.fullName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <input
                            name='login'
                            type="text"
                            placeholder="Login Name"
                            value={form.login}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
                    </div>

                    <div>
                        <input
                            name='email'
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            name='password'
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <input
                            name='confirmPassword'
                            type="password"
                            placeholder='Confirm Password'
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-md bg-[#B52478] text-white font-semibold hover:bg-[#a11e69] transition"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">or register with</div>

                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => googleLogin()}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(234,67,53,0.5)]"
                    >
                        <FaGoogle size={25} />
                    </button>
                    <button
                        onClick={() => loginWithGitHub()}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(51,51,51,0.5)]"
                    >
                        <FaGithub size={25} />
                    </button>
                    <button
                        onClick={() => loginWithDiscord()}
                        className="cursor-pointer w-full p-3 bg-white text-gray-800 rounded-lg transition duration-200 flex justify-center items-center hover:bg-gray-100 hover:shadow-[0_2px_5px_rgba(88,101,242,0.5)]"
                    >
                        <FaDiscord size={25} />
                    </button>
                </div>

                <div className="mt-6 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/login')} className="text-[#B52478] hover:underline">
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
