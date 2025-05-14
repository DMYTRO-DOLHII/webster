import { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { getUserProjects } from '../../../services/userService';
import { userStore } from '../../../store/userStore';

const Recents = () => {
	const [projects, setProjects] = useState([]);
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

	return (
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
	);
};

export default Recents;
