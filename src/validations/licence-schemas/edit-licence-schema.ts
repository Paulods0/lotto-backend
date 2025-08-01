import z from 'zod';

export const editLicenceSchema = z.object({
  id: z.uuid(),
  number: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  file: z.string().optional().nullable(),
  creation_date: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
});

export type EditLicenceDTO = z.infer<typeof editLicenceSchema>;
