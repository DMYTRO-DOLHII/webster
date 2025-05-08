import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { FaBolt } from 'react-icons/fa'
import { LuBrainCircuit } from "react-icons/lu";

const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
};

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
            <div className="flex items-center justify-between lg:px-10 md:px-4 px-2 py-3 md:py-6 sticky lg:top-0 rounded-lg md:mx-4 mx-2 top-2 lg:bg-transparent backdrop-blur-md z-[9999] grow">
                {/* Left: Logo */}
                <div onClick={handleLogoClick} className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer">
                    <LuBrainCircuit className="text-[#9b34ba]" />
                    McOkster
                </div>

                {/* Center: Navigation */}
                <nav className="hidden md:flex gap-8 text-white/80 text-sm font-medium">
                    <a onClick={() => scrollToId("pricing")} className="hover:text-white transition cursor-pointer">Pricing</a>
                    <a onClick={() => scrollToId("testimonials")} className="hover:text-white transition cursor-pointer">Testimonials</a>
                    <a onClick={() => scrollToId("faqs")} className="hover:text-white transition cursor-pointer">FAQs</a>
                </nav>

                {/* Right: Login Button */}
                <Link to="/login">
                    <Button
                        variant="outlined"
                        style={{ color: 'white', borderColor: 'white', fontFamily: '"Source Code Pro", monospace', fontWeight: '300' }}
                    >
                        Login
                    </Button>
                </Link>
            </div>
        </header>
    )
}

export default Header;
