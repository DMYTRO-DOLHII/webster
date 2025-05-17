import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Design from "./components/Design/Design";
import { editorStore } from '../../store/editorStore';
import axios from "axios"; // or fetch, but axios is more convenient
import { api } from "../../services/api";

const Canvas = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const getDesignJsonRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [projectData, setProjectData] = useState(null);

    const handleSaveClick = () => {
        if (getDesignJsonRef.current) {
            const json = getDesignJsonRef.current();
            localStorage.setItem("designData", json);
        }
    };

    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log(projectId)
                const res = await api.get(`/projects/${projectId}`);
                console.log(res.data);
                setProjectData(res.data); // assume it contains JSON and metadata
                setLoading(false);
                localStorage.setItem("designData", JSON.stringify(res.data.info));
            } catch (err) {
                if (err.response?.status === 403) {
                    setError("You do not have permission to access this project.");
                } else if (err.response?.status === 404) {
                    setError("Project not found.");
                } else {
                    setError("Something went wrong.", err);
                }
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    if (loading) return <div>Loading project...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col h-screen">
            <Header onSave={handleSaveClick} />
            <div className="flex flex-grow overflow-hidden">
                <LeftSidebar />
                <div className="flex-grow bg-[#121212] flex items-center justify-center">
                    <Design
                        onSaveRef={(fn) => (getDesignJsonRef.current = fn)}
                        initialData={projectData.json} // assuming backend returns { json: {...}, name: '...' }
                    />
                </div>
                <RightSidebar />
            </div>
        </div>
    );
};

export default Canvas;
