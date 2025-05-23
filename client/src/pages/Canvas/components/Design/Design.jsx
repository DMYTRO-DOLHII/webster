import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';

import { editorStore } from '../../../../store/editorStore';
import { api } from '../../../../services/api';
import { SHAPE_COMPONENTS, SHAPE_DEFAULTS } from '../Shapes';

const Design = observer(({ shapes, onSaveRef, zoom, containerSize, setZoom, setShapes }) => {
    const stageRef = useRef(null);
    const shapeRefs = useRef({});
    const isDrawing = useRef(false);
    const lastSavedDesign = useRef(null);
    const widthRef = useRef(0);
    const heightRef = useRef(0);

    const [selectedShapeId, setSelectedShapeId] = useState(null);
    const [currentLineId, setCurrentLineId] = useState(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

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
            };
            if (json.attrs?.height) setHeight(json.attrs.height);

            const layer = json.children?.find(c => c.className === 'Layer');
            const loadedShapes = layer?.children?.map(shape => ({
                id: shape.attrs.id || `${shape.className}-${Date.now()}`,
                type: shape.className.toLowerCase(),
                visible: shape.visible !== false,
                ...shape.attrs,
            })) || [];

            setShapes(loadedShapes);
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
        console.log(width, height, containerSize, scale)
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

    // Обработчик контекстного меню
    const handleContextMenu = e => {
        const stage = e.target.getStage();
        if (e.target === stage) {
            e.evt.preventDefault();
            const pointerPos = stage.getPointerPosition();

            // Сохраняем позицию в координатах stage с учетом трансформаций
            setContextMenu({
                visible: true,
                x: e.evt.clientX,
                y: e.evt.clientY,
                stageX: pointerPos.x / zoom,
                stageY: pointerPos.y / zoom,
            });
        }
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
                };

                handleShapesChange(prev => [...prev, newImage]);
                setContextMenu({ ...contextMenu, visible: false });
            };
        };
        reader.readAsDataURL(file);
    };

    const handleDoubleClick = id => {
        setSelectedShapeId(id);
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
                setSelectedShapeId(null);
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
            setSelectedShapeId(newShape.id);
        } else {
            const clickedId = e.target._id || e.target.attrs.id;
            if (clickedId) setSelectedShapeId(clickedId);
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
            name: 'Bruh'
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

    return (
        <div className='relative'>
            <Stage
                ref={stageRef}
                width={width * zoom}
                height={height * zoom}
                scaleX={zoom}
                scaleY={zoom}
                className="border-1"
                onClick={handleStageClick}
                onDblClick={e => { }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onContextMenu={handleContextMenu}
            >
                <Layer>
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
                                onDblClick={() => handleDoubleClick(id)}
                                visible={shape.visible !== false}
                                ref={el => {
                                    if (el) {
                                        shapeRefs.current[id] = el;
                                    }
                                }}
                            />
                        );
                    })}

                    {selectedShapeId && shapeRefs.current[selectedShapeId] && (
                        <Transformer
                            nodes={[shapeRefs.current[selectedShapeId]]}
                            resizeEnabled={true}
                            rotateEnabled={true}
                            borderStroke="black"
                            borderDash={[6, 2]}
                            anchorStroke="black"
                            anchorFill="white"
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
                    <div style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                        Add Image
                    </div>
                </div>
            )}

            <input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
        </div>
    );
});

export default Design;
