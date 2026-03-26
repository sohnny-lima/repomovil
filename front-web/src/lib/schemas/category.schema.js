import { z } from 'zod';

export const categorySchema = z.object({
  name       : z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  imageUrl   : z.string().optional(),
  isActive   : z.boolean(),
});
