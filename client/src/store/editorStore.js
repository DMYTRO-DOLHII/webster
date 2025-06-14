import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';

class EditorStore {
	project = null;
	loading = false;
	error = null;
	selectedTool = null;
	selectedColor = '#000000';
	projectJSON = null;

	projectHistory = [];
	redo = [];
	currentHistoryIndex = null;

	width = null;
	height = null;

	stage = null;

	selectedShapeId = null;

	selectedShapes = [];

	constructor() {
		makeAutoObservable(this);
	}
	setShape(selectedShapeId, event) {
		this.selectedShapeId = selectedShapeId;
		if (selectedShapeId === null) this.selectedShapes = [];
		else if ((event?.shiftKey || event?.evt?.shiftKey) && !this.selectedShapes.includes(selectedShapeId)) {
			this.selectedShapes = [...this.selectedShapes, selectedShapeId];
			this.selectedShapeId = null;
		}
		else this.selectedShapes = [selectedShapeId];
	}

	setStage(stage) {
		this.stage = stage;
	}

	setProject(projectData) {
		this.project = projectData;
	}

	setProjectJSON(json) {
		this.projectJSON = json;
	}

	updateProject(updates) {
		if (!this.project) return;
		runInAction(() => {
			this.project = { ...this.project, ...updates };
		});
	}

	clearProject() {
		this.project = null;
	}

	setTool(tool) {
		this.selectedTool = tool;
	}

	setColor(color) {
		this.selectedColor = color;
	}

	setWidth(width) {
		this.width = width;
	}

	setHeight(height) {
		this.height = height;
	}

	setCurrentHistoryIndex(index) {
		this.currentHistoryIndex = index;
	}

	setProjectHistory(history) {
		this.projectHistory = history;
		this.currentHistoryIndex = history.length - 1;
	}

	setRedo(redo) {
		this.redo = redo;
	}
}

export const editorStore = new EditorStore();
