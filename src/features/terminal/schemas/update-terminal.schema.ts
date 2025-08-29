import z from 'zod';
import { createTerminalSchema } from './create-terminal.schema';
import { currentUserSchema } from '../../../@types/user';

export const updateTerminalSchema = createTerminalSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
});

export type UpdateTerminalDTO = z.infer<typeof updateTerminalSchema>;
