import z from 'zod';
import { createAgentSchema } from './create-agent.schema';
import { currentUserSchema } from '../../../@types/user';

export const updateAgentSchema = createAgentSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
});

export type UpdateAgentDTO = z.infer<typeof updateAgentSchema>;
