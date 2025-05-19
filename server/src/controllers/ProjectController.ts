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
            const project = await Project.findOne({ where: { id }, relations: ['user'] });
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.user.id !== userId) return res.status(403).json({ error: 'Access denied' });

            return res.status(200).json(project);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch project' });
        }
    },

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
};
