import z from 'zod';

export const updateTerminalSchema = z.object({
  id: z.uuid(),
  id_reference: z.number().int().optional(),
  serial: z.string().optional(),
  sim_card: z.coerce.number().int({ error: 'O cartão sim deve ser um número inteiro' }).optional(),
  pin: z.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
  puk: z.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
  status: z.boolean().optional(),
  agent_id: z.uuid().optional(),
});

export type UpdateTerminalDTO = z.infer<typeof updateTerminalSchema>;
