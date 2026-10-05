import { Request, Response } from 'express';
import * as taskService from '../services/task.service';
import { sendResponse } from '../utils/apiResponse';

export const getCategories = async (req: Request, res: Response) => {
  const categories = await taskService.getCategories();
  sendResponse(res, 200, 'Categories retrieved successfully', categories);
};

export const getTasks = async (req: Request, res: Response) => {
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
  const tasks = await taskService.getTasks(categoryId);
  sendResponse(res, 200, 'Tasks retrieved successfully', tasks);
};

export const saveUserTaskSelections = async (req: Request, res: Response) => {
  const selections = await taskService.saveUserTaskSelections(req.user!.id, req.body.taskIds);
  sendResponse(res, 200, 'Task selections saved successfully', selections);
};

export const getUserTaskSelections = async (req: Request, res: Response) => {
  const selections = await taskService.getUserTaskSelections(req.user!.id);
  sendResponse(res, 200, 'Selected tasks retrieved successfully', selections);
};
