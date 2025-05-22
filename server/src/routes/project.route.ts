import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/Auth';

const router = Router();

router.post('/', authMiddleware, ProjectController.create.bind(ProjectController));
router.get('/', ProjectController.getAll.bind(ProjectController));
router.get('/:id', authMiddleware, ProjectController.getOne.bind(ProjectController));
router.patch('/:id', ProjectController.update.bind(ProjectController));
router.patch('/:id/make-template', ProjectController.makeTemplate.bind(ProjectController));
router.delete('/:id', ProjectController.delete.bind(ProjectController));

export default router;
