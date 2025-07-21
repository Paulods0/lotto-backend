import z from "zod";

export const editTerminalSchema = z.object({
    id: z.uuid(),
    id_reference: z.number().int().optional(),
    serial: z.string().optional(),
    sim_card: z.number().int().optional(),
    pin: z.number().int().optional(),
    puk: z.number().int().optional(),
    status: z.boolean().optional(),
    agent_id: z.string().optional(),
})

export type EditTerminalDTO = z.infer<typeof editTerminalSchema>