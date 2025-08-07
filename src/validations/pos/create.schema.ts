import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const createPosSchema = z.object({
  agent_id: z.uuid().optional(),
  licence_id: z.uuid().optional(),
  type_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  area_id: z.coerce.number().optional(),
  zone_id: z.coerce.number().optional(),
  admin_id: z.coerce.number().optional(),
  subtype_id: z.coerce.number().optional(),
  province_id: z.coerce.number().optional(),
  id_reference: z.number().int().optional(),
  coordinates: z.string().min(1, 'As coordenadas são obrigatórias'),
  user: currentUserSchema,
});

export type CreatePosDTO = z.infer<typeof createPosSchema>;
