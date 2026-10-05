import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { sendResponse } from '../utils/apiResponse';

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  sendResponse(res, 201, result.message, result);
};

export const verifyEmail = async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body);
  sendResponse(res, 200, result.message, result);
};

export const resendEmailOtp = async (req: Request, res: Response) => {
  const result = await authService.resendEmailOtp(req.body);
  sendResponse(res, 200, result.message);
};

export const requestLoginOtp = async (req: Request, res: Response) => {
  const result = await authService.requestLoginOtp(req.body);
  sendResponse(res, 200, result.message);
};

export const verifyLoginOtp = async (req: Request, res: Response) => {
  const result = await authService.verifyLoginOtp(req.body);
  sendResponse(res, 200, 'Login successful', result);
};
