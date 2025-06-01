import { useEffect, useState } from 'react';
import DesignCard from './DesignCard';
import { getUserTemplates } from '../../../services/userService';
import { userStore } from '../../../store/userStore';
import NewProjectModal from './NewProjectModal';
import { useNavigate } from 'react-router-dom';
import { editorStore } from '../../../store/editorStore';
import { api } from '../../../services/api';
import Swal from 'sweetalert2';

const SUBSCRIPTION_LIMITS = {
    'basic': 3,
    'advanced': 10,
    'premium': Infinity
};

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

    const userSubscription = userStore.user?.subscription || 'basic';

    const userId = userStore.user?.id;
    useEffect(() => {
        const loadProjects = async () => {
            const response = await api.get('/projects/mcokster-projects');
            setProjects(response.data);
        }
        loadProjects();
    }, []);
    // useEffect(() => {
    // 	const loadProjects = async () => {
    // 		if (!userId) return;

    // 		try {
    // 			const data = await getUserTemplates(userId);
    // 			setProjects(data);
    // 		} catch (error) {
    // 			console.error('Error when downloading projects:', error);
    // 		}
    // 	};

    // 	loadProjects();
    // }, [userId]);

    const checkProjectLimit = async() => {
        const limit = SUBSCRIPTION_LIMITS[userSubscription];
        const response = await api.get(`/projects/user/${userId}`);
        if (response.data.length >= limit) {
            Swal.fire({
                title: 'Project Limit Reached',
                text: `Your ${userSubscription} subscription allows up to ${limit} projects. Please upgrade your plan to create more projects.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Upgrade Plan',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#9B34BA'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/pricing');
                }
            });
            console.log('here2');
            return false;
        }
        console.log('here3');
        return true;
    };

    const handleCreateFromTemplate = async (project) => {
        const canProceed = await checkProjectLimit();
        if (!canProceed) {
            console.log('Project limit reached');
            return;
        }

        try {
            console.log('Creating project from template');
            editorStore.setProject(project);
            const response = await api.post('/projects', {
                title: project.title,
                previewImage: project.previewImage,
                info: project.info,
                userId: userStore?.user?.id,
            });

            const designData = JSON.stringify(project.info);
            localStorage.setItem('designData', designData);
            navigate(`/canvas/${response.data.id}`);
        } catch (error) {
            if (error.response?.status === 403) {
                Swal.fire({
                    title: 'Project Limit Reached',
                    text: 'You have reached the maximum number of projects for your subscription tier.',
                    icon: 'error',
                    confirmButtonText: 'Upgrade Plan',
                    showCancelButton: true,
                    confirmButtonColor: '#9B34BA'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/pricing');
                    }
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to create project. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#9B34BA'
                });
            }
        }
    }

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

            <section
                aria-label="templates"
                className="grid grid-cols-1 gap-5 py-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 "
            >
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
                        onCardClick={() => handleCreateFromTemplate(project)}
                        onDelete={() => handleDeleteProject(project.id)}
                    />
                ))}
            </section>

            {isModalOpen && <NewProjectModal onClose={() => setIsModalOpen(false)} onCreate={handleCreate} />}
        </div>
    );
};

export default Templates;
