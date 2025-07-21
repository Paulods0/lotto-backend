import z from "zod";

export const createPosSchema = z.object({
    id_reference: z.number().int().optional(),

    latitude: z.coerce.number(),
    longitude: z.coerce.number(),

    licence_id: z.uuid().optional(),
    agent_id: z.uuid().optional(),
})

export type CreatePosDTO = z.infer<typeof createPosSchema>