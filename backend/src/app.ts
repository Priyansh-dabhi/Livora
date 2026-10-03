import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from './config';
import routes from './routes';
import { requestLogger } from './middlewares/logger.middleware';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

// Initialize express app
const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 requests per window per IP
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use(`${config.apiPrefix}/auth`, authLimiter);


// Root route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Livora API',
    status: 'online',
    version: '1.0.0',
    documentation: `${config.apiPrefix}/docs (coming soon)`,
    health: `${config.apiPrefix}/health`,
  });
});

// API Routes
app.use(config.apiPrefix, routes);

// 404 Route handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
