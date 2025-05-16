import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../services/api';

class EditorStore {
	project = null;
	loading = false;
	error = null;

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

	async saveProjectToServer() {
		if (!this.project) return;

		this.loading = true;
		this.error = null;

		try {
			const response = await api();
			runInAction(() => {
				this.project = response.data;
			});
		} catch (error) {
			runInAction(() => {
				this.error = error.response?.data?.message || 'Save failed';
			});
		} finally {
			runInAction(() => {
				this.loading = false;
			});
		}
	}
}

export const editorStore = new EditorStore();
