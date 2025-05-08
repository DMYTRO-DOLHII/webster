import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { LuBrainCircuit } from "react-icons/lu";

const Footer = () => {
    const handleLogoClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    return (
        <footer className="bg-[#0e0e0e] text-white text-sm pt-10 pb-6 px-4 md:px-10 mt-20 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Branding */}
                <div className="flex flex-col gap-2">
                    <div onClick={handleLogoClick} className="flex items-center gap-2 text-white font-bold text-xl cursor-pointer">
                        <LuBrainCircuit className="text-[#9b34ba]" />
                        McOkster
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-white">Quick Links</h4>
                    <Link to="/" className="hover:text-[#9b34ba] transition">Home</Link>
                    <span onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-[#9b34ba] transition">Pricing</span>
                    <span onClick={() => document.getElementById("testimonials")?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-[#9b34ba] transition">Testimonials</span>
                    <span onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: 'smooth' })} className="cursor-pointer hover:text-[#9b34ba] transition">FAQs</span>
                </div>

                {/* Socials */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-white">Connect</h4>
                    <div className="flex gap-4 text-lg">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9b34ba] transition">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9b34ba] transition">
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#9b34ba] transition">
                            <FaTwitter />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-white/40 text-xs border-t border-white/10 pt-6">
                © {new Date().getFullYear()} McOkster. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
