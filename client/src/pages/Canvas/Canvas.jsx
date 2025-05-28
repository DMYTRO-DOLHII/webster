import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Design from "./components/Design/Design";
import Error404 from "../404/404";
import { editorStore } from '../../store/editorStore';
import { api } from "../../services/api";

const Canvas = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const getDesignJsonRef = useRef(null);
    const containerRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [error, setError] = useState(false);
    const [projectData, setProjectData] = useState(null);
    const [shapes, setShapes] = useState([]); // Состояние для хранения слоев

    const [message, setMessage] = useState('Something went wrong')
    const [redirectPath, setRedirectPath] = useState('/');
    const [buttonText, setButtonText] = useState('Go to Main');
    const [errorCode, setErrorCode] = useState(404)

    useEffect(() => {
        return () => {
            localStorage.removeItem("zoomValue");
        };
    }, []);

    useEffect(() => {
        const parent = containerRef.current;
        if (!parent) return;

        const { scrollLeft, scrollTop, clientWidth, clientHeight, scrollWidth, scrollHeight } = parent;

        const centerX = scrollLeft + containerSize.width / 2;
        const centerY = scrollTop + containerSize.height / 2;

        const newScrollLeft = (centerX * zoom) - (containerSize.width / 2);
        const newScrollTop = (centerY * zoom) - (containerSize.height / 2);

        parent.scrollTo(newScrollLeft, newScrollTop);
    }, [zoom]);


    const handleSaveClick = () => {
        if (getDesignJsonRef.current) {
            const json = getDesignJsonRef.current();
            localStorage.setItem("designData", json);
        }
    };

    const handleZoomChange = (newZoom) => {
        setZoom(newZoom);
        localStorage.setItem('zoomValue', newZoom);
    };

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                const height = containerRef.current.offsetHeight;
                setContainerSize({ width, height });
            }
        };

        const timeout = setTimeout(updateSize, 100);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${projectId}`);
                setProjectData(res.data);
                editorStore.setProject(res.data);
                localStorage.setItem("designData", JSON.stringify(res.data.info));
            } catch (err) {
                if (err.response?.status === 403) {
                    setMessage('You cannot view this project, upgrade your plan');
                    setRedirectPath('/workspace')
                    setButtonText('Go to Workspace')
                    setErrorCode(403);
                } else if (err.response?.status === 404) {
                    setMessage('Project not found');
                    setRedirectPath('/workspace')
                    setButtonText('Go to Workspace')
                }

                console.log(error)
                setError(true);
            }
        };

        fetchProject();
    }, [projectId]);

    if (error) return <Error404 message={message} redirectPath={redirectPath} buttonText={buttonText} errorCode={errorCode} />;
    if (!projectData) return null;


    return (
        <div className="flex flex-col h-screen">
            <Header onSave={handleSaveClick} />
            <div className="flex flex-grow overflow-hidden">
                <LeftSidebar />
                <div
                    className="bg-[#121212] flex items-center justify-center w-full h-full overflow-scroll scroll-style"
                    id="canvas-parent"
                    ref={containerRef}
                >
                    <div className="relative min-w-fit min-h-fit">
                        <Design
                            onSaveRef={(fn) => (getDesignJsonRef.current = fn)}
                            shapes={shapes}
                            zoom={zoom}
                            containerSize={containerSize}
                            initialData={projectData.json}
                            setZoom={handleZoomChange}
                            setShapes={setShapes}
                        />
                    </div>
                </div>
                <RightSidebar layers={shapes} setShapes={setShapes} /> {/* Передаем слои в сайдбар */}
            </div>
            <Footer zoom={zoom} setZoom={handleZoomChange} />
        </div>
    );
};

export default Canvas;
