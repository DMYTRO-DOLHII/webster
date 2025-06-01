import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';

export const ProjectController = {
    async create(req: Request, res: Response): Promise<Response> {
        const { title, previewImage, info, userId } = req.body;

        try {
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const project = Project.create({
                title,
                previewImage,
                info,
                user,
            });

            await project.save();
            return res.status(201).json(project);
        } catch (error) {
            console.error('Create project error:', error);
            return res.status(500).json({ message: 'Failed to create project' });
        }
    },

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const projects = await Project.find({ relations: ['user'] });
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch projects' });
        }
    },

    async getOne(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            // Fetch the full current user
            const currentUser = await User.findOne({
                where: { id: userId.toString() }
            });

            if (!currentUser) {
                return res.status(401).json({ error: 'Unauthorized: user not found' });
            }

            // Fetch the project with its owner
            const project = await Project.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // If the current user is the owner, allow
            if (project.user.id === userId) {
                return res.status(200).json(project);
            }

            // Define subscription hierarchy
            const subscriptionLevels: Record<string, number> = {
                basic: 1,
                advanced: 2,
                premium: 3,
            };

            const currentUserLevel = subscriptionLevels[currentUser.subscription];
            const projectOwnerLevel = subscriptionLevels[project.user.subscription];

            // Allow access if user's level is equal or higher
            if (currentUserLevel >= projectOwnerLevel) {
                return res.status(200).json(project);
            } else {
                return res.status(403).json({ error: 'Access denied: insufficient subscription level' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch project' });
        }
    },

    async getUserTemplates(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;
        try {
            const projects = await Project.find({ where: { user: { id: userId }, isTemplate: true } });
            return res.status(200).json(projects);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch user templates' });
        }
    },

    // async getOne(req: Request, res: Response): Promise<Response> {
    //     const { id } = req.params;
    //     const userId = req.user.id;

    //     try {
    //         const project = await Project.findOne({ where: { id }, relations: ['user'] });
    //         if (!project) {
    //             return res.status(404).json({ message: 'Project not found' });
    //         }

    //         if (project.user.id !== userId) return res.status(403).json({ error: 'Access denied' });

    //         return res.status(200).json(project);
    //     } catch (error) {
    //         return res.status(500).json({ message: 'Failed to fetch project' });
    //     }
    // },

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updates = req.body;

        try {
            const project = await Project.findOne({ where: { id } });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            Object.assign(project, updates);
            await project.save();

            return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update project' });
        }
    },

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const project = await Project.findOne({ where: { id } });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            await project.remove();
            return res.status(200).json({ message: 'Project deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete project' });
        }
    },

    async makeTemplate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const project = await Project.findOne({ where: { id } });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            project.isTemplate = true;
            await project.save();

            return res.status(200).json({ message: 'Project marked as template', project });
        } catch (error) {
            console.error('Make template error:', error);
            return res.status(500).json({ message: 'Failed to mark project as template' });
        }
    },

    async getUserProjects(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;

        try {
            console.log(userId);
            const user = await User.findOne({
                where: { id: userId },
                relations: ['projects']
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user.projects);
        } catch (error) {
            console.error('Get user projects error:', error);
            return res.status(500).json({ message: 'Failed to fetch user projects' });
        }
    },

    async getMcoksterProjects(req: Request, res: Response): Promise<Response> {
        try {
            const mcokster = await User.findOne({
                where: { login: 'mcokster' },
                relations: ['projects']
            });
            

            if (!mcokster) {
                return res.status(404).json({ message: 'Mcokster user not found' });
            }

            return res.status(200).json(mcokster.projects);
        } catch (error) {
            console.error('Get mcokster projects error:', error);
            return res.status(500).json({ message: 'Failed to fetch mcokster projects' });
        }
    },
};
