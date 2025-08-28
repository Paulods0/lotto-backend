import { ActionType } from '@prisma/client';
import z from 'zod';
import { createGroupSchema } from './create.schema';

export const updateGroupSchema = createGroupSchema.partial().extend({
  id: z.coerce.number().int(),
});

export type UpdateGroupDTO = z.infer<typeof updateGroupSchema>;
