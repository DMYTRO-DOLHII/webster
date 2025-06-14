import { Request, Response } from 'express';
import { SubscriptionType, User } from '../models/User';
import { Project } from '../models/Project';
import path from 'path';
import { Multer } from 'multer';
import fs from 'fs';

// Define the type for multer request
interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export const UserController = {
    async create(req: Request, res: Response): Promise<Response> {
        const { fullName, email, login, password, profilePicture, subscription } = req.body;

        try {
            const existing = await User.findOne({ where: [{ email }, { login }] });
            if (existing) {
                return res.status(400).json({ message: 'Email or login already in use' });
            }

            const user = User.create({
                fullName,
                email,
                login,
                password,
                profilePicture,
                subscription,
            });

            await user.save();
            return res.status(201).json(user);
        } catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({ message: 'Failed to create user' });
        }
    },

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find();
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch users' });
        }
    },

    async getOne(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch user' });
        }
    },

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const updates = req.body;

        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (updates.plan) {
                switch (updates.plan.toLowerCase()) {
                    case 'basic':
                        user.subscription = SubscriptionType.BASIC;
                        break;
                    case 'advanced':
                        user.subscription = SubscriptionType.ADVANCED;
                        break;
                    case 'premium':
                        user.subscription = SubscriptionType.PREMIUM;
                        break;
                    default:
                        return res.status(400).json({ message: 'Invalid subscription plan' });
                }
                delete updates.plan; // prevent reassignment via Object.assign
            }

            Object.assign(user, updates);
            await user.save();

            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to update user' });
        }
    },

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await user.remove();
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Failed to delete user' });
        }
    },

    async getUserProjects(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({
                where: { id },
                relations: ['projects'],
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user.projects);
        } catch (error) {
            return res.status(500).json({ message: 'Failed to fetch user projects' });
        }
    },

    async getUserTemplates(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const templates = await Project.find({
                where: {
                    user: { id },
                    isTemplate: true,
                },
                relations: ['user'],
            });

            return res.status(200).json(templates);
        } catch (error) {
            console.error('Fetch user templates error:', error);
            return res.status(500).json({ message: 'Failed to fetch user templates' });
        }
    },

    async uploadAvatar(req: MulterRequest, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Delete old profile picture if it exists
            if (user.profilePicture) {
                const oldImagePath = user.profilePicture.split('/uploads/')[1];
                if (oldImagePath) {
                    const fullPath = path.join(__dirname, '../../uploads', oldImagePath);
                    try {
                        fs.unlinkSync(fullPath);
                    } catch (err) {
                        console.error('Error deleting old profile picture:', err);
                        // Continue even if delete fails
                    }
                }
            }

            // Create the URL for the uploaded file
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;

            // Update user's profile picture URL
            user.profilePicture = avatarUrl;
            await user.save();

            return res.status(200).json({ 
                message: 'Avatar uploaded successfully',
                profilePicture: avatarUrl 
            });
        } catch (error) {
            console.error('Upload avatar error:', error);
            return res.status(500).json({ message: 'Failed to upload avatar' });
        }
    },
};
