import z from 'zod';
import { createLicenceSchema } from './create-licence.schema';

export const updateLicenceSchema = createLicenceSchema.partial().extend({
  id: z.uuid(),
  admin_id: z.coerce.number().optional(),
});

export type UpdateLicenceDTO = z.infer<typeof updateLicenceSchema>;
