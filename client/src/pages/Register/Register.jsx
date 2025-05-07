import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub, FaDiscord } from 'react-icons/fa';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};

        if (!fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!login.trim()) newErrors.login = 'Login name is required';

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*]/.test(password)
        ) {
            newErrors.password =
                'Password must be 8+ chars and include upper, lower, number, and symbol';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // TODO: Send data to backend
        console.log({ fullName, login, email, password });
    };

    const handleOAuth = (provider) => {
        // TODO: Redirect to your backend OAuth endpoint
        window.location.href = `/auth/${provider}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-white/20 shadow-xl">
                <h2 className="text-3xl font-bold text-center text-black mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Login Name"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.login && <p className="text-red-500 text-sm mt-1">{errors.login}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-gray-100 border border-gray-300 text-black placeholder-gray-500 focus:outline-none"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 rounded-xl bg-[#B52478] text-white font-semibold hover:bg-[#a11e69] transition"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-600">or register with</div>

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
