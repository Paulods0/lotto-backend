import z from 'zod';
import { currentUserSchema } from '../../@types/user';

export const updatePosSchema = z.object({
  id: z.uuid(),
  id_reference: z.number().int().optional(),
  agent_id: z.uuid().optional(),
  licence_id: z.uuid().nullable().optional(),
  type_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  area_id: z.coerce.number().optional(),
  zone_id: z.coerce.number().optional(),
  admin_id: z.coerce.number().optional(),
  coordinates: z.string().optional(),
  subtype_id: z.coerce.number().optional(),
  province_id: z.coerce.number().optional(),
  user: currentUserSchema,
});

export type UpdatePosDTO = z.infer<typeof updatePosSchema>;
