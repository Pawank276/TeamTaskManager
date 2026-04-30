import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import allowRoles from '../middleware/roleMiddleware.js';
import {
    listProjects,
    createProject,
    getProjectById,
    updateProjectMembers,
    getProjectTasks,
} from '../controllers/projectController.js';

const router = Router();

router.use(protect);

router.get('/', listProjects);
router.post('/', allowRoles('Admin'), createProject);
router.get('/:id', getProjectById);
router.get('/:id/tasks', getProjectTasks);
router.post('/:id/members', allowRoles('Admin'), updateProjectMembers);

export default router;
