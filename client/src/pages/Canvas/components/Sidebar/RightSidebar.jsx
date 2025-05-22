import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const RightSidebar = ({ layers, setShapes }) => {
    const [editingLayerId, setEditingLayerId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState("");

    const handleToggleVisibility = (id) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) =>
                shape.id === id ? { ...shape, visible: !shape.visible } : shape
            )
        );
    };

    const handleNameChange = (id, name) => {
        setShapes((prevShapes) =>
            prevShapes.map((shape) =>
                shape.id === id ? { ...shape, name } : shape
            )
        );
    };

    const startEditing = (id, currentName) => {
        setEditingLayerId(id);
        setNameInputValue(currentName);
    };

    const finishEditing = (id) => {
        handleNameChange(id, nameInputValue.trim() || " ");
        setEditingLayerId(null);
    };

    return (
        <div className="pt-15 w-64 bg-[#1a1a1a] border-l border-[#2a2a2a] p-4 text-white overflow-auto">
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Layers</h2>
                {layers && layers.length > 0 ? (
                    [...layers].reverse().map((layer, index) => (
                        <div key={layer.id} className="flex justify-between items-center text-xs opacity-70 mb-1"
                            onDoubleClick={() => startEditing(layer.id, layer.name)}
                            title={layer.name}>
                            {editingLayerId === layer.id ? (
                                <input
                                    className="bg-transparent border-b border-white text-white focus:outline-none px-1 mr-2 w-full"
                                    value={nameInputValue}
                                    autoFocus
                                    onChange={(e) => setNameInputValue(e.target.value)}
                                    onBlur={() => finishEditing(layer.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            finishEditing(layer.id);
                                        } else if (e.key === "Escape") {
                                            setEditingLayerId(null);
                                        }
                                    }}
                                />
                            ) : (
                                <span
                                    className="cursor-pointer truncate mr-2"
                                >
                                    {`${layer.name}`}
                                </span>
                            )}
                            <button
                                onClick={() => handleToggleVisibility(layer.id)}
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
