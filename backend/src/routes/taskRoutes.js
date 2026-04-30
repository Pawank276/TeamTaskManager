import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import allowRoles from '../middleware/roleMiddleware.js';
import { listTasks, createTask, updateTaskStatus } from '../controllers/taskController.js';

const router = Router();

router.use(protect);

router.get('/', listTasks);
router.post('/', allowRoles('Admin'), createTask);
router.patch('/:id/status', updateTaskStatus);

export default router;
