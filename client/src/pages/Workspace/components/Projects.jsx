import { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { getUserProjects } from '../../../services/userService';
import { userStore } from '../../../store/userStore';
import NewProjectModal from './NewProjectModal';
import { useNavigate } from 'react-router-dom';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';

const Projects = () => {
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
        return `${previewImage}`;
    };

    const handleCreate = async newProjectData => {
        if (!newProjectData.title.trim()) {
            newProjectData.title = 'Untitled project';
        }

        editorStore.setProject(newProjectData);
        const designObject =
            newProjectData.info && typeof newProjectData.info === 'object' && Object.keys(newProjectData.info).length > 0
                ? newProjectData.info
                : {
                    attrs: {
                        width: newProjectData.width,
                        height: newProjectData.height,
                    },
                    className: 'Stage',
                    children: [
                        {
                            attrs: {},
                            className: 'Layer',
                            children: [
                                newProjectData.background.toLowerCase() !== "transparent" &&
                                {
                                    attrs: {
                                        width: newProjectData.width,
                                        height: newProjectData.height,
                                        fill: newProjectData.background.toLowerCase(),
                                        listening: false,
                                        name: 'Background',
                                        opacity: 1
                                    },
                                    className: 'Rect',
                                },
                            ],
                        },
                    ],
                };
        const response = await api.post('/projects', {
            title: newProjectData.title,
            previewImage: 'https://t4.ftcdn.net/jpg/02/01/98/73/360_F_201987380_YjR3kPM0PS3hF7Wvn7IBMmW1FWrMwruL.jpg',
            info: designObject,
            userId: userStore?.user?.id,
        });

        const designData = JSON.stringify(designObject);
        localStorage.setItem('designData', designData);
        navigate(`/canvas/${response.data.id}`);
    };


    const handleDeleteProject = async (projectId) => {
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects((prev) => prev.filter((project) => project.id !== projectId));
        } catch (err) {
            console.error("Error deleting project:", err);
        }
    };


    return (
        <div className='h-full'>
            <div className='flex items-center justify-between mb-4'>
                <div className='text-sm font-semibold text-white'>Projects</div>
                <button onClick={() => setIsModalOpen(true)} className='px-4 py-2 text-sm font-medium text-black transition-all bg-white rounded hover:bg-gray-200'>
                    + New
                </button>
            </div>

            <section
                aria-label="Recent templates"
                className="grid grid-cols-1 gap-5 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 "
            >
                {projects.map((project) => (
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

export default Projects;
