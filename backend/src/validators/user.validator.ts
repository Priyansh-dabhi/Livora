import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  mobileNumber: z.string().trim().min(10, 'Mobile number must be at least 10 digits'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters'),
  businessName: z.string().trim().optional().nullable(),
});
