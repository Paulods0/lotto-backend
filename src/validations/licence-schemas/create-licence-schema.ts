import z from "zod";

export const createLicenceSchema = z.object({
     number:z.string(),        
     description:z.string(),
     latitude:z.number().optional(),      
     longitude:z.number().optional(),     
     file:z.string().optional(),          
     creation_date:z.date().optional(),
     admin_id:z.string().optional()
})

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>