import { Circle, Rect, Line, Text, RegularPolygon, Star, Arrow, Image, Ellipse } from 'react-konva';
export const SHAPE_COMPONENTS = {
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
    image: Image,
    ellipse: Ellipse
};

export const SHAPE_DEFAULTS = {
	circle: { radius: 30, fill: 'red', draggable: true },
	rect: { width: 80, height: 40, fill: 'green', draggable: true },
	text: { text: 'Text', fontSize: 20, fill: 'white', draggable: true },
	image: {
		width: 200,
		height: 200,
		draggable: true,
		filters: {
			blur: { active: false, value: 10 },
			brightness: { active: false, value: 0.3 },
			contrast: { active: false, value: 50 },
		},
	},
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

export const isText = (name) => name === "text";

export const isShape = (name) => [
    "circle",
    "rect",
    "line",
    "triangle",
    "pentagon",
    "hexagon",
    "star",
    "arrow",
    "image"
].includes(name);



