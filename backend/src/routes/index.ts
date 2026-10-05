import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import requestRoutes from './request.routes';
import userRoutes from './user.routes';

const rootRouter = Router();

// Register module routes
rootRouter.use('/health', healthRoutes);
rootRouter.use('/auth', authRoutes);
rootRouter.use('/requests', requestRoutes);
rootRouter.use('/users', userRoutes);

export default rootRouter;
