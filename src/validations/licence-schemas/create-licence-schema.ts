import z from 'zod';
import { currentUser } from '../agent-schemas/create-agent-schema';

export const createLicenceSchema = z.object({
  number: z.string(),
  description: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  file: z.string().optional(),
  creation_date: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
});

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>;
