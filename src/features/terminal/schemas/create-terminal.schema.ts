import z from 'zod';
import { currentUserSchema } from '../../../@types/user';

const terminalStatus = z.enum(['stock', 'avaria', 'em_campo', 'formacao', 'manutencao']);

export const terminalStatusArray = terminalStatus.options;
export type TerminalStatusEnum = z.infer<typeof terminalStatus>;

export const createTerminalSchema = z.object({
  id_reference: z.number().int().optional(),
  device_id: z.string().nullable().optional(),
  serial: z.string({ error: 'O nº de série é obrigatório' }).toUpperCase().min(1, 'O nº de série é obrigatório'),
  note: z.string().optional(),
  agent_id: z.uuid().optional(),
  arrived_at: z.coerce.date().optional(),
  status: terminalStatus.optional(),
  sim_card_id: z.uuid().optional(),
  user: currentUserSchema,
});

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>;
