// components/ProfileDropdown.jsx
import { FaCog, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = () => {
    return (
        <div className="absolute top-12 left-4 bg-[#1c1c1c] border border-[#333] rounded-md p-3 text-xs w-48 z-10 text-white">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-semibold">D</div>
                <span className="text-sm font-medium">Dmytro Dolhii</span>
            </div>
            <div className="flex flex-col gap-2">
                <button className="flex items-center gap-2 hover:text-[#888] transition">
                    <FaCog /> Settings
                </button>
                <button className="flex items-center gap-2 hover:text-[#888] transition">
                    <FaUserPlus /> Add Account
                </button>
                <button className="flex items-center gap-2 hover:text-[#888] transition">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
