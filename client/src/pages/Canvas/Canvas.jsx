import React, { useRef } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header";
import Design from "./components/Design/Design";

const Canvas = () => {
    const getDesignJsonRef = useRef(null);

    const handleSaveClick = () => {
        if (getDesignJsonRef.current) {
            const json = getDesignJsonRef.current(); // Safely call the function
            console.log("Saved Design JSON:", json);
        } else {
            console.warn("Design reference is not set yet.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Header />

            <div className="flex flex-grow">
                <Sidebar />

                <div className="flex-grow bg-[#121212] overflow-auto flex flex-col">
                    <div className="p-2">
                        <button
                            onClick={handleSaveClick}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Save Design
                        </button>
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                        <Design onSaveRef={(fn) => (getDesignJsonRef.current = fn)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canvas;
