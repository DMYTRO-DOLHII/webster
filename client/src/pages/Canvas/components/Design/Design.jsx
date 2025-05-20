import { editorStore } from '../../../../store/editorStore';
import { Stage, Layer, Circle, Rect, Line, Text, RegularPolygon, Star, Arrow, Transformer } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';

const SHAPE_COMPONENTS = {
    circle: Circle,
    rect: Rect,
    text: Text,
    line: Line,
    triangle: RegularPolygon,
    pentagon: RegularPolygon,
    hexagon: RegularPolygon,
    star: Star,
    arrow: Arrow,
    brush: Line,
};

const SHAPE_DEFAULTS = {
    circle: { radius: 30, fill: 'red', draggable: true },
    rect: { width: 80, height: 40, fill: 'green', draggable: true },
    text: { text: 'Text', fontSize: 20, fill: 'white', draggable: true },
    line: {
        points: [-30, -30, 30, 30],
        stroke: 'blue',
        strokeWidth: 2,
        draggable: true,
    },
    triangle: {
        sides: 3,
        radius: 40,
        fill: 'orange',
        draggable: true,
    },
    pentagon: {
        sides: 5,
        radius: 40,
        fill: 'yellow',
        draggable: true,
    },
    hexagon: {
        sides: 6,
        radius: 40,
        fill: 'purple',
        draggable: true,
    },
    star: {
        numPoints: 5,
        innerRadius: 20,
        outerRadius: 40,
        fill: 'gold',
        draggable: true,
    },
    arrow: {
        points: [0, 0, 100, 0],
        pointerLength: 10,
        pointerWidth: 10,
        stroke: 'cyan',
        strokeWidth: 4,
        draggable: true,
    },
    brush: {
        stroke: 'black',
        strokeWidth: 3,
        tension: 0.5,
        lineCap: 'round',
        globalCompositeOperation: 'source-over',
        draggable: false,
    },
};

const Design = observer(({ shapes, onSaveRef, zoom, containerSize, setZoom, onShapesChange }) => {
    const stageRef = useRef(null);
    // const [shapes, setShapes] = useState([]);
    const [selectedShapeId, setSelectedShapeId] = useState(null);
    const shapeRefs = useRef({});

    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);

    const { projectId } = useParams();

    const isDrawing = useRef(false);
    const [currentLine, setCurrentLine] = useState(null);

    const lastSavedDesign = useRef(null);

    // Load saved design from localStorage or from editorStore
    useEffect(() => {
        let jsonString = localStorage.getItem('designData');
        if (!jsonString && typeof editorStore.projectJSON === 'object') {
            jsonString = JSON.stringify(editorStore.projectJSON);
        }

        if (!jsonString || !containerSize.width || !containerSize.height) {
            return;
        }

        if (jsonString) {
            try {
                const json = JSON.parse(jsonString);
                if (json.attrs) {
                    if (json.attrs.width) setWidth(json.attrs.width);
                    if (json.attrs.height) setHeight(json.attrs.height);
                }

                let loadedShapes = [];
                if (json.children && json.children.length > 0) {
                    const layer = json.children.find(c => c.className === 'Layer');
                    if (layer && layer.children) {
                        loadedShapes = layer.children.map(shape => ({
                            id: shape.attrs.id || `${shape.className}-${Date.now()}`,
                            type: shape.className.toLowerCase(),
                            visible: shape.visible !== false,
                            ...shape.attrs,
                        }));
                    }
                }
                // setShapes(loadedShapes);
                handleShapesChange(loadedShapes);
            } catch (e) {
                console.error('Failed to parse designData', e);
            }
        }
    }, [editorStore.projectJSON, containerSize]);

    const saveDesign = async () => {
        const jsonString = getDesignJson();
        if (!jsonString) return;

        if (jsonString === lastSavedDesign.current) return;

        try {
            const jsonObject = JSON.parse(jsonString);

            if (width) jsonObject.attrs.width = width;
            if (height) jsonObject.attrs.height = height;

            const json = JSON.stringify(jsonObject);
            localStorage.setItem('designData', json);
            await api.patch(`/projects/${projectId}`, { info: JSON.parse(json) });
            lastSavedDesign.current = json;
            console.log('saved');
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const debouncedSave = useRef(debounce(saveDesign, 500)).current;
    const handleShapesChange = (shapes) => {
        // setShapes(shapes);
        onShapesChange(shapes);
    };
    const handleStageClick = e => {
        const stage = stageRef.current.getStage();
        const clickedOnEmpty = e.target === stage;

        if (clickedOnEmpty) {
            const tool = editorStore.selectedTool;
            if (!SHAPE_DEFAULTS[tool] || tool === 'brush') {
                setSelectedShapeId(null);
                return;
            }

            const pointerPosition = stage.getPointerPosition();
            const currentColor = editorStore.selectedColor || '#000000';

            let newShapeProps = { ...SHAPE_DEFAULTS[tool] };
            if ('fill' in newShapeProps) {
                newShapeProps.fill = currentColor;
            }
            if ('stroke' in newShapeProps) {
                newShapeProps.stroke = currentColor;
            }

            const newShape = {
                id: `${tool}-${Date.now()}`,
                type: tool,
                x: pointerPosition.x / zoom,
                y: pointerPosition.y / zoom,
                visible: true,
                ...newShapeProps,
            };

            // setShapes(prev => [...prev, newShape]);
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
        const currentColor = editorStore.selectedColor || 'black';

        const newLine = {
            id: `brush-${Date.now()}`,
            type: 'brush',
            points: [point.x, point.y],
            ...SHAPE_DEFAULTS.brush,
            stroke: currentColor,
        };
        // setShapes(prev => [...prev, newLine]);
        handleShapesChange(prev => [...prev, newLine]);
        setCurrentLine(newLine.id);
    };

    const handleMouseMove = e => {
        if (!isDrawing.current || editorStore.selectedTool !== 'brush') return;
        const stage = stageRef.current.getStage();
        const point = stage.getPointerPosition();

        // setShapes(prevShapes =>
        //     prevShapes.map(shape => {
        //         if (shape.id === currentLine) {
        //             return {
        //                 ...shape,
        //                 points: [...shape.points, point.x, point.y],
        //             };
        //         }
        //         return shape;
        //     })
        // );
        handleShapesChange(
            prevShapes =>
                prevShapes.map(shape => {
                    if (shape.id === currentLine) {
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
        setCurrentLine(null);
    };

    const getDesignJson = () => {
        if (!stageRef.current) return null;
        return stageRef.current.toJSON();
    };

    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(getDesignJson);
        }
    }, [onSaveRef]);

    useEffect(() => {
        if (!width || !height || !containerSize.width || !containerSize.height) return;
        if (localStorage.getItem('zoomValue')) {
            setZoom(parseFloat(localStorage.getItem('zoomValue')));
            return;
        };

        const scaleX = containerSize.width / width;
        const scaleY = containerSize.height / height;

        const scale = Math.min(scaleX, scaleY, 1);
        setZoom(scale);
    }, [height, width, containerSize, setZoom]);

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
                        borderStroke='black'
                        borderDash={[6, 2]}
                        anchorStroke='black'
                        anchorFill='white'
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

