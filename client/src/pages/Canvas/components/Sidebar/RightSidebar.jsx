import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Layers from "./Layers";
import Properties from "./Properties";
import History from "./History";

const RightSidebar = ({ layers, setShapes }) => {
    const [selectedLayerId, setSelectedLayerId] = useState(null);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="pt-15 w-64 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 text-white overflow-auto">
                <Layers layers={layers} setShapes={setShapes} setSelectedLayerId={setSelectedLayerId} selectedLayerId={selectedLayerId} />
                <Properties selectedLayerId={selectedLayerId} layers={layers} setShapes={setShapes} />
                <History />
            </div>
        </DndProvider>
    );
};

export default RightSidebar;
