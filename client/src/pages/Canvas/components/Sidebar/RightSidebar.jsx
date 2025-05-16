import React from "react";

const RightSidebar = () => {
    return (
        <div className="w-64 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 text-white overflow-auto">
            {/* Example Panels */}
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Layers</h2>
                <div className="text-xs opacity-70">Layer 1</div>
                <div className="text-xs opacity-70">Layer 2</div>
            </div>

            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
                <div className="text-xs opacity-70">Position: X=100, Y=200</div>
                <div className="text-xs opacity-70">Size: 400 x 300</div>
            </div>

            <div>
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">History</h2>
                <div className="text-xs opacity-70">Added rectangle</div>
                <div className="text-xs opacity-70">Changed color</div>
            </div>
        </div>
    );
};

export default RightSidebar;
