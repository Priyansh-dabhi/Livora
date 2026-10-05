import prisma from '../lib/prisma';
import { ApiError } from '../utils/apiError';

export const getCategories = async () => {
  const categories = await prisma.category.findMany({
    include: {
      tasks: {
        orderBy: { name: 'asc' },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return categories;
};

export const getTasks = async (categoryId?: string) => {
  const where = categoryId ? { categoryId } : {};
  const tasks = await prisma.task.findMany({
    where,
    include: {
      category: {
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return tasks;
};

export const saveUserTaskSelections = async (userId: string, taskIds: string[]) => {
  // Validate that all task IDs exist
  const existingTasks = await prisma.task.findMany({
    where: { id: { in: taskIds } },
  });

  if (existingTasks.length === 0) {
    throw new ApiError(400, 'None of the provided task IDs were found');
  }

  // Clear previous selections for this user to save current selection snapshot
  await prisma.userTaskSelection.deleteMany({
    where: { userId },
  });

  // Create new selections
  await prisma.userTaskSelection.createMany({
    data: existingTasks.map((t) => ({
      userId,
      taskId: t.id,
    })),
  });

  return getUserTaskSelections(userId);
};

export const getUserTaskSelections = async (userId: string) => {
  const selections = await prisma.userTaskSelection.findMany({
    where: { userId },
    include: {
      task: {
        include: {
          category: {
            select: {
              id: true,
              slug: true,
              name: true,
              icon: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return selections.map((s) => ({
    id: s.id,
    taskId: s.taskId,
    taskName: s.task.name,
    taskDescription: s.task.description,
    categoryId: s.task.categoryId,
    categoryName: s.task.category.name,
    categoryIcon: s.task.category.icon,
    selectedAt: s.createdAt.toISOString(),
  }));
};
