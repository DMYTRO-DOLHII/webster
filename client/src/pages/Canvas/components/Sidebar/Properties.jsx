import React, { useState, useEffect } from 'react';
import FilterControl from '../Design/FilterControl';
import { isShape, isText } from "../Shapes";
import { Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, Plus, Minus } from "lucide-react";
import { editorStore } from '../../../../store/editorStore';
import { observer } from 'mobx-react-lite';

const Properties = observer(({ layers, setShapes }) => {
    const [isEditingOpacity, setIsEditingOpacity] = useState(false);
    const [opacityInputValue, setOpacityInputValue] = useState(1);
    const [isEditingBorderWidth, setIsEditingBorderWidth] = useState(false);
    const [borderWidthInputValue, setBorderWidthInputValue] = useState(0);

    const selectedLayer = layers.find(layer => layer.id === editorStore.selectedShapeId);

    useEffect(() => {
        if (selectedLayer) {
            setBorderWidthInputValue(selectedLayer.strokeWidth || 0);
            setOpacityInputValue((selectedLayer.opacity ?? 1).toFixed(2));
        }
    }, [selectedLayer]);

    const updateShape = (key, value, selectedLayer) => {
        setShapes(prev =>
            prev.map(shape =>
                shape.id === selectedLayer.id ? { ...shape, [key]: value } : shape
            )
        );
    };

    if (!editorStore.selectedShapeId || !selectedLayer) {
        return (
            <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">Properties</h2>
                <div className="text-xs opacity-70">Select a layer to see properties</div>
            </div>
        )
    }

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

    const handleOpacityDoubleClick = () => {
        setIsEditingOpacity(true);
    };

    const handleBorderWidthDoubleClick = () => {
        setIsEditingBorderWidth(true);
    };

    const commitOpacityChange = () => {
        const value = parseFloat(opacityInputValue);
        if (!isNaN(value) && value >= 0 && value <= 1) {
            updateShape("opacity", value, selectedLayer);
        }
        setIsEditingOpacity(false);
    };

    const commitBorderWidthChange = () => {
        const value = parseFloat(borderWidthInputValue);
        if (!selectedLayer?.stroke) updateShape("stroke", "#000000", selectedLayer);
        if (!isNaN(value) && value >= 0) {
            updateShape("strokeWidth", value, selectedLayer);
        }
        setIsEditingBorderWidth(false);
    };

    return (
        <div className='mb-6'>
            <h2 className='text-sm font-semibold mb-2 border-b border-[#333] pb-1'>Properties</h2>
            <div className='space-y-4 text-xs'>
                <div className='pb-2 border-b border-gray-600'>
                    <div className='flex items-center justify-between'>
                        <label className='block mb-1 text-xs font-medium text-gray-300'>Opacity</label>
                        {isEditingOpacity ? (
                            <input
                                type='number'
                                min='0'
                                max='1'
                                step='0.01'
                                value={opacityInputValue}
                                onChange={e => setOpacityInputValue(e.target.value)}
                                onBlur={commitOpacityChange}
                                onKeyDown={e => e.key === 'Enter' && commitOpacityChange()}
                                className='w-16 px-1 text-white rounded'
                            />
                        ) : (
                            <span onDoubleClick={handleOpacityDoubleClick} className='cursor-pointer select-none'>
                                {parseInt((selectedLayer.opacity ?? 1) * 100)}%
                            </span>
                        )}
                    </div>
                    <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.01'
                        value={selectedLayer.opacity ?? 1}
                        onChange={e => {
                            const newValue = parseFloat(e.target.value);
                            setOpacityInputValue(newValue.toFixed(2));
                            updateShape('opacity', newValue, selectedLayer);
                        }}
                        className='w-full'
                    />
                </div>

                <div className='pb-2 border-b border-gray-600'>
                    <div className='flex items-center justify-between'>
                        <label className='text-xs font-medium text-gray-300'>Border Color</label>
                        <input
                            type='color'
                            className='w-10 h-6 border-none rounded'
                            value={selectedLayer.stroke || '#000000'}
                            onChange={e => updateShape('stroke', e.target.value, selectedLayer)}
                        />
                    </div>

                    <div className='flex items-center justify-between mt-2'>
                        <label className='text-xs font-medium text-gray-300'>Border Width</label>
                        <div className='flex items-center space-x-2'>
                            <Minus
                                onClick={() => {
                                    const value = parseInt(borderWidthInputValue, 10);
                                    if (!isNaN(value) && value > 0) {
                                        const newValue = value - 1;
                                        setBorderWidthInputValue(newValue);
                                        updateShape('strokeWidth', newValue, selectedLayer);
                                    }
                                }}
                            />
                            {isEditingBorderWidth ? (
                                <input
                                    type='number'
                                    min='0'
                                    value={borderWidthInputValue}
                                    onChange={e => setBorderWidthInputValue(e.target.value)}
                                    onBlur={commitBorderWidthChange}
                                    onKeyDown={e => e.key === 'Enter' && commitBorderWidthChange()}
                                    className='w-16 px-1 text-white rounded'
                                />
                            ) : (
                                <span onDoubleClick={handleBorderWidthDoubleClick} className='cursor-pointer select-none'>
                                    {selectedLayer.strokeWidth || 0}px
                                </span>
                            )}
                            <Plus
                                onClick={() => {
                                    const value = parseInt(borderWidthInputValue, 10);
                                    if (!isNaN(value) && value >= 0) {
                                        const newValue = value + 1;
                                        setBorderWidthInputValue(newValue);
                                        updateShape('strokeWidth', newValue, selectedLayer);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {isShape(selectedLayer.type) && (
                    <div className='space-y-2'>
                        {selectedLayer.type !== 'line' ||
                            (selectedLayer.type !== 'image' && (
                                <div className='flex items-center justify-between'>
                                    <label className='text-xs font-medium text-gray-300'>Color</label>
                                    <input
                                        type='color'
                                        className='w-10 h-6 border-none rounded'
                                        value={selectedLayer.fill === 'white' ? '#ffffff' : selectedLayer.fill || '#000000'}
                                        onChange={e => updateShape('fill', e.target.value, selectedLayer)}
                                    />
                                </div>
                            ))}
                        {selectedLayer.type === 'image' && (
                            <>
                                <div>
                                    <label className='block mb-1 text-xs font-medium text-gray-300'>Width</label>
                                    <input
                                        type='number'
                                        className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                        value={selectedLayer.width || 0}
                                        onChange={e => updateShape('width', parseFloat(e.target.value), selectedLayer)}
                                    />
                                </div>
                                <div>
                                    <label className='block mb-1 text-xs font-medium text-gray-300'>Height</label>
                                    <input
                                        type='number'
                                        className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                        value={selectedLayer.height || 0}
                                        onChange={e => updateShape('height', parseFloat(e.target.value), selectedLayer)}
                                    />
                                </div>
                            </>
                        )}
                        {selectedLayer?.type === 'image' && (
                            <div className='mt-4'>
                                <h3 className='text-sm font-medium mb-2 border-b border-[#333] pb-1'>Image Filters</h3>
                                <div className='space-y-3'>
                                    <FilterControl
                                        name='blur'
                                        min={0}
                                        max={40}
                                        step={1}
                                        filters={selectedLayer.filters}
                                        setFilters={newFilters => updateShape('filters', newFilters, selectedLayer)}
                                    />
                                    <FilterControl
                                        name='brightness'
                                        min={-1}
                                        max={1}
                                        step={0.1}
                                        filters={selectedLayer.filters}
                                        setFilters={newFilters => updateShape('filters', newFilters, selectedLayer)}
                                    />
                                    <FilterControl
                                        name='contrast'
                                        min={-100}
                                        max={100}
                                        step={1}
                                        filters={selectedLayer.filters}
                                        setFilters={newFilters => updateShape('filters', newFilters, selectedLayer)}
                                    />
                                </div>
                            </div>
                        )}
                        {selectedLayer.type === 'rect' && (
                            <>
                                <div>
                                    <label className='block mb-1 text-xs font-medium text-gray-300'>Width</label>
                                    <input
                                        type='number'
                                        className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                        value={selectedLayer.width || 0}
                                        onChange={e => updateShape('width', parseFloat(e.target.value), selectedLayer)}
                                    />
                                </div>
                                <div>
                                    <label className='block mb-1 text-xs font-medium text-gray-300'>Height</label>
                                    <input
                                        type='number'
                                        className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                        value={selectedLayer.height || 0}
                                        onChange={e => updateShape('height', parseFloat(e.target.value), selectedLayer)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {isText(selectedLayer.type) && (
                    <>
                        <div className='flex items-center justify-between mb-2'>
                            <label className='text-xs font-medium text-gray-300'>Color</label>
                            <input
                                type='color'
                                className='w-10 h-6 border-none rounded'
                                value={selectedLayer.fill}
                                onChange={e => updateShape('fill', e.target.value, selectedLayer)}
                            />
                        </div>

                        <div className='flex mb-2 space-x-2'>
                            <button onClick={toggleBold} className={`p-1 rounded ${hasBold ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`} title='Bold' type='button'>
                                <Bold color='white' size={16} />
                            </button>
                            <button onClick={toggleItalic} className={`p-1 rounded ${hasItalic ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`} title='Italic' type='button'>
                                <Italic color='white' size={16} />
                            </button>
                            <button
                                onClick={toggleUnderline}
                                className={`p-1 rounded ${selectedLayer.textDecoration === 'underline' ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title='Underline'
                                type='button'
                            >
                                <Underline color='white' size={16} />
                            </button>
                            <button
                                onClick={toggleStrike}
                                className={`p-1 rounded ${selectedLayer.textDecoration === 'line-through' ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title='Strikethrough'
                                type='button'
                            >
                                <Strikethrough color='white' size={16} />
                            </button>
                        </div>

                        <div className='flex mb-2 space-x-2'>
                            <button
                                onClick={() => updateShape('align', 'left', selectedLayer)}
                                className={`p-1 rounded ${selectedLayer.align === 'left' ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title='Align Left'
                                type='button'
                            >
                                <AlignLeft color='white' size={16} />
                            </button>
                            <button
                                onClick={() => updateShape('align', 'center', selectedLayer)}
                                className={`p-1 rounded ${selectedLayer.align === 'center' ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title='Align Center'
                                type='button'
                            >
                                <AlignCenter color='white' size={16} />
                            </button>
                            <button
                                onClick={() => updateShape('align', 'right', selectedLayer)}
                                className={`p-1 rounded ${selectedLayer.align === 'right' ? 'bg-blue-600' : 'bg-[#1f1f1f]'}`}
                                title='Align Right'
                                type='button'
                            >
                                <AlignRight color='white' size={16} />
                            </button>
                        </div>

                        <div>
                            <label className='block mb-1 text-xs font-medium text-gray-300'>Font Family</label>
                            <select
                                className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                value={selectedLayer.fontFamily || 'Arial'}
                                onChange={e => updateShape('fontFamily', e.target.value, selectedLayer)}
                            >
                                {['Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Courier New', 'Trebuchet MS', 'Comic Sans MS', 'Inter'].map(font => (
                                    <option key={font} value={font}>
                                        {font}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block mb-1 text-xs font-medium text-gray-300'>Font Size</label>
                            <input
                                type='number'
                                min={1}
                                className='bg-[#1f1f1f] text-white border border-[#444] rounded px-3 py-1 w-full text-sm'
                                value={selectedLayer.fontSize || 12}
                                onChange={e => updateShape('fontSize', parseInt(e.target.value), selectedLayer)}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
});

export default Properties;
