import React, { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { editorStore } from "../../../../store/editorStore";

const Layers = ({ layers, setShapes }) => {
    const [editingLayerId, setEditingLayerId] = useState(null);
    const [nameInputValue, setNameInputValue] = useState("");
    const [contextMenu, setContextMenu] = useState({ open: false, x: 0, y: 0, layerId: null });
    const contextMenuRef = useRef(null);

    layers = layers.filter(l => l.type !== "transformer").reverse();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenu({ open: false, x: 0, y: 0, layerId: null });
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleDeleteLayer = id => {
        setShapes(prev => prev.filter(shape => shape.id !== id));
        if (editorStore.selectedShapeId === id) editorStore.setShape(null);
    };

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

    const onDragEnd = (result) => {
        console.log(result.source.index, result.destination.index)
        if (!result.destination) return;
        const reorderedLayers = Array.from(layers);
        const [movedLayer] = reorderedLayers.splice(result.source.index, 1);
        reorderedLayers.splice(result.destination.index, 0, movedLayer);
        setShapes(reorderedLayers.reverse());
    };

    const startEditing = (id, currentName) => {
        setEditingLayerId(id);
        setNameInputValue(currentName);
    };

    const finishEditing = (id) => {
        if (nameInputValue.trim()) {
            handleNameChange(id, nameInputValue.trim());
        }
        setEditingLayerId(null);
    };

    const handleDuplicate = () => {
        const selectedIds = editorStore.selectedShapes;
        if (selectedIds.length === 0) return;

        setShapes(prev => {
            const newShapes = [...prev];

            const duplicateShape = (shape) => {
                const newId = `${shape.id.split("-")[0]}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
                const newName = `${shape.name || "Untitled"} copy`;

                if (shape.type === 'group' && Array.isArray(shape.layers)) {
                    const duplicatedLayers = shape.layers.map(layer => duplicateShape(layer));
                    return {
                        ...shape,
                        id: newId,
                        name: newName,
                        layers: duplicatedLayers,
                    };
                }

                return {
                    ...shape,
                    id: newId,
                    name: newName,
                };
            };

            selectedIds.forEach(selId => {
                const original = prev.find(shape => shape.id === selId);
                if (original) {
                    const duplicated = duplicateShape(original);
                    newShapes.push(duplicated);
                }
            });

            return newShapes;
        });
    };

    const handleGroup = () => {
        const selectedIds = editorStore.selectedShapes;
        if (selectedIds.length <= 1) return;

        setShapes(prev => {
            const selectedShapes = prev.filter(shape => selectedIds.includes(shape.id));
            if (selectedShapes.length <= 1) return prev;

            const flattenShapes = (shapes) => {
                return shapes.flatMap(shape => {
                    if (shape.type === 'group' && Array.isArray(shape.layers)) {
                        return flattenShapes(shape.layers);
                    }
                    return shape;
                });
            };

            const allShapesForGroup = flattenShapes(selectedShapes);

            const remainingShapes = prev.filter(shape => !selectedIds.includes(shape.id));

            const groupLayer = {
                id: `group-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                name: `Group of ${allShapesForGroup.length} layers`,
                type: 'group',
                layers: allShapesForGroup,
                visible: true,
            };

            return [...remainingShapes, groupLayer];
        });

        editorStore.setShape(null);
    };

    const handleUngroup = () => {
        const selectedId = editorStore.selectedShapes[0];
        if (!selectedId) return;

        setShapes(prev => {
            const groupShape = prev.find(shape => shape.type === 'group' && shape.id === selectedId);
            if (!groupShape) return prev;

            const layers = groupShape.layers;

            const remainingShapes = prev.filter(shape => shape.id !== selectedId);

            return [...remainingShapes, ...layers];
        });

        editorStore.setShape(null);
    };


    const LayerItem = observer(({ layer, index }) => {
        const selectedIds = editorStore.selectedShapes;
        const handleContextMenu = (e) => {
            e.preventDefault();
            if (!editorStore.selectedShapes.includes(layer.id)) handleLayerClick(e);
            console.log(layers.some(shape => shape.id === editorStore.selectedShapes[0] && shape.type === 'group'));
            setContextMenu({
                open: true,
                x: e.clientX,
                y: e.clientY,
                layerId: layer.id
            });
        };

        const handleLayerClick = (e) => {
            const groupShape = layers.find(shape =>
                shape.type === 'group' &&
                shape.id === layer.id
            );
            if (groupShape) {
                if (!e.shiftKey) editorStore.setShape(null);
                e.shiftKey = true;
                editorStore.setShape(groupShape.id, e);
                groupShape.layers.map(s => s.id).forEach(element => {
                    editorStore.setShape(element, e);
                });
            } else {
                editorStore.setShape(layer.id, e);
            }
        }

        return (
            <Draggable draggableId={layer.id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex justify-between items-center text-xs mb-1 px-2 py-2 rounded cursor-pointer 
                            ${selectedIds.includes(layer.id) ? 'bg-blue-600' : 'opacity-70 hover:bg-[#2a2a2a]'}`}
                        onDoubleClick={() => startEditing(layer.id, layer.name)}
                        onClick={handleLayerClick}
                        onContextMenu={handleContextMenu}
                        title={layer.name}
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
                        <div className='flex items-center gap-1'>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    handleToggleVisibility(layer.id);
                                }}
                                title={layer.visible === false ? 'Show layer' : 'Hide layer'}
                                className='text-white hover:text-gray-400 mr-2'
                            >
                                {layer.visible === false ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteLayer(layer.id);
                                }}
                                title='Delete layer'
                                className='text-white hover:text-red-500'
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {contextMenu.open && contextMenu.layerId === layer.id && (
                            <div
                                ref={contextMenuRef}
                                className="absolute z-50 w-24 bg-[#1f1f1f] border border-[#333] rounded shadow"
                                style={{ top: contextMenu.y, left: contextMenu.x }}
                            >
                                <button
                                    disabled={editorStore.selectedShapes.length === 0}
                                    className="w-full text-left px-3 py-1 text-xs 
                hover:bg-[#2a2a2a] hover:text-purple-400 
                disabled:cursor-not-allowed disabled:opacity-50
                disabled:hover:text-gray-400"
                                    onClick={() => {
                                        handleDuplicate();
                                        setContextMenu({ open: false, x: 0, y: 0, layerId: null });
                                    }}
                                >
                                    Duplicate
                                </button>

                                {layers.some(shape => shape.id === editorStore.selectedShapes[0] && shape.type === 'group' && editorStore.selectedShapes.length === shape.layers.length + 1)
                                    ? (
                                        <button
                                            className="w-full text-left px-3 py-1 text-xs 
                    hover:bg-[#2a2a2a] hover:text-purple-400"
                                            onClick={() => {
                                                handleUngroup();
                                                setContextMenu({ open: false, x: 0, y: 0, layerId: null });
                                            }}
                                        >
                                            Ungroup
                                        </button>
                                    ) : (
                                        <button
                                            disabled={editorStore.selectedShapes.length <= 1}
                                            className="w-full text-left px-3 py-1 text-xs 
                    hover:bg-[#2a2a2a] hover:text-purple-400 
                    disabled:cursor-not-allowed disabled:opacity-50
                    disabled:hover:text-gray-400"
                                            onClick={() => {
                                                handleGroup();
                                                setContextMenu({ open: false, x: 0, y: 0, layerId: null });
                                            }}
                                        >
                                            Group
                                        </button>
                                    )}

                            </div>
                        )}
                    </div>
                )}
            </Draggable>
        );
    });

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="layers">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div className="flex justify-between items-center mb-2 border-b border-[#333] pb-1">
                            <h2 className="text-sm font-semibold">Layers</h2>
                        </div>

                        {layers && layers.length > 0 ? (
                            layers.map((layer, index) => (
                                <LayerItem key={layer.id} layer={layer} index={index} />
                            ))
                        ) : (
                            <div className="text-xs opacity-50">No layers available</div>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default Layers;

