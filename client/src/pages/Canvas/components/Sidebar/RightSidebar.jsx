import React from "react";
import { Eye, EyeOff } from "lucide-react"; // Можно любую иконку использовать

const RightSidebar = ({ layers, onToggleVisibility }) => {
    return (
        <div className="pt-15 w-64 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 text-white overflow-auto">
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Layers</h2>
                {layers && layers.length > 0 ? (
                    layers.map((layer, index) => (
                        <div key={layer.id} className="flex justify-between items-center text-xs opacity-70 mb-1">
                            <span>{`Layer ${index + 1}: ${layer.type}`}</span>
                            <button
                                onClick={() => onToggleVisibility(layer.id)}
                                title={layer.visible === false ? "Show layer" : "Hide layer"}
                                className="ml-2 text-white hover:text-gray-400"
                            >
                                {layer.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-xs opacity-50">No layers available</div>
                )}
            </div>

            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
                <div className="text-xs opacity-70">Select a layer to see properties</div>
            </div>

            <div>
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">History</h2>
                <div className="text-xs opacity-70">No history available</div>
            </div>
        </div>
    );
};

export default RightSidebar;
