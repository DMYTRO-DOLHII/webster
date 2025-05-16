import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LuBrainCircuit } from "react-icons/lu";
import { AsciiToHexadecimal } from "@ilihub/ascii-to-hexadecimal";

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

const Header = ({ onSave }) => {
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
    };

    const handleSaveAsMcOksterClick = async () => {
        try {
            if (onSave) onSave();
            await new Promise(resolve => setTimeout(resolve, 100));

            const designJson = localStorage.getItem("designData");
            if (!designJson) {
                alert("No design data to save!");
                return;
            }

            const hex = AsciiToHexadecimal(designJson);
            // const hex = converter.convert(designJson);

            const options = {
                suggestedName: "design.mcokster",
                types: [{
                    description: "McOkster File",
                    accept: { "application/octet-stream": [".mcokster"] },
                }],
            };

            const handle = await window.showSaveFilePicker(options);
            const writable = await handle.createWritable();
            await writable.write(hex);
            await writable.close();

        } catch (err) {
            console.error("Save as McOkster failed:", err);
            alert("Failed to save file.");
        }
    };



    const handleMenuItemClick = (item, entry) => {
        console.log(`${item} → ${entry}`);
        setOpenMenu(null);

        if (item === "File" && entry === "Save as McOkster") {
            handleSaveAsMcOksterClick();
        }

        // Handle other items if needed
    };

    return (
        <header className="flex justify-between items-center px-4 h-12 bg-[#1c1c1c] text-white border-b border-[#2a2a2a] relative">
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
                                <div className="absolute mt-1 min-w-[160px] z-999 bg-[#363636] backdrop-blur-md border border-[#444] text-sm rounded py-1 shadow-lg">
                                    {entries.length === 0 ? (
                                        <div className="px-3 py-1 text-gray-400">Coming Soon</div>
                                    ) : (
                                        entries.map((entry, idx) =>
                                            entry === "---" ? (
                                                <div key={`sep-${idx}`} className="border-t border-[#444] my-1"></div>
                                            ) : (
                                                <div
                                                    key={entry}
                                                    onClick={() => handleMenuItemClick(item, entry)}
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

            <div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded">
                    Share
                </button>
            </div>
        </header>
    );
};

export default Header;
