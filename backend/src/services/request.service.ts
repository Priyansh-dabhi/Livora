import { prisma } from '../lib/prisma';
import { z } from 'zod';
import * as schemas from '../validators/request.validator';

export const createRequest = async (userId: string, data: z.infer<typeof schemas.createRequestSchema>) => {
  // @ts-ignore - Ignore until prisma generate is run
  const request = await prisma.serviceRequest.create({
    data: {
      userId,
      categoryName: data.categoryName,
      categoryIcon: data.categoryIcon,
      activities: data.activities,
      timing: data.timing,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      notes: data.notes,
      status: 'pending',
      lifestyleManagerName: 'Alex', // Default assigned manager for now
    },
  });

  return { message: 'Request created successfully', request };
};

export const getUserRequests = async (userId: string) => {
  // @ts-ignore - Ignore until prisma generate is run
  const requests = await prisma.serviceRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return { message: 'Requests retrieved successfully', requests };
};
