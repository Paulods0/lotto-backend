import z from 'zod';

export const agentType = z.enum(['lotaria_nacional', 'revendedor'], { error: 'O tipo é obrigatório' });
export type AgentType = z.infer<typeof agentType>;

export const agentStatus = z.enum(['ativo', 'inativo', 'agendado']);
export type AgentStatus = z.infer<typeof agentStatus>;

export const genre = z.enum(['masculino', 'feminino'], { error: 'O gênero é obrigatório' });
export type Genre = z.infer<typeof genre>;

export const createAgentSchema = z.object({
  id_reference: z.number().optional(),
  first_name: z.string({ error: 'O nome é obrigatório' }),
  last_name: z.string({ error: 'O sobrenome é obrigatório' }),
  genre: genre,
  type: agentType,
  phone_number: z.coerce.number().optional(),
  afrimoney_number: z.coerce.number().optional(),
  bi_number: z.string().optional(),
  status: agentStatus.optional(),

  pos_id: z.uuid().optional(),
  terminal_id: z.uuid().optional(),
});

export type CreateAgentDTO = z.infer<typeof createAgentSchema>;
