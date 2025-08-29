import z from 'zod';
import { currentUserSchema } from '../../../@types/user';

export const licenceStatus = z.enum(['livre', 'em_uso']);
export type LicenceStatus = z.infer<typeof licenceStatus>;

export const createLicenceSchema = z.object({
  number: z.string({ error: 'O número da licença é obrigatório' }),
  description: z.string({ error: 'A descrição da licença é obrigatória' }),
  file: z.string().optional(),
  coordinates: z.string().optional(),
  reference: z.string().toUpperCase().min(1, { error: 'A referência da licença é obrigatória' }),
  limit: z.coerce.number().optional(),
  creation_date: z.coerce.date().optional(),
  expires_at: z.coerce.date().optional(),
  admin_id: z.coerce.number({ error: 'A administração é obrigatória' }),
  user: currentUserSchema,
});

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>;
