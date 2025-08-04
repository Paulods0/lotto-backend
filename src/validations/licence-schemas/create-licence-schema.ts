import z from 'zod';

export const createLicenceSchema = z.object({
  number: z.string({ error: 'O número da licença é obrigatório' }),
  description: z.string({ error: 'A descrição da licença é obrigatória' }),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  file: z.string().optional(),
  creation_date: z.coerce.date().optional(),
  admin_id: z.coerce.number().optional(),
});

export type CreateLicenceDTO = z.infer<typeof createLicenceSchema>;
