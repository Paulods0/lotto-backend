import z from 'zod';
import { terminalSchema } from '../../terminal/@types/terminal.t';

export const agentType = z.enum(['lotaria_nacional', 'revendedor']);
export const agentStatus = z.enum(['ativo', 'negado', 'agendado', 'apto']);
export const genre = z.enum(['masculino', 'feminino']);

export const agentSchema = z.object({
  id: z.uuid(),
  id_reference: z.number().int(),
  first_name: z.string(),
  last_name: z.string(),
  genre: genre,
  bi_number: z.string(),
  phone_number: z.number().int(),
  afrimoney_number: z.number().int(),
  agent_type: agentType,
  status: agentStatus,
  training_date: z.date(),
  created_at: z.date(),
  terminal: terminalSchema,

  // TODO: implement pos-schema
  //   pos: posSchema,
});

export type Agent = z.infer<typeof agentSchema>;
export type AgentType = z.infer<typeof agentType>;
export type AgentStatus = z.infer<typeof agentStatus>;
export type Genre = z.infer<typeof genre>;
