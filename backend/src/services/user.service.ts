import prisma from '../lib/prisma';
import { ApiError } from '../utils/apiError';
import { z } from 'zod';
import * as schemas from '../validators/user.validator';

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      businessName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return {
    id: user.id,
    userId: user.id,
    name: user.name || '',
    mobileNumber: user.phone || '',
    email: user.email,
    address: user.address || '',
    businessName: user.businessName || undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const updateProfile = async (
  userId: string,
  data: z.infer<typeof schemas.updateProfileSchema>
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.mobileNumber,
      address: data.address,
      businessName: data.businessName || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      businessName: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    id: updatedUser.id,
    userId: updatedUser.id,
    name: updatedUser.name || '',
    mobileNumber: updatedUser.phone || '',
    email: updatedUser.email,
    address: updatedUser.address || '',
    businessName: updatedUser.businessName || undefined,
    createdAt: updatedUser.createdAt.toISOString(),
    updatedAt: updatedUser.updatedAt.toISOString(),
  };
};
