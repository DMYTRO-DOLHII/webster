import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, X } from "lucide-react";
import { api } from "../../../services/api";
import { jsPDF } from 'jspdf';
window.jspdf = { jsPDF };

const ProjectCard = ({ project, onDelete }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [editableTitle, setEditableTitle] = useState(project.title);

    const width = Math.floor(project.info.attrs.width);
    const height = Math.floor(project.info.attrs.height);

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

    const handleCopyLink = () => {
        const projectUrl = `${window.location.origin}/canvas/${project.id}`;
        navigator.clipboard.writeText(projectUrl);
        setIsDropdownOpen(false);
    };

    const handleDownload = async (format) => {
        try {
            if (format === 'pdf') {
                // Get dimensions from project data
                const { width, height } = project.info.attrs;
                
                // Create PDF with proper dimensions
                const orientation = width > height ? 'landscape' : 'portrait';
                const pdf = new jsPDF({
                    orientation,
                    unit: 'px',
                    format: [width, height]
                });

                // Calculate scaling to fit the page while maintaining aspect ratio
                const pageWidth = orientation === 'landscape' ? pdf.internal.pageSize.getHeight() : pdf.internal.pageSize.getWidth();
                const pageHeight = orientation === 'landscape' ? pdf.internal.pageSize.getWidth() : pdf.internal.pageSize.getHeight();
                
                const scale = Math.min(pageWidth / width, pageHeight / height);
                const x = (pageWidth - width * scale) / 2;
                const y = (pageHeight - height * scale) / 2;

                pdf.addImage(project.imageUrl, 'PNG', x, y, width * scale, height * scale);
                pdf.save(`${project.title}.pdf`);
            } else {
                // For PNG/JPG/SVG, we can use the base64 directly
                const link = document.createElement('a');
                link.download = `${project.title}.${format}`;
                link.href = project.imageUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setIsDownloadModalOpen(false);
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    return (
        <article
            className="relative group p-2 border border-[#222] rounded-md cursor-pointer duration-300 hover:border-[#414141] hover:shadow-lg hover:shadow-[#a020f0]/30 w-[220px]"
            onClick={() => navigate(`/canvas/${project.id}`)}
        >
            {/* Three Dots Button */}
            <button
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/80 p-1 rounded-md backdrop-blur-sm"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownOpen(!isDropdownOpen);
                }}
            >
                <MoreHorizontal className="text-white/90 w-4 h-4" />
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
                    {width} x {height} {project.units || "px"}
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
                        {width} x {height} {project.units || "px"}
                    </div>

                    <div className="border-t border-[#444] pt-2 text-sm text-white space-y-2">
                        <button 
                            onClick={() => setIsDownloadModalOpen(true)}
                            className="w-full text-left hover:text-purple-400"
                        >
                            Download
                        </button>
                        <button 
                            onClick={handleCopyLink}
                            className="w-full text-left hover:text-purple-400"
                        >
                            Copy Link
                        </button>
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

            {/* Download Modal */}
            {isDownloadModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsDownloadModalOpen(false);
                    }}
                >
                    <div 
                        className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 w-80 shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-lg font-medium">Download As</h3>
                            <button 
                                onClick={() => setIsDownloadModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            <button
                                onClick={() => handleDownload('png')}
                                className="w-full p-2 text-left text-white hover:bg-purple-600/20 rounded transition-colors"
                            >
                                PNG Image
                            </button>
                            <button
                                onClick={() => handleDownload('jpg')}
                                className="w-full p-2 text-left text-white hover:bg-purple-600/20 rounded transition-colors"
                            >
                                JPEG Image
                            </button>
                            <button
                                onClick={() => handleDownload('svg')}
                                className="w-full p-2 text-left text-white hover:bg-purple-600/20 rounded transition-colors"
                            >
                                SVG Vector
                            </button>
                            <button
                                onClick={() => handleDownload('pdf')}
                                className="w-full p-2 text-left text-white hover:bg-purple-600/20 rounded transition-colors"
                            >
                                PDF Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ProjectCard;
