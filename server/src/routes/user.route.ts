import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { User } from '../models/User';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, filename);
    },
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.post('/:id/avatar', upload.single('avatar'), UserController.uploadAvatar.bind(UserController));
router.get('/', UserController.getAll.bind(UserController));
router.post('/', UserController.create.bind(UserController));
router.get('/:id', UserController.getOne.bind(UserController));
router.get('/:id/projects', UserController.getUserProjects.bind(UserController));
router.get('/:id/templates', UserController.getUserTemplates.bind(UserController));
router.patch('/:id', UserController.update.bind(UserController)); 

export default router;
