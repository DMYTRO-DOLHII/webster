import { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import FilterControl from './FilterControl';
import { Stage, Layer, Transformer } from 'react-konva';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { observer } from 'mobx-react-lite';
import { Rect } from 'react-konva';
import { editorStore } from '../../../../store/editorStore';
import { api } from '../../../../services/api';
import { SHAPE_COMPONENTS, SHAPE_DEFAULTS } from '../Shapes';
import isEqual from 'lodash.isequal';

const ImageWithFilters = forwardRef(({ shapeObject, ...props }, ref) => {
	const imageRef = useRef(null);

	useEffect(() => {
		if (imageRef.current) {
			imageRef.current.cache();
			imageRef.current.getLayer().batchDraw();
		}
	}, [shapeObject.filters, shapeObject.image]);

	const activeFilters = [Konva.Filters.Blur, Konva.Filters.Brighten, Konva.Filters.Contrast];

	const { image, filters, ...imageProps } = shapeObject;

	return (
		<SHAPE_COMPONENTS.image
			ref={node => {
				imageRef.current = node;
				if (typeof ref === 'function') ref(node);
				else if (ref) ref.current = node;
			}}
			id={shapeObject.id}
			name={shapeObject.name}
			image={image}
			filters={activeFilters}
			blurRadius={filters?.blur?.value || 0}
			brightness={filters?.brightness?.value || 0}
			contrast={filters?.contrast?.value || 0}
			{...imageProps}
			{...props}
		/>
	);
});

const Design = observer(({ shapes, onSaveRef, zoom, containerSize, containerRef, setZoom, setShapes }) => {
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

	const [imagePanelOpen, setImagePanelOpen] = useState(false);
	const [imageLibrary, setImageLibrary] = useState([]);

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

	const [skipSaving, setSkipSaving] = useState(false);

	const handleUndo = () => {
		const history = editorStore.projectHistory;
		if (history.length <= 1) return;

		console.log('undo');

		const last = history[history.length - 1];
		const previous = history[history.length - 2];

		editorStore.setRedo([last, ...editorStore.redo]);
		editorStore.setProjectHistory(history.slice(0, -1));

		setSkipSaving(true);
		localStorage.setItem('designData', JSON.stringify(previous));
		editorStore.setProjectJSON(previous);
		loadProjectFromJSON().finally(() => setSkipSaving(false));
	};

	const handleRedo = () => {
		const redo = editorStore.redo;
		if (redo.length === 0) return;

		console.log('redo');

		const next = redo[0];

		editorStore.setRedo(redo.slice(1));
		editorStore.setProjectHistory([...editorStore.projectHistory, next]);

		setSkipSaving(true);
		localStorage.setItem('designData', JSON.stringify(next));
		editorStore.setProjectJSON(next);
		loadProjectFromJSON().finally(() => setSkipSaving(false));
	};

	useEffect(() => {
		const handleKeyDown = e => {
			const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
			const modifierKey = isMac ? e.metaKey : e.ctrlKey;

			if (!modifierKey) return;

			if (e.key === 'z') {
				if (e.shiftKey) {
					e.preventDefault();
					handleRedo();
				} else {
					e.preventDefault();
					handleUndo();
				}
			} else if (e.key === 'y' && !e.shiftKey) {
				e.preventDefault();
				handleRedo();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleUndo, handleRedo]);

	useEffect(() => {
		widthRef.current = width;
	}, [width]);

	useEffect(() => {
		heightRef.current = height;
	}, [height]);

	useEffect(() => {
		loadProjectFromJSON();
	}, [editorStore.projectJSON, containerSize, setShapes]);

    useEffect(() => {
		const loadImages = async () => {
			const imageModules = import.meta.glob('../../../../assets/png/*.{png,jpg,jpeg,svg}', {
				eager: true,
				import: 'default',
			});

			const images = Object.values(imageModules).map(module => module);
			setImageLibrary(images);
		};

		loadImages();
	}, []);

	useEffect(() => {
		setImagePanelOpen(editorStore.selectedTool === 'imgpicker');
	}, [editorStore.selectedTool]);

	const addImage = async (src, x, y) => {
		const img = new window.Image();
		img.src = src;

		await new Promise(resolve => {
			img.onload = resolve;
			img.onerror = resolve;
		});

		const maxWidth = SHAPE_DEFAULTS.image.width;
		const maxHeight = SHAPE_DEFAULTS.image.height;
		const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

		const newImage = {
			id: `image-${Date.now()}`,
			type: 'image',
			name: `Image-${Date.now()}`,
			image: img,
			x: x,
			y: y,
			width: img.width * scale,
			height: img.height * scale,
			draggable: true,
			img64: src,
			opacity: 1,
			filters: {
				blur: { value: 0 },
				brightness: { value: 0 },
				contrast: { value: 0 },
			},
		};

		handleShapesChange(prev => [...prev, newImage]);

		setTimeout(() => {
			editorStore.setShape(newImage.id);
			editorStore.setTool('move');
		}, 0);
	};

	const handleDragStart = (e, imageSrc) => {
		e.dataTransfer.setData('image-src', imageSrc);
	};

	const handleDragOver = e => {
		e.preventDefault();
	};

	const handleDrop = e => {
		e.preventDefault();
		const stage = stageRef.current.getStage();
		const point = stage.getPointerPosition();

		const imageSrc = e.dataTransfer.getData('image-src');
		if (!imageSrc) return;

		addImage(imageSrc, point.x / zoom, point.y / zoom);
	};

	const loadProjectFromJSON = async () => {
		if (!containerSize.width || !containerSize.height) return;

		let jsonString = localStorage.getItem('designData');
		if (!jsonString && typeof editorStore.projectJSON === 'object') {
			try {
				jsonString = JSON.stringify(editorStore.projectJSON);
			} catch (e) {
				console.error('Failed to stringify projectJSON', e);
				return;
			}
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

			const layer = json.children?.filter(c => c.className === 'Layer');
			const loadedShapes =
				(layer.length > 1 ? layer[1] : layer[0])?.children?.map(shape => ({
					id: shape.attrs?.id || `${shape.className}-${Date.now()}`,
					type: shape.className?.toLowerCase(),
					visible: shape.visible !== false,
					...shape.attrs,
				})) || [];
			const shapedFromJSON = await Promise.all(
				loadedShapes.map(async shape => {
					if (shape.type === 'image' && shape.img64) {
						const img = new window.Image();
						img.src = shape.img64;

						await new Promise(resolve => {
							img.onload = resolve;
							img.onerror = resolve;
						});

						return {
							...shape,
							image: img,
							filters: shape.filters || {
								blur: { value: 0 },
								brightness: { value: 0 },
								contrast: { value: 0 },
							},
						};
					}

					if (shape.type === 'group') {
						const shps = [];
						for (const sh of shape.layers) {
							if (sh.type === 'image' && sh.img64) {
								const img = new window.Image();
								img.src = sh.img64;

								await new Promise(resolve => {
									img.onload = resolve;
									img.onerror = resolve;
								});

								shps.push({
									...sh,
									image: img,
									filters: sh.filters || {
										blur: { value: 0 },
										brightness: { value: 0 },
										contrast: { value: 0 },
									},
								});
								continue;
							}
							shps.push(sh);
						}
						return {
							...shape,
							layers: shps,
						};
					}
					return shape;
				})
			);

			setShapes(shapedFromJSON);
		} catch (err) {
			console.error('Failed to parse designData', err);
		}
	};

	useEffect(() => {
		const handleClickOutside = event => {
			const container = containerRef.current;
			const stage = stageRef.current?.getStage()?.content;

			if (!container) return;

			if (!container.contains(event.target)) return;

			if (stage && stage.contains(event.target)) return;

			editorStore.setShape(null);
		};

		const handleKeyDown = event => {
			if (event.key === 'Escape') {
				editorStore.setShape(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const saveDesign = useCallback(async () => {
		if (!stageRef.current) return;

		saveState();

		const jsonString = stageRef.current.toJSON();
		if (!jsonString || jsonString === lastSavedDesign.current) return;
		try {
			const jsonObject = JSON.parse(jsonString);

			if (jsonObject.children && jsonObject.children.length > 0) {
				for (const layer of jsonObject.children) {
					if (layer.className === 'Layer' && layer.children) {
						for (const shape of layer.children) {
							if (shape.className === 'Image') {
								const originalShape = shapes.find(s => s.id === shape.attrs.id);
								if (originalShape && originalShape.img64) {
									shape.attrs.img64 = originalShape.img64;
								}
							}
							if (shape.className === 'Group') {
								for (const sh of shape.attrs.layers) {
									if (sh.className === 'Image') {
										const originalGroup = shapes.find(s => s.id === shape.attrs.id);
										const originalShape = originalGroup.layers.find(s => s.id === sh.attrs.id);
										if (originalShape && originalShape.img64) {
											sh.attrs.img64 = originalShape.img64;
										}
									}
								}
							}
						}
					}
				}
			}

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
		} catch (error) {
			console.error('Save failed:', error);
		}
	}, [projectId, shapes]);

	const saveState = useCallback(() => {
		if (skipSaving || !stageRef.current) return;

		const jsonObject = JSON.parse(stageRef.current.toJSON());

		if (widthRef.current) jsonObject.attrs.width = widthRef.current;
		if (heightRef.current) jsonObject.attrs.height = heightRef.current;

		const currentHistory = editorStore.projectHistory || [];
		const currentIndex = editorStore.currentHistoryIndex ?? currentHistory.length - 1;

		const last = currentHistory[currentIndex];

		if (last && isEqual(last, jsonObject)) return;

		const newHistory = [...currentHistory.slice(0, currentIndex + 1), jsonObject];
		editorStore.setProjectHistory(newHistory);
		editorStore.setCurrentHistoryIndex(newHistory.length - 1);
	}, []);

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
		const handleKeyDown = e => {
			const selectedShape = shapeRefs.current[editorStore.selectedShapeId];

			if (!selectedShape) return;
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

			selectedShape.position({
				x: selectedShape.x() + dx,
				y: selectedShape.y() + dy,
			});

			selectedShape.getLayer().batchDraw();

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

	const handleDeleteShape = (wholeGroup = false) => {
		if (!contextMenu.shapeId) return;
		const shapeIdToDelete = contextMenu.shapeId;
		const groupShape = shapes.find(shape => shape.type === 'group' && shape.layers?.some(child => child.id === shapeIdToDelete));
		if (groupShape) {
			setShapes(prev => {
				if (wholeGroup) {
					return prev.filter(shape => shape.id !== groupShape.id);
				}
				return prev.map(shape => {
					if (shape.id === groupShape.id) {
						const filteredLayers = shape.layers.filter(layer => layer.id !== shapeIdToDelete);
						return { ...shape, layers: filteredLayers };
					}
					return shape;
				});
			});
		} else {
			setShapes(prev => prev.filter(shape => shape.id !== shapeIdToDelete));
		}
		if (editorStore.selectedShapeId === shapeIdToDelete) {
			editorStore.setShape(null);
		}
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
					x: point.x,
					y: point.y / zoom,
					width: img.width * scale,
					height: img.height * scale,
					draggable: true,
					img64: event.target.result,
					opacity: 1,
					filters: {
						blur: { value: 0 },
						brightness: { value: 0 },
						contrast: { value: 0 },
					},
				};

				handleShapesChange(prev => [...prev, newImage]);
				setContextMenu({ ...contextMenu, visible: false });
			};
		};
		reader.readAsDataURL(file);
	};

	const handleDoubleClick = id => {
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

	const handleZoomAtPoint = (stage, pointer, direction) => {
		const scaleBy = 1.2;
		const oldScale = zoom;
		const newZoom = direction > 0 ? zoom * scaleBy : zoom / scaleBy;

		stage.scale({ x: newZoom, y: newZoom });
		stage.batchDraw();
		setZoom(newZoom);
		localStorage.setItem('zoomValue', newZoom);
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
		const pointerPosition = stage.getPointerPosition();
		const baseProps = { ...SHAPE_DEFAULTS };
		const tool = editorStore.selectedTool;

		if (tool === 'picker') {
			const clickedShape = e.target;
			if (clickedShape && clickedShape !== stage) {
				const shapeAttrs = clickedShape.attrs;

				const pickedColor = shapeAttrs.fill || shapeAttrs.stroke;
				if (pickedColor) {
					editorStore.setColor(pickedColor);
				}
			}
			return;
		}

		if (tool === 'zoom') {
			const direction = e.evt.altKey ? -1 : 1;
			handleZoomAtPoint(stage, pointerPosition, direction);
			return;
		}

		if (e.target === stage) {
			if (!SHAPE_DEFAULTS[tool] || tool === 'brush' || tool === 'marker' || tool === 'pencil' || tool === 'eraser') {
				editorStore.setShape(null);
				return;
			}

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
            console.log(clickedId)
			if (clickedId) {
				const groupShape = shapes.find(shape => shape.type === 'group' && shape.layers?.some(child => child.id === clickedId));

				if (groupShape) {
					if (!e.evt.shiftKey) editorStore.setShape(null);
					e.shiftKey = true;
					editorStore.setShape(groupShape.id, e);
					groupShape.layers
						.map(s => s.id)
						.forEach(element => {
							editorStore.setShape(element, e);
						});
				} else {
					editorStore.setShape(clickedId, e);
				}
				editorStore.setTool('move');
			}
		}
	};
	const handleMouseDown = e => {
		const { selectedTool } = editorStore;

		if (!['brush', 'marker', 'pencil', 'eraser'].includes(selectedTool)) return;

		isDrawing.current = true;
		const stage = stageRef.current.getStage();
		const point = stage.getPointerPosition();

		const toolDefaults = SHAPE_DEFAULTS[selectedTool];

		const currentColor = editorStore.selectedColor ?? toolDefaults.stroke;

		const newLine = {
			id: `${selectedTool}-${Date.now()}`,
			type: selectedTool,
			points: [point.x / zoom, point.y / zoom],
			...toolDefaults,
			stroke: currentColor,
			opacity: toolDefaults.opacity || 1,
			name: selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1),
		};

		handleShapesChange(prev => [...prev, newLine]);
		setCurrentLineId(newLine.id);
	};

	const handleMouseMove = e => {
		const { selectedTool } = editorStore;
		if (!isDrawing.current || !['brush', 'marker', 'pencil', 'eraser'].includes(selectedTool)) return;

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
		const { selectedTool } = editorStore;
		if (!['brush', 'marker', 'pencil', 'eraser'].includes(selectedTool)) return;

		isDrawing.current = false;
		setCurrentLineId(null);
	};

	const handleCrop = () => {
		if (!cropRect) return;

		const croppedShapes = shapes
			.map(shape => {
				const { x, y, width = 0, height = 0 } = shape;

				const intersects = x + width > cropRect.x && x < cropRect.x + cropRect.width && y + height > cropRect.y && y < cropRect.y + cropRect.height;

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
		editorStore.setTool('move');
		setCropRect(null);
	};

	const createCheckerboardPattern = (cellSize = 10, lightColor = '#ffffff', darkColor = '#eeeeee') => {
		const patternCanvas = document.createElement('canvas');
		const size = cellSize * 2;
		patternCanvas.width = size;
		patternCanvas.height = size;

		const ctx = patternCanvas.getContext('2d');

		if (ctx) {
			ctx.fillStyle = lightColor;
			ctx.fillRect(0, 0, size, size);

			ctx.fillStyle = darkColor;
			ctx.fillRect(0, 0, cellSize, cellSize);
			ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
		}

		const img = new Image();
		img.src = patternCanvas.toDataURL();

		return img;
	};
	const renderShape = shape => {
		const Component = SHAPE_COMPONENTS[shape.type];
		if (!Component) return null;

		if (shape.type === 'image') {
			return (
				<ImageWithFilters
					key={shape.id}
					id={shape.id}
					shapeObject={shape}
					ref={el => {
						if (el) shapeRefs.current[shape.id] = el;
					}}
					onDragEnd={debouncedSave}
					onTransformEnd={debouncedSave}
					onMouseUp={debouncedSave}
					onDblClick={() => handleDoubleClick(shape.id)}
					draggable={!!shape.parentGroup ? false : shape.draggable}
				/>
			);
		}

		if (shape.type === 'group') {
			return (
				<Component
					key={shape.id}
					{...shape}
					visible={shape.visible !== false}
					draggable={true}
					onDragEnd={debouncedSave}
					onTransformEnd={debouncedSave}
					onMouseUp={debouncedSave}
					onDblClick={() => handleDoubleClick(shape.id)}
					ref={el => {
						if (el) shapeRefs.current[shape.id] = el;
					}}
				>
					{shape.layers.map(layer => {
						return renderShape({ ...layer, parentGroup: shape.id });
					})}
				</Component>
			);
		}

		return (
			<Component
				key={shape.id}
				id={shape.id}
				{...shape}
				onDragEnd={debouncedSave}
				onTransformEnd={debouncedSave}
				onMouseUp={debouncedSave}
				onDblClick={() => handleDoubleClick(shape.id)}
				visible={shape.visible !== false}
				draggable={!!shape.parentGroup ? false : shape.draggable}
				ref={el => {
					if (el) shapeRefs.current[shape.id] = el;
				}}
			/>
		);
	};

	return (
		<div className='flex h-full' onDragOver={handleDragOver} onDrop={handleDrop}>
			{imagePanelOpen && (
				<div className='fixed top-0 left-10 bottom-0 z-20 w-64 bg-[#1F1F1F] border-r border-gray-700 p-4 overflow-y-auto transition-all duration-300 ease-in-out'>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-lg font-semibold text-white'></h3>
						<button
							onClick={() => {
								setImagePanelOpen(false);
								editorStore.setTool('move');
							}}
							className='text-white hover:text-gray-300'
						>
							✕
						</button>
					</div>

					<div className='grid grid-cols-2 gap-2'>
						{imageLibrary.map((src, index) => (
							<div
								key={index}
								className='overflow-hidden border-2 border-transparent rounded-md cursor-pointer hover:border-purple-500 group'
								draggable
								onDragStart={e => handleDragStart(e, src)}
								onClick={() => {
									const stage = stageRef.current?.getStage();
									if (!stage) return;

									const centerX = (width * zoom) / 2;
									const centerY = (height * zoom) / 2;

									addImage(src, centerX, centerY);
								}}
							>
								<img src={src} alt={`Image ${index}`} className='object-contain w-full h-24 p-1 transition-opacity bg-white rounded-sm group-hover:opacity-80' />
							</div>
						))}
					</div>
				</div>
			)}
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
				onDblClick={e => {}}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onContextMenu={handleContextMenu}
			>
				<Layer>
					<Rect
						name='background'
						x={0}
						y={0}
						width={editorStore?.width ?? 0}
						height={editorStore?.height ?? 0}
						fillPatternImage={createCheckerboardPattern(7, '#1D2023FF', '#2D2F34FF')}
						listening={false}
					/>
				</Layer>
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

							<Rect {...cropRect} stroke='black' strokeWidth={2} dash={[10, 4]} listening={false} />
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
					{shapes.map(shape => renderShape(shape))}

					{editorStore.selectedShapes.length > 0 && (
						<Transformer
							nodes={editorStore.selectedShapes.map(id => shapeRefs.current[id]).filter(Boolean)}
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
						<div>
							<div style={{ padding: '8px 16px', cursor: 'pointer', color: 'red' }} onClick={handleDeleteShape}>
								Delete element
							</div>
							<div
								style={{ padding: '8px 16px', cursor: 'pointer', color: 'red' }}
								onClick={() => {
									handleDeleteShape(true);
								}}
							>
								Delete group
							</div>
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
