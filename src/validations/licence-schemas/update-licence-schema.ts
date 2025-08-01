import z from 'zod';
import { currentUser } from '../agent-schemas/create-agent-schema';

export const editLicenceSchema = z.object({
  id: z.uuid(),
  number: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  file: z.string().optional().nullable(),
  creation_date: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
  user: currentUser,
});

export type EditLicenceDTO = z.infer<typeof editLicenceSchema>;
