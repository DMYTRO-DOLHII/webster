// Canvas.jsx
import React, { useRef, useState, useEffect } from "react";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Design from "./components/Design/Design";
import { editorStore } from '../../store/editorStore';


const Canvas = () => {
  const getDesignJsonRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const handleSaveClick = () => {
    if (getDesignJsonRef.current) {
      const json = getDesignJsonRef.current();
      localStorage.setItem("designData", json);
    }
  };

useEffect(() => {
  const handleResize = () => {
    const canvasH = document.getElementById('canvas-parent').clientHeight;
    const canvasW = document.getElementById('canvas-parent').clientWidth;
    setContainerSize({ width: canvasW, height: canvasH });
  };

  // Используем setTimeout для отложенного выполнения
  const timeoutId = setTimeout(handleResize, 0);

  // Чистим таймер при размонтировании компонента
  return () => clearTimeout(timeoutId);
}, []);


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
          />
        </div>
        <RightSidebar />
      </div>
      <Footer zoom={zoom} setZoom={setZoom} />
    </div>
  );
};


export default Canvas;
