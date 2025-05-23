import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
    LAYER: 'layer',
};

const Layers = ({ layers, setShapes, setSelectedLayerId, selectedLayerId }) => {
    console.log(layers);
    const [editingLayerId, setEditingLayerId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState("");
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleToggleVisibility = (id) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === id ? { ...shape, visible: !shape.visible } : shape
            )
        );
    };

    const handleNameChange = (id, name) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === id ? { ...shape, name } : shape
            )
        );
    };

    const moveLayer = (dragIndex, hoverIndex) => {
        setShapes(prev => {
            const reordered = [...prev];
            const [moved] = reordered.splice(prev.length - 1 - dragIndex, 1);
            reordered.splice(prev.length - 1 - hoverIndex, 0, moved);
            return reordered;
        });
    };

    const startEditing = (id, currentName) => {
        setEditingLayerId(id);
        setNameInputValue(currentName);
    };

    const finishEditing = (id) => {
        handleNameChange(id, nameInputValue?.trim() || " ");
        setEditingLayerId(null);
    };

    const LayerItem = ({ layer, index }) => {
        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.LAYER,
            item: { index },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: ItemTypes.LAYER,
            hover: (item) => {
                if (item.index !== index) {
                    setHoveredIndex(index);
                }
            },
            drop: (item) => {
                if (hoveredIndex != null && item.index !== hoveredIndex) {
                    moveLayer(item.index, hoveredIndex);
                    item.index = hoveredIndex;
                }
                setHoveredIndex(null);
            },
        });

        return (
            <div
                ref={node => drag(drop(node))}
                key={layer.id}
                className={`flex justify-between items-center text-xs mb-1 px-2 py-1 rounded cursor-pointer 
                    ${selectedLayerId === layer.id ? 'bg-blue-600' : 'opacity-70 hover:bg-[#2a2a2a]'}`}
                onDoubleClick={() => startEditing(layer.id, layer.name)}
                onClick={() => {
                    setSelectedLayerId(layer.id);
                    setHoveredIndex(null);
                }}
                title={layer.name}
                style={{ opacity: isDragging ? 0.5 : 1 }}
            >
                {editingLayerId === layer.id ? (
                    <input
                        className="bg-transparent border-b border-white text-white focus:outline-none px-1 mr-2 w-full"
                        value={nameInputValue}
                        autoFocus
                        onChange={(e) => setNameInputValue(e.target.value)}
                        onBlur={() => finishEditing(layer.id)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") finishEditing(layer.id);
                            else if (e.key === "Escape") setEditingLayerId(null);
                        }}
                    />
                ) : (
                    <span className="truncate mr-2">{layer.name}</span>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(layer.id);
                    }}
                    title={layer.visible === false ? "Show layer" : "Hide layer"}
                    className="ml-2 text-white hover:text-gray-400"
                >
                    {layer.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        );
    };

    return (
        <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Layers</h2>
            {layers && layers.length > 0 ? (
                [...layers].slice().reverse().map((layer, index) => (
                    <React.Fragment key={layer.id}>
                        <LayerItem layer={layer} index={index} />
                        {hoveredIndex === index && (
                            <div className="h-0.5 bg-blue-500" style={{ margin: '0 -8px' }} />
                        )}
                    </React.Fragment>
                ))
            ) : (
                <div className="text-xs opacity-50">No layers available</div>
            )}
        </div>
    );
};

export default Layers;
