import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';

class EditorStore {
	project = null;
	loading = false;
	error = null;
	selectedTool = null;
	selectedColor = '#000000';
    projectJSON = null;

    stage = null;

	selectedShapeId = null;

	constructor() {
		makeAutoObservable(this);
	}

	setShape(selectedShapeId) {
		this.selectedShapeId = selectedShapeId;
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
}

export const editorStore = new EditorStore();
