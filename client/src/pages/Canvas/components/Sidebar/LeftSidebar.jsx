import React, { useState, useRef, useEffect } from 'react';
import { editorStore } from '../../../../store/editorStore';
import { LuMousePointer2 } from "react-icons/lu";
import { TbCircle, TbRectangle, TbTriangle, TbStar, TbHexagon, TbPentagon, TbArrowRight, TbLine } from 'react-icons/tb';
import { LuEraser } from "react-icons/lu";
import { LuBrush } from "react-icons/lu";
import { LuCrop } from "react-icons/lu";
import { RiFontFamily } from 'react-icons/ri';
import { BiSolidEyedropper } from 'react-icons/bi';
import { LuSearch } from "react-icons/lu";
import { observer } from 'mobx-react-lite';
import { IoIosSwap } from "react-icons/io";
import { Pencil, Highlighter } from 'lucide-react';
import { CiImageOn } from 'react-icons/ci';

const shapeOptions = [
    { id: 'circle', icon: <TbCircle />, label: 'Circle' },
    { id: 'rect', icon: <TbRectangle />, label: 'Rectangle' },
    { id: 'line', icon: <TbLine />, label: 'Line' },
    { id: 'triangle', icon: <TbTriangle />, label: 'Triangle' },
    { id: 'star', icon: <TbStar />, label: 'Star' },
    { id: 'arrow', icon: <TbArrowRight />, label: 'Arrow' },
    { id: 'hexagon', icon: <TbHexagon />, label: 'Hexagon' },
    { id: 'pentagon', icon: <TbPentagon />, label: 'Pentagon' },
];

const staticTools = [
	{ id: 'move', icon: <LuMousePointer2 size={15} />, label: 'Move Tool' },
	// { id: 'brush', icon: <LuBrush size={16} />, label: 'Brush Tool' },
	// { id: 'eraser', icon: <LuEraser size={17} />, label: 'Eraser Tool' },
	{ id: 'imgpicker', icon: <CiImageOn size={17}/>, label: 'Image Tool'},
	{ id: 'crop', icon: <LuCrop size={17} />, label: 'Crop Tool' },
	{ id: 'text', icon: <RiFontFamily size={15} />, label: 'Text Tool' },
	{ id: 'picker', icon: <BiSolidEyedropper size={17} />, label: 'Color Picker' },
	{ id: 'zoom', icon: <LuSearch size={18} />, label: 'Zoom Tool' },
];

const drawingTools = [
    { id: 'brush', icon: <LuBrush size={16} />, label: 'Brush' },
    { id: 'pencil', icon: <Pencil size={16} />, label: 'Pencil' },
    { id: 'marker', icon: <Highlighter size={16} />, label: 'Marker' },
];

