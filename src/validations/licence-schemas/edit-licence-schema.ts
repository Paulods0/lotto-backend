import z from "zod";

export const editLicenceSchema = z.object({
     id:z.string(),        
     number:z.string().optional(),        
     description:z.string().optional(),
     latitude:z.number().optional(),      
     longitude:z.number().optional(),     
     file:z.string().optional(),          
     creation_date:z.date().optional(),
     admin_id:z.string().optional()
})

export type EditLicenceDTO = z.infer<typeof editLicenceSchema>