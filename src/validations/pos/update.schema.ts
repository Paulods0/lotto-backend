import { AuthPayload } from './../../@types/auth-payload';
import z from 'zod';
import { currentUserSchema } from '../../@types/user';
import { createPosSchema } from './create.schema';

export const updatePosSchema = createPosSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
  licence_id: z.uuid().nullable().optional(),
});

export type UpdatePosDTO = z.infer<typeof updatePosSchema>;
