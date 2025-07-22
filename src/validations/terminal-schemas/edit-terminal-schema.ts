import z from "zod";

export const editTerminalSchema = z.object({
    id: z.uuid(),
    id_reference: z.number().int().optional(),
    serial: z.string().optional(),
    sim_card: z.coerce.number().int().optional(),
    pin: z.coerce.number().int().optional(),
    puk: z.coerce.number().int().optional(),
    status: z.boolean().optional(),
    agent_id: z.uuid().optional(),
})

export type EditTerminalDTO = z.infer<typeof editTerminalSchema>