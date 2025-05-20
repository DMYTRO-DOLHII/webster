import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Stage, Layer, Transformer } from 'react-konva';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';

import { editorStore } from '../../../../store/editorStore';
import { api } from '../../../../services/api';
import { SHAPE_COMPONENTS, SHAPE_DEFAULTS } from '../Shapes';

const Design = observer(({ shapes, onSaveRef, zoom, containerSize, setZoom, onShapesChange }) => {
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

    // Update refs when width and height change
    useEffect(() => {
        widthRef.current = width;
    }, [width]);

    useEffect(() => {
        heightRef.current = height;
    }, [height]);

    // Initialize design from localStorage or editorStore.projectJSON
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

            onShapesChange(loadedShapes);
        } catch (err) {
            console.error('Failed to parse designData', err);
        }
    }, [editorStore.projectJSON, containerSize, onShapesChange]);
    // Save design to localStorage and backend
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

    // Debounce saveDesign to limit save frequency
    const debouncedSave = useRef(debounce(saveDesign, 500)).current;

    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(() => stageRef.current?.toJSON());
        }
    }, [onSaveRef]);
    useEffect(() => {
        debouncedSave();
    }, [shapes]);
    // Manage zoom scale when container or design size changes
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

    // Handle shape changes callback with latest stage reference
    const handleShapesChange = useCallback(
        updatedShapes => {
            onShapesChange(updatedShapes);
            editorStore.setStage(stageRef.current);
        },
        [onShapesChange]
    );

    // Handle stage click - create new shape or select existing
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

            // Prepare new shape props with color overrides
            const baseProps = { ...SHAPE_DEFAULTS[tool] };
            if ('fill' in baseProps) baseProps.fill = currentColor;
            if ('stroke' in baseProps) baseProps.stroke = currentColor;

            const newShape = {
                id: `${tool}-${Date.now()}`,
                type: tool,
                x: pointerPosition.x / zoom,
                y: pointerPosition.y / zoom,
                visible: true,
                ...baseProps,
            };

            handleShapesChange(prev => [...prev, newShape]);
            setSelectedShapeId(newShape.id);
        } else {
            const clickedId = e.target._id || e.target.attrs.id;
            if (clickedId) setSelectedShapeId(clickedId);
        }
    };

    // Brush tool handlers
    const handleMouseDown = e => {
        if (editorStore.selectedTool !== 'brush') return;

        isDrawing.current = true;
        const stage = stageRef.current.getStage();
        const point = stage.getPointerPosition();
        const currentColor = editorStore.selectedColor ?? 'black';

        const newLine = {
            id: `brush-${Date.now()}`,
            type: 'brush',
            points: [point.x, point.y],
            ...SHAPE_DEFAULTS.brush,
            stroke: currentColor,
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
                        points: [...shape.points, point.x, point.y],
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

    // Render the component
    return (
        <Stage
            ref={stageRef}
            width={width * zoom}
            height={height * zoom}
            scaleX={zoom}
            scaleY={zoom}
            className="border-1"
            onClick={handleStageClick}
            onDblClick={() => { }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
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
                            onDblClick={() => setSelectedShapeId(id)}
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
                        resizeEnabled
                        rotateEnabled
                        borderStroke="black"
                        borderDash={[6, 2]}
                        anchorStroke="black"
                        anchorFill="white"
                        anchorSize={10}
                        flipEnabled
                        keepRatio
                    />
                )}
            </Layer>
        </Stage>
    );
});

export default Design;
