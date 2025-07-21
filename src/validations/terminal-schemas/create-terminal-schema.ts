import z from "zod";

export const createTerminalSchema = z.object({
    id_reference: z.number().int().optional(),
    serial: z.string(),
    sim_card: z.number().int(),
    pin: z.number().int().optional(),
    puk: z.number().int().optional(),
    status: z.boolean(),
    agent_id: z.string().optional(),
})

export type CreateTerminalDTO = z.infer<typeof createTerminalSchema>