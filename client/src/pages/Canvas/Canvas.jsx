import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Design from "./components/Design/Design";
import { editorStore } from '../../store/editorStore';
import axios from "axios"; // or fetch, but axios is more convenient
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

  const handleSaveClick = () => {
    if (getDesignJsonRef.current) {
      const json = getDesignJsonRef.current();
      localStorage.setItem("designData", json);
    }
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     const canvasH = document.getElementById('canvas-parent').clientHeight;
  //     const canvasW = document.getElementById('canvas-parent').clientWidth;
  //     setContainerSize({ width: canvasW, height: canvasH });
  //   };

  //   // Используем setTimeout для отложенного выполнения
  //   const timeoutId = setTimeout(handleResize, 0);

  //   // Чистим таймер при размонтировании компонента
  //   return () => clearTimeout(timeoutId);
  // }, []);
useEffect(() => {
  const updateSize = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      console.log("Measured size:", { width, height });
      setContainerSize({ width, height });
    }
  };

  const timeout = setTimeout(updateSize, 100); // Задержка 100мс после монтирования

  return () => clearTimeout(timeout);
}, []);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
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
        <div
          className="bg-[#121212] flex items-center justify-center w-full overflow-hidden"
          id="canvas-parent"
          ref={containerRef}
        >
          <Design
            onSaveRef={(fn) => (getDesignJsonRef.current = fn)}
            zoom={zoom}
            containerSize={containerSize}
            initialData={projectData.json}
          />
        </div>
        <RightSidebar />
      </div>
      <Footer zoom={zoom} setZoom={setZoom} />
    </div>
  );
};


export default Canvas;
