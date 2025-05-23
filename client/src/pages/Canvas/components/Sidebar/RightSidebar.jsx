import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
    Tabs,
    Tab,
    Box,
    Typography,
    Divider,
    useTheme,
} from '@mui/material';

const ItemTypes = {
    LAYER: 'layer',
};

const RightSidebar = ({ layers, setShapes }) => {
    const [editingLayerId, setEditingLayerId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState('');
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    const theme = useTheme();

    const handleToggleVisibility = (id) => {
        setShapes((prev) =>
            prev.map((shape) =>
                shape.id === id ? { ...shape, visible: !shape.visible } : shape
            )
        );
    };

    const handleNameChange = (id, name) => {
        setShapes((prev) =>
            prev.map((shape) => (shape.id === id ? { ...shape, name } : shape))
        );
    };

    const moveLayer = (dragIndex, hoverIndex) => {
        setShapes((prev) => {
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
        handleNameChange(id, nameInputValue.trim() || ' ');
        setEditingLayerId(null);
    };

    const LayerItem = ({ layer, index }) => {
        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.LAYER,
            item: { index },
            collect: (monitor) => ({
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
                ref={(node) => drag(drop(node))}
                key={layer.id}
                className={`flex justify-between items-center text-xs mb-1 px-2 py-1 rounded cursor-pointer 
          ${selectedLayerId === layer.id
                        ? 'bg-blue-600'
                        : 'opacity-70 hover:bg-[#2a2a2a]'
                    }`}
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
                            if (e.key === 'Enter') finishEditing(layer.id);
                            else if (e.key === 'Escape') setEditingLayerId(null);
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
                    title={layer.visible === false ? 'Show layer' : 'Hide layer'}
                    className="ml-2 text-white hover:text-gray-400"
                >
                    {layer.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    pt: '48px',
                    width: '20rem',
                    bgcolor: '#1a1a1a',
                    borderLeft: '1px solid #2a2a2a',
                    color: 'white',
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => setTabIndex(newValue)}
                    variant="fullWidth"
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'capitalize',
                        },
                    }}
                >
                    <Tab label="Layers" />
                    <Tab label="History" />
                </Tabs>

                <Divider sx={{ bgcolor: '#333' }} />

                <Box sx={{ p: 2 }}>
                    {tabIndex === 0 && (
                        <>
                            {layers && layers.length > 0 ? (
                                [...layers]
                                    .slice()
                                    .reverse()
                                    .map((layer, index) => (
                                        <React.Fragment key={layer.id}>
                                            <LayerItem layer={layer} index={index} />
                                            {hoveredIndex === index && (
                                                <div
                                                    className="h-0.5 bg-blue-500"
                                                    style={{ margin: '0 -8px' }}
                                                />
                                            )}
                                        </React.Fragment>
                                    ))
                            ) : (
                                <Typography variant="body2" sx={{ opacity: 0.5 }}>
                                    No layers available
                                </Typography>
                            )}
                        </>
                    )}

                    {tabIndex === 1 && (
                        <Typography variant="body2" sx={{ opacity: 0.5 }}>
                            No history implemented yet.
                        </Typography>
                    )}
                </Box>
            </Box>
        </DndProvider>
    );
};

export default RightSidebar;
