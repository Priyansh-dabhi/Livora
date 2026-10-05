import { Request, Response } from 'express';
import * as requestService from '../services/request.service';
import { sendResponse } from '../utils/apiResponse';

export const createRequest = async (req: Request, res: Response) => {
  // req.user is guaranteed to exist because of requireAuth middleware
  const result = await requestService.createRequest(req.user!.id, req.body);
  sendResponse(res, 201, result.message, result.request);
};

export const getUserRequests = async (req: Request, res: Response) => {
  const result = await requestService.getUserRequests(req.user!.id);
  sendResponse(res, 200, result.message, result.requests);
};
