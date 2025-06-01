import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { api } from "../../../services/api";

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [editableTitle, setEditableTitle] = useState(project.title);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleTitleChange = async (e) => {
        const newTitle = e.target.value;
        setEditableTitle(newTitle);
        project.title = newTitle;
        await api.patch(`/projects/${project.id}`, { title: newTitle });
    };

    return (
        <article
            className="relative group p-3 border border-[#222] rounded-md cursor-pointer duration-300 hover:border-[#414141] hover:shadow-lg hover:shadow-[#a020f0]/30 w-[220px]"
            onClick={() => navigate(`/canvas/${project.id}`)}
        >
            {/* Three Dots Button */}
            <button
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity
             bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full p-1 shadow-md"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <MoreHorizontal className="text-pink-500 w-5 h-5" />
            </button>

            {/* Preview Image */}
            <img
                alt="project preview"
                className="w-full h-[120px] object-cover rounded mb-2"
                src={project.imageUrl}
            />

            {/* Info Section */}
            <div className="flex flex-col justify-between text-white text-xs">
                <h2 className="font-medium">{project.title}</h2>
                <p className="text-[#888] text-[10px] mt-1">{project.editedText}</p>
                <p className="text-[#555] mt-1">
                    {project.info.attrs.width} x {project.info.attrs.height} {project.units || "px"}
                </p>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-10 right-2 w-56 z-50 bg-[#1e1e1e] border border-[#333] rounded-md p-3 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="text"
                        value={editableTitle}
                        onChange={handleTitleChange}
                        className="w-full bg-[#2a2a2a] text-white text-sm px-2 py-1 rounded mb-2 focus:outline-none"
                    />

                    <div className="text-xs text-gray-400 mb-3">
                        {project.info.attrs.width} x {project.info.attrs.height} {project.units || "px"}
                    </div>

                    <div className="border-t border-[#444] pt-2 text-sm text-white space-y-2">
                        <button className="w-full text-left hover:text-purple-400">Move to Folder</button>
                        <button className="w-full text-left hover:text-purple-400">Download</button>
                        <button className="w-full text-left hover:text-purple-400">Copy Link</button>
                    </div>

                    <div className="border-t border-[#444] mt-2 pt-2 text-sm text-red-400">
                        <button
                            onClick={() => {
                                onDelete?.();
                                setIsDropdownOpen(false);
                            }}
                            className="w-full text-left hover:text-red-600"
                        >
                            Delete Project
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ProjectCard;
