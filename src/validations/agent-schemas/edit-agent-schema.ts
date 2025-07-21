import z from "zod";
import { agentStatus, agentType, genre } from "./create-agent-schema";

export const editAgentSchema = z.object({
    id: z.uuid(),
    id_reference: z.number().optional(),

    first_name: z.string().optional(),
    last_name: z.string().optional(),
    genre: genre.optional(),
    type: agentType.optional(),
    phone_number: z.number().optional(),
    afrimoney_number: z.number().optional(),
    bi_number: z.string().optional(),
    status: agentStatus.optional(),

    pos_id: z.uuid().optional(),
    terminal_id: z.uuid().optional()
})

export type EditAgentDTO = z.infer<typeof editAgentSchema>