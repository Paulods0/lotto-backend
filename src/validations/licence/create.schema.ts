import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const createLicenceSchema = z.object({
  number: z.string({ error: 'O número da licença é obrigatório' }),
  description: z.string({ error: 'A descrição da licença é obrigatória' }),
  coordinates: z.string().optional(),
  file: z.string().optional(),
  admin_id: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  reference: z.string().toUpperCase().min(1, 'A referência da licença é obrigatória'),
  user: currentUserSchema,
  expires_at: z.coerce.date().optional(),
  creation_date: z.coerce.date().optional(),
});

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>;
