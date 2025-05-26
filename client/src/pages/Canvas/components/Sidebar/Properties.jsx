import React from 'react';
import { isShape, isText } from "../Shapes";
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { editorStore } from '../../../../store/editorStore';
import { observer } from 'mobx-react-lite';

const Properties = observer(({ layers, setShapes }) => {
    const updateShape = (key, value, selectedLayer) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === selectedLayer.id ? { ...shape, [key]: value } : shape
            )
        );
    };

    if (!editorStore.selectedShapeId) {
        return (
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
                <div className="text-xs opacity-70">Select a layer to see properties</div>
            </div>
        )
    }

    const selectedLayer = layers.find(layer => layer.id === editorStore.selectedShapeId);
    if (!selectedLayer) return null;

    // Because fontStyle might contain multiple styles e.g. "italic bold", we should handle toggling carefully for bold and italic separately.
    const hasBold = selectedLayer.fontStyle ? selectedLayer.fontStyle.includes("bold") : false;
    const hasItalic = selectedLayer.fontStyle ? selectedLayer.fontStyle.includes("italic") : false;

    const toggleBold = () => {
        let styles = selectedLayer.fontStyle ? selectedLayer.fontStyle.split(" ") : [];
        if (hasBold) {
            styles = styles.filter(s => s !== "bold");
        } else {
            styles.push("bold");
        }
        updateShape("fontStyle", styles.join(" ").trim() || "normal", selectedLayer);
    };

    const toggleItalic = () => {
        let styles = selectedLayer.fontStyle ? selectedLayer.fontStyle.split(" ") : [];
        if (hasItalic) {
            styles = styles.filter(s => s !== "italic");
        } else {
            styles.push("italic");
        }
        updateShape("fontStyle", styles.join(" ").trim() || "normal", selectedLayer);
    };

    const toggleUnderline = () => {
        const current = selectedLayer.textDecoration || "";
        updateShape("textDecoration", current === "underline" ? "" : "underline", selectedLayer);
    };

    const toggleStrike = () => {
        const current = selectedLayer.textDecoration || "";
        updateShape("textDecoration", current === "line-through" ? "" : "line-through", selectedLayer);
    };

    return (
        <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
            <div className="text-xs space-y-4">
                {/* Shape Properties */}
                {isShape(selectedLayer.type) && (
                    <div className="space-y-2">
                        {selectedLayer.type !== 'line' &&
                            (<div className="flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-300">Color</label>
                                <input
                                    type="color"
                                    className="w-10 h-6 border-none rounded"
                                    value={selectedLayer.fill === "white" ? "#ffffff" : selectedLayer.fill || "#000000"}
                                    onChange={(e) => updateShape("fill", e.target.value, selectedLayer)}
                                />
                            </div>
                            )}
                        {selectedLayer.type === "rect" && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Width</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.width || 0}
                                        onChange={(e) => {
                                            const width = parseFloat(e.target.value);
                                            updateShape("width", width, selectedLayer);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Height</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.height || 0}
                                        onChange={(e) => {
                                            const height = parseFloat(e.target.value);
                                            updateShape("height", height, selectedLayer);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {selectedLayer.type === "circle" && (
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Radius</label>
                                <input
                                    type="number"
                                    className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                    value={selectedLayer.radius || 0}
                                    onChange={(e) => {
                                        const radius = parseFloat(e.target.value);
                                        updateShape("radius", radius, selectedLayer);
                                    }}
                                />
                            </div>
                        )}
                        {selectedLayer.type === "triangle" && (
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Sides</label>
                                <input
                                    type="number"
                                    className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                    value={selectedLayer.sides || 0}
                                    onChange={(e) => {
                                        const sides = parseFloat(e.target.value);
                                        updateShape("sides", sides, selectedLayer);
                                    }}
                                />
                            </div>
                        )}
                        {selectedLayer.type === "pentagon" && (
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Sides</label>
                                <input
                                    type="number"
                                    className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                    value={selectedLayer.sides || 0}
                                    onChange={(e) => {
                                        const sides = parseFloat(e.target.value);
                                        updateShape("sides", sides, selectedLayer);
                                    }}
                                />
                            </div>
                        )}
                        {selectedLayer.type === "hexagon" && (
                            <div>
                                <label className="block text-xs font-medium text-gray-300 mb-1">Sides</label>
                                <input
                                    type="number"
                                    className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                    value={selectedLayer.sides || 0}
                                    onChange={(e) => {
                                        const sides = parseFloat(e.target.value);
                                        updateShape("sides", sides, selectedLayer);
                                    }}
                                />
                            </div>
                        )}
                        {selectedLayer.type === "star" && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Num Points</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.numPoints || 0}
                                        onChange={(e) => {
                                            const numPoints = parseFloat(e.target.value);
                                            updateShape("numPoints", numPoints, selectedLayer);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Inner Radius</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.innerRadius || 0}
                                        onChange={(e) => {
                                            const innerRadius = parseFloat(e.target.value);
                                            updateShape("innerRadius", innerRadius, selectedLayer);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Outer Radius</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.outerRadius || 0}
                                        onChange={(e) => {
                                            const outerRadius = parseFloat(e.target.value);
                                            updateShape("outerRadius", outerRadius, selectedLayer);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {selectedLayer.type === "line" && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Stroke</label>
                                    <input
                                        type="color"
                                        className="w-10 h-6 border-none rounded"
                                        value={selectedLayer.stroke || "#000000"}
                                        onChange={(e) => updateShape("stroke", e.target.value, selectedLayer)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Stroke Width</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.strokeWidth || 0}
                                        onChange={(e) => {
                                            const strokeWidth = parseFloat(e.target.value);
                                            updateShape("strokeWidth", strokeWidth, selectedLayer);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                        {selectedLayer.type === "arrow" && (
                            <>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Stroke</label>
                                    <input
                                        type="color"
                                        className="w-10 h-6 border-none rounded"
                                        value={selectedLayer.stroke || "#000000"}
                                        onChange={(e) => updateShape("stroke", e.target.value, selectedLayer)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Stroke Width</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.strokeWidth || 0}
                                        onChange={(e) => {
                                            const strokeWidth = parseFloat(e.target.value);
                                            updateShape("strokeWidth", strokeWidth, selectedLayer);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Pointer Length</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.pointerLength || 0}
                                        onChange={(e) => {
                                            const pointerLength = parseFloat(e.target.value);
                                            updateShape("pointerLength", pointerLength, selectedLayer);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">Pointer Width</label>
                                    <input
                                        type="number"
                                        className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                        value={selectedLayer.pointerWidth || 0}
                                        onChange={(e) => {
                                            const pointerWidth = parseFloat(e.target.value);
                                            updateShape("pointerWidth", pointerWidth, selectedLayer);
                                        }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Text Properties */}
                {isText(selectedLayer.type) && (
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-gray-300">Color</label>
                            <input
                                type="color"
                                className="w-10 h-6 border-none rounded"
                                value={selectedLayer.fill}
                                onChange={(e) => updateShape("fill", e.target.value, selectedLayer)}
                            />
                        </div>
                        {/* Text Formatting Icons */}
                        <div className="flex space-x-2 mb-2">
                            <button
                                onClick={toggleBold}
                                className={`p-1 rounded ${hasBold ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Bold"
                                type="button"
                            >
                                <Bold color="white" size={16} />
                            </button>
                            <button
                                onClick={toggleItalic}
                                className={`p-1 rounded ${hasItalic ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Italic"
                                type="button"
                            >
                                <Italic color="white" size={16} />
                            </button>
                            <button
                                onClick={toggleUnderline}
                                className={`p-1 rounded ${(selectedLayer.textDecoration === "underline") ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Underline"
                                type="button"
                            >
                                <Underline color="white" size={16} />
                            </button>
                            <button
                                onClick={toggleStrike}
                                className={`p-1 rounded ${(selectedLayer.textDecoration === "line-through") ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Strikethrough"
                                type="button"
                            >
                                <Strikethrough color="white" size={16} />
                            </button>
                        </div>

                        {/* Text Alignment */}
                        <div className="flex space-x-2 mb-2">
                            <button
                                onClick={() => updateShape("align", "left", selectedLayer)}
                                className={`p-1 rounded ${(selectedLayer.align === "left") ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Align Left"
                                type="button"
                            >
                                <AlignLeft color="white" size={16} />
                            </button>
                            <button
                                onClick={() => updateShape("align", "center", selectedLayer)}
                                className={`p-1 rounded ${(selectedLayer.align === "center") ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Align Center"
                                type="button"
                            >
                                <AlignCenter color="white" size={16} />
                            </button>
                            <button
                                onClick={() => updateShape("align", "right", selectedLayer)}
                                className={`p-1 rounded ${(selectedLayer.align === "right") ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title="Align Right"
                                type="button"
                            >
                                <AlignRight color="white" size={16} />
                            </button>
                        </div>

                        {/* Font Family */}
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Font Family</label>
                            <select
                                className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                value={selectedLayer.fontFamily || "Arial"}
                                onChange={(e) => updateShape("fontFamily", e.target.value, selectedLayer)}
                            >
                                {["Arial", "Verdana", "Times New Roman", "Georgia", "Courier New", "Trebuchet MS", "Comic Sans MS", "Inter"].map(font => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1">Font Size</label>
                            <input
                                type="number"
                                min={1}
                                className="bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm"
                                value={selectedLayer.fontSize || 12}
                                onChange={(e) => updateShape("fontSize", parseInt(e.target.value), selectedLayer)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default Properties;
