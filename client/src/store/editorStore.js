import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';

class EditorStore {
	project = null;
	loading = false;
	error = null;
	selectedTool = null;
	
	constructor() {
		makeAutoObservable(this);
	}

	setProject(projectData) {
		this.project = projectData;
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
}

export const editorStore = new EditorStore();
