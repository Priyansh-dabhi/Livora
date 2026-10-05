import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as schemas from '../validators/user.validator';
import * as userController from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', validate(schemas.updateProfileSchema), asyncHandler(userController.updateProfile));

export default router;
