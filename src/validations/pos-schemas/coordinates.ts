import z from "zod"

export const coordinatesSchema = z.object({
    neLng:z.number(),
    swLng:z.number(),
    neLat:z.number(),
    swLat:z.number(),
})

export type CoordinatesSchemaDTO = z.infer<typeof coordinatesSchema>