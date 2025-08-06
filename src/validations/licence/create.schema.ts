import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const createLicenceSchema = z.object({
  number: z.string({ error: 'O número da licença é obrigatório' }),
  description: z.string({ error: 'A descrição da licença é obrigatória' }),
  coordinates: z.string().optional(),
  file: z.string().optional(),
  creation_date: z.coerce.date().optional(),
  expires_at: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  user: currentUserSchema,
});

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>;
