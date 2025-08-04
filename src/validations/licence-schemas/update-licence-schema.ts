import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const updateLicenceSchema = z.object({
  id: z.uuid(),
  number: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  file: z.string().optional().nullable(),
  creation_date: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
  user: currentUserSchema,
});

export type UpdateLicenceDTO = z.infer<typeof updateLicenceSchema>;
