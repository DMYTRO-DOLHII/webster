import React, { useState, useRef, useEffect } from 'react';
import { editorStore } from '../../../../store/editorStore';
import { RxCursorArrow } from 'react-icons/rx';
import { TbVector, TbBrush, TbCircle, TbRectangle, TbTriangle, TbStar, TbHexagon, TbPentagon, TbArrowRight, TbLine } from 'react-icons/tb';
import { PiEraserBold } from 'react-icons/pi';
import { LiaCropAltSolid } from 'react-icons/lia';
import { RiFontFamily } from 'react-icons/ri';
import { BiSolidEyedropper } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { observer } from 'mobx-react-lite';
import { IoIosSwap } from "react-icons/io";

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
    { id: 'move', icon: <RxCursorArrow size={15} />, label: 'Move Tool' },
    { id: 'select', icon: <TbVector size={15} />, label: 'Select Tool' },
    { id: 'brush', icon: <TbBrush size={16} />, label: 'Brush Tool' },
    { id: 'eraser', icon: <PiEraserBold size={17} />, label: 'Eraser Tool' },
    { id: 'crop', icon: <LiaCropAltSolid size={19} />, label: 'Crop Tool' },
    { id: 'text', icon: <RiFontFamily size={15} />, label: 'Text Tool' },
    { id: 'picker', icon: <BiSolidEyedropper size={17} />, label: 'Color Picker' },
    { id: 'zoom', icon: <IoIosSearch size={18} />, label: 'Zoom Tool' },
];

const LeftSidebar = observer(() => {
    const [activeShapeTool, setActiveShapeTool] = useState('circle');
    const [showShapeMenu, setShowShapeMenu] = useState(false);
    const [color, setColor] = useState(editorStore.selectedColor || '#000000');
    const [secondColor, setSecondColor] = useState('#aaaaaa');
    const shapeBtnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = e => {
            if (shapeBtnRef.current && !shapeBtnRef.current.contains(e.target)) {
                setShowShapeMenu(false);
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
        <div className='pt-15 w-12 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col items-center py-4 space-y-4'>
            {staticTools.map(tool => {
                if (tool.id === 'crop') {
                    return (
                        <React.Fragment key={tool.id}>
                            <div className='relative mt-1 mb-2' ref={shapeBtnRef}>
                                <button
                                    onClick={() => editorStore.setTool(activeShapeTool)}
                                    onDoubleClick={handleShapeDoubleClick}
                                    className={`hover:text-[#df75ff] transition-colors text-[1.1rem] mt-1 ${editorStore.selectedTool === activeShapeTool ? 'text-[#9B34BA]' : 'text-white'
                                        }`}
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
                                className={`hover:text-[#df75ff] transition-colors text-[1.1rem] mt-1 ${tool.id === editorStore.selectedTool ? 'text-[#9B34BA]' : 'text-white'}`}
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
                        className={`hover:text-[#df75ff] transition-colors text-[1.1rem] mt-1 ${tool.id === editorStore.selectedTool ? 'text-[#9B34BA]' : 'text-white'}`}
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
                }}/>
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
