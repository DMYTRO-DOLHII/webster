import { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { getUserProjects } from '../../../services/userService';
import { userStore } from '../../../store/userStore';
import NewProjectModal from './NewProjectModal'; 
import { useNavigate } from 'react-router-dom';
import { editorStore } from '../../../store/editorStore';

const Recents = () => {
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
				const data = await getUserProjects(userId);
				setProjects(data);
			} catch (error) {
				console.error('Ошибка при загрузке проектов:', error);
			}
		};

		loadProjects();
	}, [userId]);

	const resolveImageSrc = previewImage => {
		if (!previewImage) return 'https://via.placeholder.com/160x100?text=No+Preview';
		if (previewImage.startsWith('http')) return previewImage;
		return `data:image/png;base64,${previewImage}`;
	};

	const handleCreate = newProjectData => {
		editorStore.setProject(newProjectData);
		console.log(newProjectData)
		navigate('/canvas');
	};

	return (
		<>
			<div className='flex items-center justify-between mb-4'>
				<div className='text-sm font-semibold text-white'>Projects</div>
				<button onClick={() => setIsModalOpen(true)} className='px-4 py-2 text-sm font-medium text-black transition-all bg-white rounded hover:bg-gray-200'>
					+ New
				</button>
			</div>

			<section aria-label='Recent templates' className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 overflow-clip'>
				{projects.map(project => (
					<DesignCard
						key={project.id}
						project={{
							imageUrl: resolveImageSrc(project.previewImage),
							title: project.title,
							editedText: `Edited ${new Date(project.updatedAt).toLocaleDateString()}`,
							userInitial: userStore.user?.fullName?.[0] || 'U',
							userBgColor: 'bg-blue-500',
							userTextColor: 'text-white',
						}}
					/>
				))}
			</section>

			{isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />}
		</>
	);
};

export default Recents;
