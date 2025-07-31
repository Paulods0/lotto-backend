import z from 'zod';
import { currentUser } from '../agent-schemas/create-agent-schema';

export const createTerminalSchema = z.object({
  id_reference: z.number().int().optional(),
  serial: z.string(),
  sim_card: z.coerce.number().int(),
  pin: z.coerce.number().int().optional(),
  puk: z.coerce.number().int().optional(),
  agent_id: z.uuid().optional(),
  user: currentUser,
});

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>;
