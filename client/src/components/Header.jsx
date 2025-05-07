import Button from '@mui/material/Button'
import { FaBolt } from 'react-icons/fa'
import { LuBrainCircuit } from "react-icons/lu";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md">
            <div className="flex items-center justify-between lg:px-10 md:px-4 px-2 py-3 md:py-6 sticky lg:top-0 rounded-lg md:mx-4 mx-2 top-2 lg:bg-transparent backdrop-blur-md z-[9999] grow">
                {/* Left: Logo */}
                <Link to={'/'}>
                    <div className="flex items-center gap-2 text-white font-bold text-xl">
                        <LuBrainCircuit className="text-[#B52478]" />
                        McOkster
                    </div>
                </Link>

                {/* Center: Navigation */}
                <nav className="hidden md:flex gap-8 text-white/80 text-sm font-medium">
                    <a href="#features" className="hover:text-white transition">Features</a>
                    <a href="#pricing" className="hover:text-white transition">Pricing</a>
                    <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
                </nav>

                {/* Right: Login Button */}
                <Link to={'/login'}>
                    <Button
                        variant="outlined"
                        style={{ color: 'white', borderColor: 'white' }}
                    >
                        Login
                    </Button>
                </Link>
            </div>
        </header>
    )
}

export default Header
