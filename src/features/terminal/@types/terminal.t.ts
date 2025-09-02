import z from 'zod';
import { simCardSchema } from '../../sim-card/@types/sim-card.t';

export const terminalStatusSchema = z.enum(['active', 'training', 'stock', 'broken', 'maintenance']);

export const terminalSchema = z.object({
  id: z.uuid(),
  id_reference: z.number().optional(),
  device_id: z.string(),
  serial: z.string(),
  note: z.string().optional(),
  sim_card: simCardSchema.optional(),
  status: terminalStatusSchema,
  created_at: z.date(),
  arrived_at: z.date().optional(),
  leaved_at: z.date().optional(),
});

export type Terminal = z.infer<typeof terminalSchema>;
export type TerminalStatus = z.infer<typeof terminalStatusSchema>;
