import { Request, Response } from 'express';
import { sendResponse } from '../utils/apiResponse';
import { HealthCheckData } from '../types';
import config from '../config';

export const getHealthStatus = (_req: Request, res: Response): void => {
  const healthData: HealthCheckData = {
    status: 'UP',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0',
  };

  sendResponse(res, 200, 'Server is healthy and running', healthData);
};
