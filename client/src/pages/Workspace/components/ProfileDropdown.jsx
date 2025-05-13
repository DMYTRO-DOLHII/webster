import { FaCog, FaUserPlus, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = ({ onOpenSettings }) => {
    return (
        <div className="absolute top-13 left-4 backdrop-blur-md border border-[#333] rounded-md text-xs p-3 w-56 z-10 text-white">
            <div className="flex flex-col items-center justify-center gap-2 mb-3">
                <div className="w-14 h-14 rounded-full bg-pink-600 flex items-center justify-center text-white text-sm font-semibold">D</div>
                <span className="text-14 font-medium">Dmytro Dolhii</span>
            </div>
            <div className="flex flex-col gap-1 text-[14px]">
                <button
                    onClick={onOpenSettings}
                    className="flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm hover:text-[#fff] transition hover:bg-white/10"
                >
                    <FaCog /> Settings
                </button>
                <button className="flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm hover:text-[#fff] transition hover:bg-white/10">
                    <FaUserPlus /> Add Account
                </button>
                <button className="flex items-center cursor-pointer px-3 py-2 gap-2 rounded-sm hover:text-[#fff] transition hover:bg-white/10">
                    <FaSignOutAlt /> Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;
