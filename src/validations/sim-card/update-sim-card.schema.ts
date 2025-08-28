import z from 'zod';
import { currentUserSchema } from '../../@types/user';
import { createSimCardSchema } from './create-sim-card.schema';

export const updateSimCardSchema = createSimCardSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
});

export type UpdateSimCardDTO = z.infer<typeof updateSimCardSchema>;
