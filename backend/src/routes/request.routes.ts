import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import * as schemas from '../validators/request.validator';
import * as requestController from '../controllers/request.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth); // Protect all request routes

router.post('/', validate(schemas.createRequestSchema), asyncHandler(requestController.createRequest));
router.get('/', asyncHandler(requestController.getUserRequests));

export default router;
