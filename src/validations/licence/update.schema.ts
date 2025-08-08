import z from 'zod';
import { currentUserSchema } from '../../@types/user';
import { createLicenceSchema } from './create.schema';

export const updateLicenceSchema = createLicenceSchema.partial().extend({
  id: z.uuid(),
  admin_id: z.number().optional(),
  user: currentUserSchema,
});

export type UpdateLicenceDTO = z.infer<typeof updateLicenceSchema>;
