import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Design from "./components/Design/Design";
import { editorStore } from '../../store/editorStore';
import { api } from "../../services/api";

const Canvas = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const getDesignJsonRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [shapes, setShapes] = useState([]); // Состояние для хранения слоев
  
  useEffect(() => {
    return () => {
      localStorage.removeItem("zoomValue");
    };
  }, []);
  const handleToggleVisibility = (id) => {
    setShapes((prevShapes) =>
      prevShapes.map((shape) =>
        shape.id === id ? { ...shape, visible: !shape.visible } : shape
      )
    );
  };

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
        <div
          className="bg-[#121212] flex items-center justify-center w-full overflow-hidden"
          id="canvas-parent"
          ref={containerRef}
        >
          <Design
            onSaveRef={(fn) => (getDesignJsonRef.current = fn)}
            shapes={shapes}
            zoom={zoom}
            containerSize={containerSize}
            initialData={projectData.json}
            setZoom={handleZoomChange}
            onShapesChange={setShapes}
          />
        </div>
        <RightSidebar layers={shapes} onToggleVisibility={handleToggleVisibility} /> {/* Передаем слои в сайдбар */}
      </div>
      <Footer zoom={zoom} setZoom={handleZoomChange} />
    </div>
  );
};

export default Canvas;
