import z from 'zod';
import { paramsSchema } from '../validations/@common/query.schema';

export type PaginationParams = z.infer<typeof paramsSchema>;
