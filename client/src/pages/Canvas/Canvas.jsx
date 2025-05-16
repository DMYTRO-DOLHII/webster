// Canvas.jsx
import React, { useRef } from "react";
import LeftSidebar from "./components/Sidebar/LeftSidebar";
import RightSidebar from "./components/Sidebar/RightSidebar";
import Header from "./components/Header";
import Design from "./components/Design/Design";

const Canvas = () => {
    const getDesignJsonRef = useRef(null);

    const handleSaveClick = () => {
        if (getDesignJsonRef.current) {
            const json = getDesignJsonRef.current();
            console.log("Saved Design JSON:", json);
            localStorage.setItem("designData", json);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header onSave={handleSaveClick} />
            <div className="flex flex-grow overflow-hidden">
                <LeftSidebar />

                <div className="flex-grow bg-[#121212] flex items-center justify-center">
                    <Design onSaveRef={(fn) => (getDesignJsonRef.current = fn)} />
                </div>

                <RightSidebar />
            </div>
        </div>
    );
};

export default Canvas;
