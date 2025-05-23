import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../../store/userStore";
import { MoreHorizontal } from "lucide-react"; // or use any 3-dot icon
import clsx from "clsx";
import { api } from "../../../services/api";
import { editorStore } from "../../../store/editorStore";

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [editableTitle, setEditableTitle] = useState(project.title);

    // Handle clicks outside dropdown
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
        setEditableTitle(e.target.value);
        project.title = e.target.value;

        await api.patch(`/projects/${project.id}`, { title: project.title });
        // TODO: Optional: debounce update to backend
    };

    return (
        <article
            className="relative group flex gap-4 p-3 border h-[150px] border-[#222222] rounded-md cursor-pointer duration-300 hover:border-[#414141] hover:shadow-lg hover:shadow-[#a020f0]/30"
            onClick={() => {
                editorStore.setProject(project)
                navigate(`/canvas/${project.id}`)
            }}
        >
            {/* Three dots icon (only visible on hover) */}
            <button
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <MoreHorizontal className="text-white w-5 h-5" />
            </button>

            {/* Preview Image */}
            <img
                alt="project preview"
                className="object-cover w-40 h-30 rounded"
                src={project.imageUrl}
            />

            {/* Info Section */}
            <div className="flex flex-col justify-between flex-1">
                <div>
                    <h2 className="text-xs font-normal text-white">{project.title}</h2>
                    <p className="text-[9px] text-[#666666] mt-1">{project.editedText}</p>
                </div>
                <div>
                    <img
                        src={userStore?.user?.profilePicture}
                        className={`w-7 h-7 rounded-full ${project.userBgColor} ${project.userTextColor} text-xs font-semibold flex items-center justify-center ml-auto`}
                        alt=""
                    />
                </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-10 right-2 w-56 z-50 bg-[#1e1e1e] border border-[#333] rounded-md p-3 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Editable Title */}
                    <input
                        type="text"
                        value={editableTitle}
                        onChange={handleTitleChange}
                        className="w-full bg-[#2a2a2a] text-white text-sm px-2 py-1 rounded mb-2 focus:outline-none"
                    />

                    {/* Project Size */}
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
                                onDelete?.(); // safe optional chaining
                                setIsDropdownOpen(false);
                            }}
                            className="w-full text-left hover:text-red-600">Move to Trash</button>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ProjectCard;
