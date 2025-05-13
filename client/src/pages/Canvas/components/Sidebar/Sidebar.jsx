import React, { useState } from "react";
import SidebarButton from './SidebarButton';
import { FaRegWindowMaximize } from "react-icons/fa";
import { FaElementor } from "react-icons/fa";
import { MdTextFields } from "react-icons/md";
import { PiUploadSimple } from "react-icons/pi";
import { CiFolderOn } from "react-icons/ci";

const sections = [
    { id: "design", label: "Design", icon: <FaRegWindowMaximize size={15}/> },
    { id: "elements", label: "Elements", icon: <FaElementor size={15}/> },
    { id: "text", label: "Text", icon: <MdTextFields size={15}/> },
    { id: "uploads", label: "Uploads", icon: <PiUploadSimple size={15}/> },
    { id: "projects", label: "Projects", icon: <CiFolderOn size={15}/> },
];

const Sidebar = () => {
    const [active, setActive] = useState(null);

    // Function to render the corresponding panel based on the active section
    const renderPanel = () => {
        switch (active) {
            case "design":
                return (<div>Design Panel</div>);
            case "elements":
                return (<div>Elements Panel</div>);
            case "text":
                return (<div>Text Panel</div>);
            case "uploads":
                return (<div>Uploads Panel</div>);
            case "projects":
                return (<div>Projects Panel</div>);
            default:
                return null;
        }
    };

    // Function to handle panel selection
    const handleSelectPanel = (id) => {
        // If the panel is already active, close it (set active to null)
        if (active === id) {
            setActive(null);
        } else {
            setActive(id); // Otherwise, open the clicked panel
        }
    };

    return (
        <div className="flex h-full">
            {/* Main sidebar */}
            <div className="w-20 bg-[#1a1a1a] flex flex-col items-center py-4 space-y-4 border-r border-[#2a2a2a]">
                {sections.map((section) => (
                    <SidebarButton
                        key={section.id}
                        value={section.label}
                        label={section.label}
                        icon={section.icon}
                        active={active === section.id}
                        onClick={() => handleSelectPanel(section.id)}  // Pass the section id to handleSelectPanel
                    />
                ))}
            </div>

            {/* Secondary panel */}
            {active && (
                <div className="w-64 bg-[#141414] border-r border-[#2a2a2a] p-4">
                    {renderPanel()} {/* Render the corresponding panel */}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
