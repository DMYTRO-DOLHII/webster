import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Rect } from 'react-konva';
import { editorStore } from '../../../../store/editorStore';
import { api } from '../../../../services/api';
import { SHAPE_COMPONENTS, SHAPE_DEFAULTS } from '../Shapes';
import { TbVersionsOff } from 'react-icons/tb';
import { ClipboardSignature } from 'lucide-react';

const Design = observer(({ shapes, onSaveRef, zoom, containerSize, setZoom, setShapes }) => {
    const stageRef = useRef(null);
    const shapeRefs = useRef({});
    const isDrawing = useRef(false);
    const lastSavedDesign = useRef(null);
    const widthRef = useRef(0);
    const heightRef = useRef(0);

    const [editingTextId, setEditingTextId] = useState(null);
    const [textValue, setTextValue] = useState('');
    const textInputRef = useRef(null);

    const [currentLineId, setCurrentLineId] = useState(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const [cropRect, setCropRect] = useState({
        x: 100,
        y: 100,
        width: 300,
        height: 300,
    });
    const cropRef = useRef(null);

    const { projectId } = useParams();

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        stageX: 0,
        stageY: 0,
    });
    const fileInputRef = useRef(null);
    const menuRef = useRef(null);

    useEffect(() => {
        widthRef.current = width;
    }, [width]);

    useEffect(() => {
        heightRef.current = height;
    }, [height]);

    useEffect(() => {
        if (!containerSize.width || !containerSize.height) return;

        let jsonString = localStorage.getItem('designData');
        if (!jsonString && typeof editorStore.projectJSON === 'object') {
            jsonString = JSON.stringify(editorStore.projectJSON);
        }
        if (!jsonString) return;

        try {
            const json = JSON.parse(jsonString);

            if (json.attrs?.width) {
                setWidth(json.attrs.width);
                editorStore.setWidth(json.attrs.width);
            }
            if (json.attrs?.height) {
                setHeight(json.attrs.height);
                editorStore.setHeight(json.attrs.height);
            }

            const layer = json.children?.find(c => c.className === 'Layer');
            const loadedShapes =
                layer?.children?.map(shape => ({
                    id: shape.attrs.id || `${shape.className}-${Date.now()}`,
                    type: shape.className.toLowerCase(),
                    visible: shape.visible !== false,
                    ...shape.attrs,
                })) || [];

            const shapedFromJSON = loadedShapes.map(shape => {
                if (shape.type === 'image') {
                    const img = new window.Image();
                    img.src = shape.img64;

                    return {
                        ...shape,
                        image: img
                    }
                }

                return shape;
            })

            setShapes(shapedFromJSON);
        } catch (err) {
            console.error('Failed to parse designData', err);
        }
    }, [editorStore.projectJSON, containerSize, setShapes]);

    const saveDesign = useCallback(async () => {
        if (!stageRef.current) return;

        const jsonString = stageRef.current.toJSON();
        if (!jsonString || jsonString === lastSavedDesign.current) return;

        try {
            const jsonObject = JSON.parse(jsonString);

            if (widthRef.current) jsonObject.attrs.width = widthRef.current;
            if (heightRef.current) jsonObject.attrs.height = heightRef.current;

            const json = JSON.stringify(jsonObject);
            localStorage.setItem('designData', json);

            editorStore.setStage(stageRef.current);

            const base64Image = stageRef.current.toDataURL({ pixelRatio: 1 });

            await api.patch(`/projects/${projectId}`, {
                info: JSON.parse(json),
                previewImage: base64Image,
            });

            lastSavedDesign.current = json;
            console.log('Design saved');
        } catch (error) {
            console.error('Save failed:', error);
        }
    }, [projectId]);

    const debouncedSave = useRef(debounce(saveDesign, 500)).current;

    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(() => stageRef.current?.toJSON());
        }
    }, [onSaveRef]);

    useEffect(() => {
        debouncedSave();
    }, [shapes]);

    useEffect(() => {
        if (!width || !height || !containerSize.width || !containerSize.height) return;

        const savedZoom = localStorage.getItem('zoomValue');
        if (savedZoom) {
            setZoom(parseFloat(savedZoom));
            return;
        }

        const scaleX = containerSize.width / width;
        const scaleY = containerSize.height / height;
        const scale = Math.min(scaleX, scaleY, 1);
        setZoom(scale);
        console.log(width, height, containerSize, scale);
    }, [width, height, containerSize, setZoom]);

    useEffect(() => {
        const handleClickOutside = e => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const selectedShape = shapeRefs.current[editorStore.selectedShapeId]

            if (!selectedShape) return;

            console.log('penis')
            const step = e.shiftKey ? 10 : 1;
            let dx = 0;
            let dy = 0;

            switch (e.key) {
                case 'ArrowUp':
                    dy = -step;
                    break;
                case 'ArrowDown':
                    dy = step;
                    break;
                case 'ArrowLeft':
                    dx = -step;
                    break;
                case 'ArrowRight':
                    dx = step;
                    break;
                default:
                    return;
            }

            e.preventDefault();

            // Move the shape
            selectedShape.position({
                x: selectedShape.x() + dx,
                y: selectedShape.y() + dy,
            });

            selectedShape.getLayer().batchDraw();

            // Save changes
            debouncedSave();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [editorStore.selectedShapeId]);

    const handleContextMenu = e => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        const pointerPos = stage.getPointerPosition();

        const clickedOnShape = e.target !== stage;

        setContextMenu({
            visible: true,
            x: e.evt.clientX,
            y: e.evt.clientY,
            stageX: pointerPos.x / zoom,
            stageY: pointerPos.y / zoom,
            shapeId: clickedOnShape ? e.target.attrs.id : null,
        });
    };

    const handleDeleteShape = () => {
        if (!contextMenu.shapeId) return;
        setShapes(prev => prev.filter(shape => shape.id !== contextMenu.shapeId));
        if (editorStore.selectedShapeId === contextMenu.shapeId) editorStore.setShape(null);
        setContextMenu({ visible: false, x: 0, y: 0, stageX: 0, stageY: 0, shapeId: null });
    };

    const handleFileSelect = e => {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = event => {
            const img = new window.Image();
            img.src = event.target.result;

            img.onload = () => {
                // Автоматическое масштабирование с сохранением пропорций
                const maxWidth = SHAPE_DEFAULTS.image.width;
                const maxHeight = SHAPE_DEFAULTS.image.height;
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                const stage = stageRef.current.getStage();
                const point = stage.getPointerPosition();
                const newImage = {
                    id: `image-${Date.now()}`,
                    type: 'image',
                    name: file.name,
                    image: img,
                    x: point.x, // Центрирование относительно курсора
                    y: point.y / zoom,
                    width: img.width * scale,
                    height: img.height * scale,
                    draggable: true,
                    img64: event.target.result
                };

                handleShapesChange(prev => [...prev, newImage]);
                setContextMenu({ ...contextMenu, visible: false });
            };
        };
        reader.readAsDataURL(file);
    };

    const handleDoubleClick = id => {
        // editorStore.setShape(id);
        const shape = shapes.find(s => s.id === id);
        if (shape.type === 'text') {
            editorStore.setShape(null);
            setEditingTextId(id);
            setTextValue(shape.text || '');
            setTimeout(() => {
                textInputRef.current.focus();
            }, 50);
        }
    };

    const handleTextChange = e => {
        setTextValue(e.target.value);
    };

    const handleTextBlur = () => {
        setShapes(prev =>
            prev.map(shape => {
                if (shape.id === editingTextId) {
                    return { ...shape, text: textValue };
                }
                return shape;
            })
        );
        setEditingTextId(null);
        debouncedSave();
    };

    const handleShapesChange = useCallback(
        updatedShapes => {
            setShapes(updatedShapes);
            editorStore.setStage(stageRef.current);
        },
        [setShapes]
    );

    const handleStageClick = e => {
        const stage = stageRef.current.getStage();
        if (e.target === stage) {
            const tool = editorStore.selectedTool;
            if (!SHAPE_DEFAULTS[tool] || tool === 'brush') {
                editorStore.setShape(null);
                return;
            }

            const pointerPosition = stage.getPointerPosition();
            const currentColor = editorStore.selectedColor ?? '#000000';

            const baseProps = { ...SHAPE_DEFAULTS[tool] };
            if ('fill' in baseProps) baseProps.fill = currentColor;
            if ('stroke' in baseProps) baseProps.stroke = currentColor;
            let name = 'Figure';
            if (tool === 'text') {
                name = baseProps.text || 'Text';
            } else if (tool === 'image') {
                name = baseProps.fileName || 'Image';
            }
            name += ` ${shapes.length}`;

            const newShape = {
                id: `${tool}-${Date.now()}`,
                type: tool,
                x: pointerPosition.x / zoom,
                y: pointerPosition.y / zoom,
                visible: true,
                name,
                ...baseProps,
            };

            handleShapesChange(prev => [...prev, newShape]);
            setTimeout(() => {
                editorStore.setShape(newShape.id);
            }, 0);
        } else {
            const clickedId = e.target.attrs.id || e.target._id;
            if (clickedId) {
                editorStore.setShape(clickedId);
                editorStore.setTool('move');
                console.log(editorStore.selectedTool);
            }
        }
    };

    const handleMouseDown = e => {
        if (editorStore.selectedTool !== 'brush') return;

        isDrawing.current = true;
        const stage = stageRef.current.getStage();
        const point = stage.getPointerPosition();
        const currentColor = editorStore.selectedColor ?? 'black';

        const newLine = {
            id: `brush-${Date.now()}`,
            type: 'brush',
            points: [point.x / zoom, point.y / zoom],
            ...SHAPE_DEFAULTS.brush,
            stroke: currentColor,
            name: 'Bruh',
        };

        handleShapesChange(prev => [...prev, newLine]);
        setCurrentLineId(newLine.id);
    };

    const handleMouseMove = e => {
        if (!isDrawing.current || editorStore.selectedTool !== 'brush') return;

        const stage = stageRef.current.getStage();
        const point = stage.getPointerPosition();

        handleShapesChange(prevShapes =>
            prevShapes.map(shape => {
                if (shape.id === currentLineId) {
                    return {
                        ...shape,
                        points: [...shape.points, point.x / zoom, point.y / zoom],
                    };
                }
                return shape;
            })
        );
    };

    const handleMouseUp = () => {
        if (editorStore.selectedTool !== 'brush') return;
        isDrawing.current = false;
        setCurrentLineId(null);
    };

    const handleCrop = () => {
        if (!cropRect) return;

        const croppedShapes = shapes
            .map(shape => {
                const { x, y, width = 0, height = 0 } = shape;

                const intersects =
                    x + width > cropRect.x &&
                    x < cropRect.x + cropRect.width &&
                    y + height > cropRect.y &&
                    y < cropRect.y + cropRect.height;

                if (!intersects) return null;

                return {
                    ...shape,
                    x: shape.x - cropRect.x,
                    y: shape.y - cropRect.y,
                };
            })
            .filter(Boolean);

        setShapes(croppedShapes);
        setWidth(cropRect.width);
        setHeight(cropRect.height);
        editorStore.setWidth(cropRect.width);
        editorStore.setHeight(cropRect.height);
        editorStore.setTool("move");
        setCropRect(null);
    };

    return (
        <div className='relative'>
            {editorStore.selectedTool === 'crop' && (
                <button
                    onClick={handleCrop}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000,
                        padding: '8px 16px',
                        backgroundColor: '#9B34BA',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Apply Crop
                </button>
            )}
            <Stage
                ref={stageRef}
                width={width * zoom}
                height={height * zoom}
                scaleX={zoom}
                scaleY={zoom}
                className='border-0 border-white shadow-[0px_0px_20px_0px_#9B34BA70]'
                onClick={handleStageClick}
                onDblClick={e => { }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
            >
                <Layer>
                    {editorStore.selectedTool === 'crop' && cropRect && (
                        <>
                            <Rect x={0} y={0} width={width} height={cropRect.y} fill='rgba(0, 0, 0, 0.5)' />
                            <Rect x={0} y={cropRect.y} width={cropRect.x} height={cropRect.height} fill='rgba(0, 0, 0, 0.5)' />
                            <Rect x={cropRect.x + cropRect.width} y={cropRect.y} width={width - cropRect.x - cropRect.width} height={cropRect.height} fill='rgba(0, 0, 0, 0.5)' />
                            <Rect x={0} y={cropRect.y + cropRect.height} width={width} height={height - cropRect.y - cropRect.height} fill='rgba(0, 0, 0, 0.5)' />

                            <Rect
                                ref={cropRef}
                                {...cropRect}
                                stroke='black'
                                strokeWidth={4}
                                dash={[10, 4]}
                                draggable
                                onDragEnd={e => {
                                    setCropRect({
                                        ...cropRect,
                                        x: Math.max(0, Math.min(e.target.x(), width - cropRect.width)),
                                        y: Math.max(0, Math.min(e.target.y(), height - cropRect.height)),
                                    });
                                }}
                                onTransformEnd={e => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    setCropRect({
                                        x: Math.max(0, node.x()),
                                        y: Math.max(0, node.y()),
                                        width: Math.max(50, Math.min(node.width() * scaleX, width - node.x())),
                                        height: Math.max(50, Math.min(node.height() * scaleY, height - node.y())),
                                    });

                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                            />

                            <Rect
                                {...cropRect}
                                stroke='black'
                                strokeWidth={2}
                                dash={[10, 4]}
                                listening={false}
                            />
                        </>
                    )}
                    {editorStore.selectedTool === 'crop' && cropRef.current && (
                        <Transformer
                            nodes={[cropRef.current]}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 50 || newBox.height < 50) return oldBox;
                                return {
                                    ...newBox,
                                    x: Math.max(0, Math.min(newBox.x, width - newBox.width)),
                                    y: Math.max(0, Math.min(newBox.y, height - newBox.height)),
                                    width: Math.min(newBox.width, width - newBox.x),
                                    height: Math.min(newBox.height, height - newBox.y),
                                };
                            }}
                        />
                    )}
                    {shapes.map(shape => {
                        const Component = SHAPE_COMPONENTS[shape.type];
                        if (!Component) return null;

                        const { id, type, ...shapeProps } = shape;

                        return (
                            <Component
                                key={id}
                                id={id}
                                {...shapeProps}
                                onDragEnd={debouncedSave}
                                onTransformEnd={debouncedSave}
                                onMouseUp={debouncedSave}
                                onClick={() => editorStore.setShape(id)}
                                onDblClick={() => handleDoubleClick(id)} // TODO PENIS
                                visible={shape.visible !== false}
                                ref={el => {
                                    if (el) {
                                        shapeRefs.current[id] = el;
                                    }
                                }}
                            />
                        );
                    })}

                    {editorStore.selectedShapeId && shapeRefs.current[editorStore.selectedShapeId] && (
                        <Transformer
                            nodes={[shapeRefs.current[editorStore.selectedShapeId]]}
                            resizeEnabled={true}
                            rotateEnabled={true}
                            borderStroke='black'
                            borderDash={[6, 2]}
                            anchorStroke='black'
                            anchorFill='white'
                            anchorSize={10}
                            flipEnabled={true}
                            keepRatio={true}
                        />
                    )}
                </Layer>
            </Stage>
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    style={{
                        position: 'fixed',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                    }}
                >
                    {contextMenu.shapeId ? (
                        <div style={{ padding: '8px 16px', cursor: 'pointer', color: 'red' }} onClick={handleDeleteShape}>
                            Delete
                        </div>
                    ) : (
                        <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                            Add the image
                        </div>
                    )}
                </div>
            )}

            <input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
            {editingTextId &&
                (() => {
                    const shape = shapes.find(s => s.id === editingTextId);
                    if (!shape) return null;

                    return (
                        <div
                            className='absolute z-[1001]'
                            style={{
                                top: shape.y * zoom + shape.fontSize + 11,
                                left: shape.x * zoom + 5,
                            }}
                        >
                            <input
                                ref={textInputRef}
                                type='text'
                                value={textValue}
                                onChange={handleTextChange}
                                onBlur={handleTextBlur}
                                className='px-2 py-1 bg-transparent border border-purple-600 outline-none'
                                style={{
                                    fontSize: `${shape.fontSize}px`,
                                    fontFamily: shape.fontFamily,
                                    color: shape.fill,
                                    width: `${shape.width * zoom}px`,
                                }}
                            />
                        </div>
                    );
                })()}
        </div>
    );
});

export default Design;

