import z from 'zod';
import { agentStatus } from '../agent-schemas/create-agent-schema';

export const paramsSchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(30),
  query: z
    .string()
    .optional()
    .transform(val => val?.trim() || undefined),
  type_id: z.coerce.number().optional(),
  city_id: z.coerce.number().optional(),
  area_id: z.coerce.number().optional(),
  zone_id: z.coerce.number().optional(),
  status: agentStatus.optional(),
  province_id: z.coerce.number().optional(),
});

export type PaginationParams = z.infer<typeof paramsSchema>;
