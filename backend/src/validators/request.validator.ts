import { z } from 'zod';

export const createRequestSchema = z.object({
  categoryName: z.string().trim(),
  categoryIcon: z.string().trim(),
  activities: z.array(z.string()),
  timing: z.enum(['standard', 'same_day', 'express', 'scheduled']),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  notes: z.string().optional(),
});
