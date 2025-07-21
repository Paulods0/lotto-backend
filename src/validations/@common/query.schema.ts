import z from "zod";

export const paramsSchema = z.object({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
    query: z.string().optional(),
})

// export type PaginationParams = z.infer<typeof paramsSchema>