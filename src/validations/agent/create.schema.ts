import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const agentType = z.enum(['lotaria_nacional', 'revendedor'], { error: 'O tipo é obrigatório' });
export type AgentType = z.infer<typeof agentType>;

export const agentStatus = z.enum(['ativo', 'negado', 'agendado', 'apto']);
export type AgentStatus = z.infer<typeof agentStatus>;

export const genre = z.enum(['masculino', 'feminino'], { error: 'O gênero é obrigatório' });
export type Genre = z.infer<typeof genre>;

export const createAgentSchema = z.object({
  genre: genre,
  type: agentType,
  first_name: z.string({ error: 'O nome é obrigatório' }),
  last_name: z.string({ error: 'O sobrenome é obrigatório' }),
  training_date: z.coerce.date({ error: 'A data de formação é obrigatória' }),

  pos_id: z.uuid().optional(),
  status: agentStatus.optional(),
  terminal_id: z.uuid().optional(),
  bi_number: z.string().optional(),
  id_reference: z.number().optional(),
  phone_number: z.coerce.number().optional(),
  afrimoney_number: z.coerce.number().optional(),

  user: currentUserSchema,
});

export type CreateAgentDTO = z.infer<typeof createAgentSchema>;
