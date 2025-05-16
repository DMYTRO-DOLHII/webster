import React from "react";
import { RxCursorArrow } from "react-icons/rx";
import { TbVector } from "react-icons/tb";
import { TbBrush } from "react-icons/tb";
import { PiEraserBold } from "react-icons/pi";
import { LiaCropAltSolid } from "react-icons/lia";
import { RiFontFamily } from "react-icons/ri";
import { BiSolidEyedropper } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
// import { FaMousePointer, FaVectorSquare, FaBrush, FaEraser, FaCropAlt, FaFont, FaEyeDropper, FaSearch } from "react-icons/fa";

const tools = [
    { id: "move", icon: <RxCursorArrow size={15}/>, label: "Move Tool" },
    { id: "select", icon: <TbVector size={15}/>, label: "Select Tool" },
    { id: "brush", icon: <TbBrush size={16}/>, label: "Brush Tool" },
    { id: "eraser", icon: <PiEraserBold size={17}/>, label: "Eraser Tool" },
    { id: "crop", icon: <LiaCropAltSolid size={19}/>, label: "Crop Tool" },
    { id: "text", icon: <RiFontFamily size={15}/>, label: "Text Tool" },
    { id: "picker", icon: <BiSolidEyedropper size={17}/>, label: "Color Picker" },
    { id: "zoom", icon: <IoIosSearch size={18}/>, label: "Zoom Tool" },
];

const LeftSidebar = () => {
    return (
        <div className="w-12 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col items-center py-4 space-y-4">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    title={tool.label}
                    className="text-white hover:text-blue-400 transition-colors text-[1.1rem] mt-1"
                >
                    {tool.icon}
                </button>
            ))}
        </div>
    );
};

export default LeftSidebar;
