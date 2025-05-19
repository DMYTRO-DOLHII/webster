import { editorStore } from '../../../../store/editorStore';
import { Stage, Layer, Circle, Rect, Line, Text, RegularPolygon, Star, Arrow, Transformer } from 'react-konva';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../../services/api';
import LoadingSpinner from '../../../../components/LoadingSpinner';

const SHAPE_COMPONENTS = {
    circle: Circle,
    rect: Rect,
    text: Text,
    line: Line,
    triangle: RegularPolygon,
    pentagon: RegularPolygon,
    hexagon: RegularPolygon,
    rhombus: RegularPolygon,
    star: Star,
    arrow: Arrow,
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
};

const Design = ({ onSaveRef, zoom, containerSize, setZoom }) => {
    // console.log(containerSize);
    const stageRef = useRef(null);
    const [shapes, setShapes] = useState([]);
    const [selectedShapeId, setSelectedShapeId] = useState(null);
    const shapeRefs = useRef({});

    const { projectId } = useParams();

    const [width, setWidth] = useState(500);
    const [height, setHeight] = useState(500);


    const handleWheel = (e) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const scaleBy = 1.05;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    // Load JSON from localStorage
    useEffect(() => {
        const jsonString = localStorage.getItem('designData');
        if (jsonString) {
            try {
                const json = JSON.parse(jsonString);
                // console.log(json)

                setWidth(json.attrs.width);
                setHeight(json.attrs.height);

                let loadedShapes = [];

                if (json.children && json.children.length > 0) {
                    const layer = json.children.find(c => c.className === 'Layer');
                    if (layer && layer.children) {
                        loadedShapes = layer.children.map(shape => ({
                            id: shape.attrs.id || `${shape.className}-${Date.now()}`,
                            type: shape.className.toLowerCase(),
                            ...shape.attrs,
                        }));
                    }
                }

                setShapes(loadedShapes);
            } catch (e) {
                console.error('Failed to parse designData', e);
            }
        }
    }, []);

    const handleStageClick = e => {
        const stage = stageRef.current.getStage();
        const clickedOnEmpty = e.target === stage;

        if (clickedOnEmpty) {
            setSelectedShapeId(null);
        } else {
            const clickedId = e.target._id || e.target.attrs.id;
            if (clickedId) setSelectedShapeId(clickedId);
        }
    };

    const handleStageDblClick = e => {
        const stage = stageRef.current.getStage();
        const clickedOnEmpty = e.target === stage;

        if (clickedOnEmpty) {
            const tool = editorStore.selectedTool;
            if (!SHAPE_DEFAULTS[tool]) return;

            const pointerPosition = stage.getPointerPosition();

            const newShape = {
                id: `${tool}-${Date.now()}`,
                type: tool,
                x: pointerPosition.x,
                y: pointerPosition.y,
                ...SHAPE_DEFAULTS[tool],
            };

            setShapes(prev => [...prev, newShape]);
        }
    };

    const handleDoubleClick = id => {
        setSelectedShapeId(id);
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

    // useEffect(() => {
    //     const interval = setInterval(async () => {
    //         const json = getDesignJson();
    //         if (json) {
    //             const response = await api.patch(`/projects/${projectId}`, { info: JSON.parse(json) });
    //             localStorage.setItem('designData', json);
    //         }
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    // Expose save function
    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(getDesignJson);
        }
    }, [onSaveRef]);

    // Calculate fit zoom
    useEffect(() => {
        if (!width || !height || !containerSize.width || !containerSize.height) return;
        if (localStorage.getItem('zoomValue')) {
            setZoom(parseFloat(localStorage.getItem('zoomValue')));
            return;
        };

        const designWidth = width;
        const designHeight = height;

        const scaleX = containerSize.width / designWidth;
        const scaleY = containerSize.height / designHeight;

        const scale = Math.min(scaleX, scaleY, 1); // don’t scale up if design is smaller
        setZoom(scale);
    }, [height, width, containerSize]);

    return (
        <Stage ref={stageRef}
            width={width * zoom}
            height={height * zoom}
            scaleX={zoom}
            scaleY={zoom}
            className="border-red-400 border-4"
            onWheel={handleWheel}
            onClick={handleStageClick} onDblClick={handleStageDblClick}>
            <Layer>
                {shapes.map(shape => {
                    const Component = SHAPE_COMPONENTS[shape.type];
                    return Component ? (
                        <Component
                            key={shape.id}
                            id={shape.id}
                            {...shape}
                            draggable
                            onDblClick={() => handleDoubleClick(shape.id)}
                            ref={el => {
                                if (el) {
                                    shapeRefs.current[shape.id] = el;
                                }
                            }}
                        />
                    ) : null;
                })}
                {selectedShapeId && shapeRefs.current[selectedShapeId] && (
                    <Transformer
                        nodes={[shapeRefs.current[selectedShapeId]]}
                        resizeEnabled={true}
                        rotateEnabled={true}
                        borderStroke='black'
                        borderDash={[6, 2]}
                        anchorStroke='black'
                        anchorFill='white'
                        anchorSize={10}
                        flipEnabled={false}
                    />
                )}
            </Layer>
        </Stage>
    );
};

export default Design;