const LeftSidebar = observer(() => {
    const [activeShapeTool, setActiveShapeTool] = useState('circle');
    const [activeBrushTool, setActiveBrushTool] = useState('brush');
    const [showShapeMenu, setShowShapeMenu] = useState(false);
    const [showBrushMenu, setShowBrushMenu] = useState(false);
    const [color, setColor] = useState(editorStore.selectedColor || '#000000');
    const [secondColor, setSecondColor] = useState('#aaaaaa');
    const shapeBtnRef = useRef(null);
    const brushBtnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = e => {
            if (shapeBtnRef.current && !shapeBtnRef.current.contains(e.target)) {
                setShowShapeMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            if (shapeBtnRef.current && !shapeBtnRef.current.contains(e.target)) {
                setShowShapeMenu(false);
            }
            if (brushBtnRef.current && !brushBtnRef.current.contains(e.target)) {
                setShowBrushMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // Если editorStore.selectedColor может обновляться извне,
    // синхронизируем локальный стейт с ним
    useEffect(() => {
        setColor(editorStore.selectedColor || '#000000');
    }, [editorStore.selectedColor]);

    const shapeToolIcon = shapeOptions.find(opt => opt.id === activeShapeTool)?.icon;
    const brushToolIcon = drawingTools.find(opt => opt.id === activeBrushTool)?.icon;

    const handleBrushDoubleClick = () => {
        setShowBrushMenu(prev => !prev);
    };

    const handleBrushSelect = id => {
        setActiveBrushTool(id);
        setShowBrushMenu(false);
        editorStore.setTool(id);
    };

    const handleShapeDoubleClick = () => {
        setShowShapeMenu(prev => !prev);
    };

    const handleShapeSelect = id => {
        setActiveShapeTool(id);
        setShowShapeMenu(false);
        editorStore.setTool(id);
    };

    const handleColorChange = e => {
        const newColor = e.target.value;
        setColor(newColor);
        editorStore.setColor(newColor);
    };

    return (
        <div className='w-12 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col items-center py-4 space-y-4 z-999'>
            {staticTools.map(tool => {
                if (tool.id === 'crop') {
                    return (
                        <React.Fragment key={tool.id}>
                            <div className='relative m-0' ref={shapeBtnRef}>
                                <button
                                    onClick={() => editorStore.setTool(activeShapeTool)}
                                    onDoubleClick={handleShapeDoubleClick}
                                    className={`p-3 mb-1 rounded-md hover:text-[#df75ff] transition-colors text-[1.1rem] ${editorStore.selectedTool === activeShapeTool ? 'text-[#9B34BA] bg-white/10' : 'text-white'}`}
                                    title='Shape Tool (Double-click to change)'
                                >
                                    {shapeToolIcon}
                                </button>

                                {showShapeMenu && (
                                    <div className='absolute left-10 top-0 bg-[#2a2a2a] border border-[#444] rounded z-50 shadow-lg'>
                                        {shapeOptions.map(shape => (
                                            <button
                                                key={shape.id}
                                                onClick={() => handleShapeSelect(shape.id)}
                                                className='flex items-center w-full gap-2 px-2 py-1 text-sm text-white hover:bg-blue-500'
                                            >
                                                {shape.icon}
                                                {shape.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                title={tool.label}
                                className={`p-3 mb-1 rounded-md hover:text-[#df75ff] transition-colors text-[1.1rem] ${tool.id === editorStore.selectedTool ? 'text-[#9B34BA] bg-white/10' : 'text-white'}`}
                                onClick={() => editorStore.setTool(tool.id)}
                            >
                                {tool.icon}
                            </button>
                        </React.Fragment>
                    );
                }

                if (tool.id === 'imgpicker') {
                    return (
                        <React.Fragment key='brush-tools'>
                            <div className='relative m-0' ref={brushBtnRef}>
                                <button
                                    onClick={() => editorStore.setTool(activeBrushTool)}
                                    onDoubleClick={handleBrushDoubleClick}
                                    className={`p-3 mb-1 rounded-md hover:text-[#df75ff] transition-colors text-[1.1rem] ${editorStore.selectedTool === activeBrushTool ? 'text-[#9B34BA] bg-white/10' : 'text-white'}`}
                                    title='Brush Tool (Double-click to change)'
                                >
                                    {brushToolIcon}
                                </button>

                                {showBrushMenu && (
                                    <div className='absolute left-10 top-0 bg-[#2a2a2a] border border-[#444] rounded z-50 shadow-lg'>
                                        {drawingTools.map(tool => (
                                            <button
                                                key={tool.id}
                                                onClick={() => handleBrushSelect(tool.id)}
                                                className='flex items-center w-full gap-2 px-2 py-1 text-sm text-white hover:bg-blue-500'
                                            >
                                                {tool.icon}
                                                {tool.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Отрисовываем обычную кнопку Eraser Tool */}
                            <button
                                title={tool.label}
                                className={`p-3 mb-1 rounded-md hover:text-[#df75ff] transition-colors text-[1.1rem] ${tool.id === editorStore.selectedTool ? 'text-[#9B34BA] bg-white/10' : 'text-white'}`}
                                onClick={() => editorStore.setTool(tool.id)}
                            >
                                {tool.icon}
                            </button>
                        </React.Fragment>
                    );
                }

                return (
                    <button
                        key={tool.id}
                        title={tool.label}
                        className={`p-3 mb-1 rounded-md hover:text-[#df75ff] transition-colors text-[1.1rem] ${tool.id === editorStore.selectedTool ? 'text-[#9B34BA] bg-white/10' : 'text-white'}`}
                        onClick={() => editorStore.setTool(tool.id)}
                    >
                        {tool.icon}
                    </button>
                );
            })}

            {/* Цветовой селектор под Zoom */}
            <div className='flex flex-col items-center mt-4'>
                <label htmlFor='colorPicker' className='mb-1 text-xs text-gray-400 select-none'>
                    Color
                </label>
                <input
                    id='colorPicker'
                    type='color'
                    value={color}
                    onChange={handleColorChange}
                    // className='w-8 h-8 border border-gray-600 rounded cursor-pointer'
                    title='Select color'
                />
                <IoIosSwap className='mt-2 text-white' onClick={() => {
                    const temp = color;
                    setColor(secondColor);
                    setSecondColor(temp);
                    editorStore.setColor(secondColor);
                }} />
                <input
                    id='colorPicker'
                    type='color'
                    value={secondColor}
                    onChange={(e) => setSecondColor(e.target.value)}
                    className='mt-2'
                    title='Select color'
                />
            </div>
        </div>
    );
});

export default LeftSidebar;
