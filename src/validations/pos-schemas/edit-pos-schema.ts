import z from 'zod';

export const editPosSchema = z.object({
  id: z.uuid(),

  id_reference: z.number().int().optional(),

  agent_id: z.uuid().optional(),
  licence_id: z.uuid().optional(),

  type_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  area_id: z.coerce.number().optional(),
  zone_id: z.coerce.number().optional(),
  admin_id: z.coerce.number().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  subtype_id: z.coerce.number().optional(),
  province_id: z.coerce.number().optional(),
});

export type EditPosDTO = z.infer<typeof editPosSchema>;
