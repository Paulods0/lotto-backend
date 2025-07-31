import z from 'zod';
import { currentUser } from '../agent-schemas/create-agent-schema';

export const createPosSchema = z.object({
  id_reference: z.number().int().optional(),

  latitude: z.coerce.number(),
  longitude: z.coerce.number(),

  licence_id: z.uuid().optional(),
  agent_id: z.uuid().optional(),

  type_id: z.coerce.number().optional(),
  subtype_id: z.coerce.number().optional(),
  province_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  area_id: z.coerce.number().optional(),
  admin_id: z.coerce.number().optional(),
  zone_id: z.coerce.number().optional(),
  user: currentUser,
});

export type CreatePosDTO = z.infer<typeof createPosSchema>;
