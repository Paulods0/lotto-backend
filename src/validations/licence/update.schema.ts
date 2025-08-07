import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const updateLicenceSchema = z.object({
  id: z.uuid(),
  number: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  coordinates: z.string().optional(),
  file: z.string().optional().nullable(),
  admin_id: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  reference: z.string().toUpperCase().optional(),
  user: currentUserSchema,
  creation_date: z.coerce.date().optional(),
  expires_at: z.coerce.date().optional(),
});

export type UpdateLicenceDTO = z.infer<typeof updateLicenceSchema>;
