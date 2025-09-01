import z from 'zod';
import { currentUserSchema } from '../../../@types/user';

export const createTerminalSchema = z.object({
  id_reference: z.number().int().optional(),
  device_id: z.string().optional(),
  serial: z.string({ error: 'O nº de série é obrigatório' }).toUpperCase().min(1, 'O nº de série é obrigatório'),
  note: z.string().optional(),

  agent_id: z.uuid().optional(),
  sim_card_id: z.uuid().optional(),

  arrived_at: z.coerce.date().optional(),
  user: currentUserSchema,
});

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>;
