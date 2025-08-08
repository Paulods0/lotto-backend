import z from 'zod';
import { currentUserSchema } from '../../@types/user';

const terminalStatus = z.enum(['stock', 'avaria', 'em_campo', 'formacao']);
export type TerminalStatusEnum = z.infer<typeof terminalStatus>;

export const createTerminalSchema = z.object({
  id_reference: z.number().int().optional(),
  device_id: z.string({ error: 'O device id é obrigatório' }).min(1, 'O device id é obrigatório'),
  serial: z.string({ error: 'O nº de série é obrigatório' }).min(1, 'O nº de série é obrigatório'),
  sim_card: z.coerce
    .number({ error: 'O cartão sim é obrigatório' })
    .int({ error: 'O cartão sim deve ser um número inteiro' }),
  pin: z.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
  puk: z.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
  note: z.string().optional(),
  agent_id: z.uuid().optional(),
  delivery_date: z.coerce.date(),
  status: terminalStatus.optional(),
  user: currentUserSchema,
});

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>;
