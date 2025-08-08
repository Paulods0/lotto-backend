import z from 'zod';
import { currentUserSchema } from '../../@types/user';
import { createTerminalSchema } from './create.schema';

export const updateTerminalSchema = createTerminalSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
});

export type UpdateTerminalDTO = z.infer<typeof updateTerminalSchema>;
