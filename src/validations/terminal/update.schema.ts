import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const updateTerminalSchema = z.object({
  id: z.uuid(),
  id_reference: z.number().int().optional(),
  serial: z.string().optional(),
  sim_card: z.coerce.number().int({ error: 'O cartão sim deve ser um número inteiro' }).optional(),
  pin: z.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
  puk: z.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
  status: z.boolean().optional(),
  agent_id: z.uuid().optional(),
  user: currentUserSchema,
});

export type UpdateTerminalDTO = z.infer<typeof updateTerminalSchema>;
