import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Project } from '../models/Project';

interface DecodedToken {
    id: number;
    email: string;
    isAdmin: boolean
}

declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken | User;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as DecodedToken;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            isAdmin: decoded.isAdmin
        };

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Middleware or controller function
const checkProjectLimit = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const user = await User.findOne({ where: { id: userId } });

        // Get user's current projects count
        const projectCount = await Project.count({ where: { user: { id: userId } } });

        // Check against limits
        const limits = {
            'basic': 3,
            'advanced': 10,
            'premium': Infinity
        };

        const userLimit = limits[user.subscription || 'basic'];

        if (projectCount >= userLimit) {
            return res.status(403).json({
                error: 'Project limit reached',
                message: 'You have reached the maximum number of projects for your subscription tier.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(403).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY!) as DecodedToken;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            isAdmin: decoded.isAdmin
        };
        if (!isAdmin) res.status(403).json({ message: 'Only admin user can do it' });
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
