import React from "react";

const Header = () => {
    return (
        <header className="flex justify-between items-center px-6 h-16 bg-[#1a1a1a] border-b border-[#2a2a2a] text-white">
            {/* Left: Company name */}
            <div className="text-lg font-bold">YourCompany</div>

            {/* Center: Canvas name */}
            <div className="text-sm opacity-70">Untitled Design</div>

            {/* Right: Share button */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded">
                Share
            </button>
        </header>
    );
};

export default Header;
