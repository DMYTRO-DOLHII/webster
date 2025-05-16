import { Request, Response } from 'express';
import { User } from '../models/User';
import { Project } from '../models/Project';

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
};
