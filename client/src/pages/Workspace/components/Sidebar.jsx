import { useState, useEffect, useRef } from "react";
import { FaClock, FaFileAlt, FaTrashAlt, FaFolder } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { MdKeyboardArrowDown } from "react-icons/md";
import { userStore } from "../../../store/userStore";
import Button from '@mui/material/Button'; // Add at top with other imports
import { useNavigate } from "react-router-dom";


const Sidebar = ({ activeTab, setActiveTab, onOpenSettings }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const userName = userStore?.user?.fullName;
    const profilePicture = userStore?.user?.profilePicture;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <aside className="flex flex-col bg-[#121212] border-r border-[#222222] w-64 min-h-screen select-none relative">
            <div
                className="flex items-center gap-2 px-4 py-3 border-b border-[#222222] cursor-pointer relative"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
                <img className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm" src={profilePicture} alt="" />
                <span className="text-white text-sm font-normal flex items-center gap-1">
                    {userName} <MdKeyboardArrowDown />
                </span>
            </div>

            {/* Dropdown with ref wrapper */}
            {isDropdownOpen && (
                <div ref={dropdownRef}>
                    <ProfileDropdown onOpenSettings={onOpenSettings} />
                </div>
            )}

            <div className="px-4 py-2">
                <input
                    className="w-full bg-[#1c1c1c] text-[#3a3a3a] text-xs rounded-md px-3 py-2 placeholder-[#3a3a3a] focus:outline-none"
                    placeholder="Search for anything"
                    type="text"
                />
            </div>

            <nav className="flex flex-col mt-2 text-[14px] font-normal text-[#b3b3b3]">
                <button onClick={() => setActiveTab("recents")} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'recents' ? 'bg-[#3a1a5a] text-white' : 'hover:bg-[#222222]'} transition-colors`}>
                    <FaClock className="text-[10px]" />
                    Recents
                </button>
                <button onClick={() => setActiveTab("templates")} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'templates' ? 'bg-[#3a1a5a] text-white' : 'hover:bg-[#222222]'} transition-colors`}>
                    <FaFileAlt className="text-[10px]" />
                    Templates
                </button>
                <button onClick={() => setActiveTab("trash")} className={`flex items-center gap-2 px-4 py-3 ${activeTab === 'trash' ? 'bg-[#3a1a5a] text-white' : 'hover:bg-[#222222]'} transition-colors`}>
                    <FaTrashAlt className="text-[10px]" />
                    Trash
                </button>
            </nav>

            {/* Subscription Plan */}
            <div className="px-4 py-4 border-t border-[#222222]">
                <div className="text-xs text-[#b3b3b3] mb-1">Your Plan</div>

                <div
                    className={`text-sm font-semibold mt-2 px-3 py-1 rounded-sm w-full text-center inline-block mb-3 shadow-md transition-all duration-300
                            ${userStore?.user?.subscription === 'premium'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white'
                            : userStore?.user?.subscription === 'advanced'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-400 text-white'
                                : 'bg-gradient-to-r from-black to-blue-800 text-white'
                        }`}
                >
                    {userStore?.user?.subscription?.charAt(0).toUpperCase() + userStore?.user?.subscription?.slice(1)}
                </div>

                <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => navigate('/pricing')}
                    sx={{
                        color: '#b3b3b3',
                        borderColor: '#333',
                        '&:hover': {
                            borderColor: '#555',
                            backgroundColor: '#1f1f1f',
                        },
                        textTransform: 'none',
                        fontSize: '0.75rem',
                    }}
                >
                    Change Plan
                </Button>
            </div>



            <div className="flex-grow"></div>

            <div className="px-4 py-3 border-t border-[#222222] text-[#b3b3b3] text-xs flex items-center gap-2">
                <FaFolder />
                Main project
            </div>
        </aside>
    );
};

export default Sidebar;
