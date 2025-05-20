import React from "react";

const RightSidebar = ({ layers, onToggleVisibility }) => {
    return (
        <div className="pt-15 w-64 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 text-white overflow-auto">
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Layers</h2>
                {layers && layers.length > 0 ? (
                    layers.map((layer, index) => (
                        <div key={layer.id} className="flex items-center justify-between text-xs opacity-70 mb-1 cursor-pointer">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={layer.visible !== false}
                                    onChange={() => onToggleVisibility(layer.id)}
                                    className="mr-2"
                                />
                                {`Layer ${index + 1}: ${layer.type}`}
                            </label>
                        </div>
                    ))
                ) : (
                    <div className="text-xs opacity-50">No layers available</div>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
                {/* TODO: display properties of the selected layer */}
                <div className="text-xs opacity-70">Select a layer to see properties</div>
            </div>

            <div>
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">History</h2>
                {/* TODO: implement history log */}
                <div className="text-xs opacity-70">No history available</div>
            </div>
        </div>
    );
};

export default RightSidebar;
