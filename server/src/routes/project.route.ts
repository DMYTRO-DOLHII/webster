import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';

const router = Router();

router.post('/', ProjectController.create.bind(ProjectController));
router.get('/', ProjectController.getAll.bind(ProjectController));
router.get('/:id', ProjectController.getOne.bind(ProjectController));
router.patch('/:id', ProjectController.update.bind(ProjectController));
router.delete('/:id', ProjectController.delete.bind(ProjectController));

export default router;
