import React, { useRef, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import Design from "./components/Design/Design";
import { Excalidraw } from "@excalidraw/excalidraw";


const Canvas = () => {
    const getDesignJsonRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState(null); // ✅ Image state

    const handleSaveClick = () => {
        if (getDesignJsonRef.current) {
            const json = getDesignJsonRef.current();
            console.log("Saved Design JSON:", json);
        } else {
            console.warn("Design reference is not set yet.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-grow">
                {/* ✅ Pass setter to Sidebar */}
                {/* <Sidebar onUploadImage={setUploadedImage} /> */}

                <div className="flex-grow bg-[#121212] overflow-auto flex flex-col">
                    <div className="p-2">
                        <button
                            onClick={handleSaveClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save Design
                        </button>
                    </div>

                    <div className="h-full">
                        {/* ✅ Pass uploaded image URL to Design */}
                        {/* <Design
                            onSaveRef={(fn) => (getDesignJsonRef.current = fn)}
                            imageUrl={uploadedImage}
                        /> */}
                        {/* <h1 style={{ textAlign: "center" }}>Excalidraw Example</h1> */}
                        
                        <div 
                        className="h-full"
                        // style={{ height: "100vh" }}
                        >
                            <Excalidraw />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
