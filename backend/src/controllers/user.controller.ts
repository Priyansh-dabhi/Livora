import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { sendResponse } from '../utils/apiResponse';

export const getProfile = async (req: Request, res: Response) => {
  const profile = await userService.getProfile(req.user!.id);
  sendResponse(res, 200, 'Profile retrieved successfully', profile);
};

export const updateProfile = async (req: Request, res: Response) => {
  const profile = await userService.updateProfile(req.user!.id, req.body);
  sendResponse(res, 200, 'Profile updated successfully', profile);
};
