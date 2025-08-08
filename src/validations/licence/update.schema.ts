import z from 'zod';
import { currentUserSchema } from '../../@types/user';
import { createLicenceSchema } from './create.schema';

export const updateLicenceSchema = createLicenceSchema.partial().extend({
  id: z.uuid(),
  user: currentUserSchema,
});

export type UpdateLicenceDTO = z.infer<typeof updateLicenceSchema>;
