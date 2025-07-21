import z from "zod";

export const editPosSchema = z.object({
    id: z.uuid(),

    id_reference: z.number().int().optional(),

    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),

    licence_id: z.uuid().optional(),
    agent_id: z.uuid().optional(),
})

export type EditPosDTO = z.infer<typeof editPosSchema>