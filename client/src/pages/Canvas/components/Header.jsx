import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { LuBrainCircuit } from "react-icons/lu";

const menuStructure = {
    File: ["New", "Open", "---", "Save as McOkster", "Export as"],
    Edit: [
        "Step forward",
        "Step backward",
        "---",
        "Copy",
        "Paste",
        "---",
        "Transform",
    ],
    Image: [],
    Layer: [],
    Select: [],
    Filter: [],
    View: [],
    Help: [],
};

const Header = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const menuRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogoClick = () => {
        navigate('/workspace');
    }

    return (
        <header className="flex justify-between items-center px-4 h-12 bg-[#1c1c1c] text-white border-b border-[#2a2a2a] relative">
            {/* Left Side: Icon + Menu Items */}
            <div className="flex items-center space-x-6 relative" ref={menuRef}>
                <LuBrainCircuit className="text-[#9b34ba] text-xl cursor-pointer" onClick={handleLogoClick} />

                <nav className="flex space-x-5 text-sm">
                    {Object.entries(menuStructure).map(([item, entries]) => (
                        <div key={item} className="relative">
                            <div
                                onClick={() => setOpenMenu(openMenu === item ? null : item)}
                                className="cursor-pointer hover:opacity-100 transition-opacity select-none"
                            >
                                {item}
                            </div>

                            {openMenu === item && (
                                <div className="absolute mt-1 min-w-[160px] z-999 bg-[#363636] backgrop-blur-md border border-[#444] text-sm rounded py-1 shadow-lg">
                                    {entries.length === 0 ? (
                                        <div className="px-3 py-1 text-gray-400">Coming Soon</div>
                                    ) : (
                                        entries.map((entry, idx) =>
                                            entry === "---" ? (
                                                <div
                                                    key={`sep-${idx}`}
                                                    className="border-t border-[#444] my-1"
                                                ></div>
                                            ) : (
                                                <div
                                                    key={entry}
                                                    onClick={() => {
                                                        console.log(`${item} → ${entry}`);
                                                        setOpenMenu(null);
                                                    }}
                                                    className="px-3 py-1 hover:bg-[#3a3a3a] cursor-pointer"
                                                >
                                                    {entry}
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right Side: Share Button */}
            <div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded">
                    Share
                </button>
            </div>
        </header>
    );
};

export default Header;
