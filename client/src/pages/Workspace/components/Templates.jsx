import { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { getUserTemplates } from '../../../services/userService';
import { userStore } from '../../../store/userStore';
import NewProjectModal from './NewProjectModal';
import { useNavigate } from 'react-router-dom';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';

const Templates = () => {

    const [projects, setProjects] = useState([]);
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newProject, setNewProject] = useState({
		title: '',
		width: 1920,
		height: 1080,
		units: 'px',
	});

	const userId = userStore.user?.id;
	useEffect(() => {
		const loadProjects = async () => {
			if (!userId) return;

			try {
				const data = await getUserTemplates(userId);
				setProjects(data);
			} catch (error) {
				console.error('Error when downloading projects:', error);
			}
		};

		loadProjects();
	}, [userId]);

	const resolveImageSrc = previewImage => {
		if (!previewImage) return 'https://via.placeholder.com/160x100?text=No+Preview';
		if (previewImage.startsWith('http')) return previewImage;
		return `${previewImage}`;
	};

	const handleDeleteProject = async projectId => {
		try {
			await api.delete(`/projects/${projectId}`);
			setProjects(prev => prev.filter(project => project.id !== projectId));
		} catch (err) {
			console.error('Error deleting project:', err);
		}
	};

	return (
		<div className='h-full'>
			<div className='flex items-center justify-between mb-4'>
				<div className='text-sm font-semibold text-white'>Templates</div>
			</div>

			<section aria-label='Recent templates' className='grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '>
				{projects.map(project => (
					<DesignCard
						key={project.id}
						project={{
							id: project.id,
							info: project.info,
							imageUrl: resolveImageSrc(project.previewImage),
							title: project.title,
							editedText: `Edited ${new Date(project.updatedAt).toLocaleDateString()}`,
							userInitial: userStore.user?.fullName?.[0] || 'U',
							userBgColor: 'bg-blue-500',
							userTextColor: 'text-white',
						}}
						onDelete={() => handleDeleteProject(project.id)}
					/>
				))}
			</section>

			{isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />}
		</div>
	);
};

export default Templates;
