import { useState, useEffect, useRef } from "react";
import { FaClock, FaFileAlt, FaTrashAlt, FaFolder } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import { MdKeyboardArrowDown } from "react-icons/md";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                    D
                </div>
                <span className="text-white text-sm font-normal flex items-center gap-1">
                    Dmytro Dolhii <MdKeyboardArrowDown />
                </span>
            </div>

            {/* Dropdown with ref wrapper */}
            {isDropdownOpen && (
                <div ref={dropdownRef}>
                    <ProfileDropdown />
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

            <div className="flex-grow"></div>

            <div className="px-4 py-3 border-t border-[#222222] text-[#b3b3b3] text-xs flex items-center gap-2">
                <FaFolder />
                Main project
            </div>
        </aside>
    );
};

export default Sidebar;
