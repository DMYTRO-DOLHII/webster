import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { User } from '../models/User';

const router = Router();

router.get('/', UserController.getAll.bind(UserController));
router.get('/:id', UserController.getOne.bind(UserController));
router.get('/:id/projects', UserController.getUserProjects.bind(UserController));
router.get('/:id/templates', UserController.getUserTemplates.bind(UserController));
router.patch('/:id', UserController.update.bind(UserController)); 

export default router;
