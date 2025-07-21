import z from "zod";

export const agentType = z.enum(["lotaria_nacional", "revendedor"])
export type AgentType = z.infer<typeof agentType>

export const agentStatus = z.enum(["ativo", "inativo", "pendente"])
export type AgentStatus = z.infer<typeof agentStatus>

export const genre = z.enum(["masculino", "feminino"])
export type Genre = z.infer<typeof genre>

export const createAgentSchema = z.object({
    id_reference: z.number().optional(),

    first_name: z.string(),
    last_name: z.string(),
    genre: genre,
    type: agentType,
    phone_number: z.number().optional(),
    afrimoney_number: z.number().optional(),
    bi_number: z.string().optional(),
    status: agentStatus.optional(),

    pos_id: z.uuid().optional(),
    terminal_id: z.uuid().optional()
})

export type CreateAgentDTO = z.infer<typeof createAgentSchema>