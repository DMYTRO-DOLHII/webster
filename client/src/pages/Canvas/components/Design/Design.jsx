import { editorStore } from '../../../../store/editorStore';
import { Stage, Layer, Circle, Rect, Line, Text, RegularPolygon, Star, Arrow, Transformer } from 'react-konva';
import { useEffect, useState, useRef } from 'react';

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

const Design = ({ onSaveRef }) => {
	const stageRef = useRef(null);
	const [shapes, setShapes] = useState([]);
	const [selectedShapeId, setSelectedShapeId] = useState(null);
	const shapeRefs = useRef({});

	const [width, setWidth] = useState(500);
	const [height, setHeight] = useState(500);

	const isDrawing = useRef(false);
	const [currentLine, setCurrentLine] = useState(null);

	useEffect(() => {
		const jsonString = localStorage.getItem('designData');
		if (jsonString) {
			try {
				const json = JSON.parse(jsonString);
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
			const tool = editorStore.selectedTool;
			if (!SHAPE_DEFAULTS[tool] || tool === 'brush') {
				// Очистить выделение, если фигура не создаётся
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
				x: pointerPosition.x,
				y: pointerPosition.y,
				...newShapeProps,
			};

			setShapes(prev => [...prev, newShape]);
			setSelectedShapeId(newShape.id);
		} else {
			// Клик по фигуре — выделяем её
			const clickedId = e.target._id || e.target.attrs.id;
			if (clickedId) setSelectedShapeId(clickedId);
		}
	};

	// Удаляем логику двойного клика для создания фигур — пустая функция
	const handleStageDblClick = e => {};

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
		setShapes(prev => [...prev, newLine]);
		setCurrentLine(newLine.id);
	};

	const handleMouseMove = e => {
		if (!isDrawing.current || editorStore.selectedTool !== 'brush') return;
		const stage = stageRef.current.getStage();
		const point = stage.getPointerPosition();

		setShapes(prevShapes =>
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

	useEffect(() => {
		const interval = setInterval(() => {
			const json = getDesignJson();
			if (json) {
				localStorage.setItem('designData', json);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [shapes]);

	return (
		<Stage
			ref={stageRef}
			width={width}
			height={height}
			onClick={handleStageClick}
			onDblClick={handleStageDblClick}
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
							onDblClick={() => handleDoubleClick(id)}
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
	);
};

export default Design;
