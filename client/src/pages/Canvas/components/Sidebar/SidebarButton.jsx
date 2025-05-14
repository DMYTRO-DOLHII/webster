import React from "react";

const SidebarButton = ({ label, active, onClick, icon }) => {
    return (
        <button
            value={label}
            onClick={onClick}
            className={`flex flex-col items-center text-xs text-white px-2 py-1 focus:outline-none transition-all ${active ? "opacity-100" : "opacity-50 hover:opacity-80"
                }`}
        >
            {/* Placeholder icon */}
            {icon}
            <span className="mt-2">{label}</span>
        </button>
    );
};

export default SidebarButton;
