import { Circle, Rect, Line, Text, RegularPolygon, Star, Arrow, Image, Ellipse, Group } from 'react-konva';
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
	marker: Line,
	pencil: Line,
	eraser: Line,
	image: Image,
	ellipse: Ellipse,
	group: Group
};

export const SHAPE_DEFAULTS = {
	circle: { radius: 30, fill: 'red', draggable: true },
	rect: { width: 80, height: 40, fill: 'green', draggable: true },
	text: { text: 'Text', fontSize: 20, fill: 'white', draggable: true },
	image: {
		width: 1000,
		height: 1000,
		draggable: true,
		filters: {
			blur: { value: 0 },
			brightness: { value: 0 },
			contrast: { value: 50 },
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
		strokeWidth: 4,
		tension: 0.5,
		lineCap: 'round',
		globalCompositeOperation: 'source-over',
		draggable: false,
	},
	marker: {
		stroke: 'black',
		strokeWidth: 10,
		tension: 0.5,
		lineCap: 'round',
		globalCompositeOperation: 'source-over',
		draggable: false,
		opacity: 0.4,
	},
	pencil: {
		stroke: 'black',
		strokeWidth: 1.5,
		tension: 0.2,
		lineCap: 'butt',
		globalCompositeOperation: 'source-over',
		draggable: false,
		opacity: 0.9,
	},
	eraser: {
		strokeWidth: 20, // толщина ластика (можно регулировать)
		tension: 0.5,
		lineCap: 'round',
		globalCompositeOperation: 'destination-out', // этот режим "стирать"
		draggable: false,
		stroke: 'black',
		opacity: 1,
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



