import { z } from 'zod';

export const selectTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1, 'Please select at least one task'),
});
