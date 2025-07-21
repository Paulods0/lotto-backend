import z from "zod";

export const idSchema = z.object({
    id: z.uuid()
})

// export type PaginationParams = z.infer<typeof paramsSchema>