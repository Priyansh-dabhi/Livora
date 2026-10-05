import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as schemas from '../validators/task.validator';
import * as taskController from '../controllers/task.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Public catalogue endpoints
router.get('/', asyncHandler(taskController.getTasks));
router.get('/categories', asyncHandler(taskController.getCategories));

// Authenticated user task selection endpoints
router.post('/select', requireAuth, validate(schemas.selectTasksSchema), asyncHandler(taskController.saveUserTaskSelections));
router.get('/selected', requireAuth, asyncHandler(taskController.getUserTaskSelections));

export default router;
