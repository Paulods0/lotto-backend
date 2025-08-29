import z from 'zod';
import { createPosSchema } from './create-pos.schema';
import { currentUserSchema } from '../../../@types/user';

export const updatePosSchema = createPosSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
  licence_id: z.uuid().nullable().optional(),
});

export type UpdatePosDTO = z.infer<typeof updatePosSchema>;
