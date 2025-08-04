import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const createTerminalSchema = z.object({
  id_reference: z.number().int().optional(),
  serial: z.string({ error: 'O nº de série é obrigatório' }),
  sim_card: z.coerce
    .number({ error: 'O cartão sim é obrigatório' })
    .int({ error: 'O cartão sim deve ser um número inteiro' }),
  pin: z.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
  puk: z.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
  agent_id: z.uuid().optional(),
  user: currentUserSchema,
});

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>;
export type TerminalEntity = z.infer<typeof createTerminalSchema> & { id: string; created_At: Date };
