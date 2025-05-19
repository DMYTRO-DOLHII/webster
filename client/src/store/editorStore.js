import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';

class EditorStore {
	project = null;
	loading = false;
	error = null;
	selectedTool = null;
	selectedColor = '#000000';
    proejctJSON = null;

	constructor() {
		makeAutoObservable(this);
	}

	setProject(projectData) {
		this.project = projectData;
	}

    setProjectJSON(josn) {
        this.proejctJSON = josn;
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
