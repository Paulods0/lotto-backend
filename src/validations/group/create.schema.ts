import { ActionType } from '@prisma/client';
import z from 'zod';

export const createGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  users_id: z.array(z.string()),
  permissions: z.array(
    z.object({
      feature_id: z.number().int(),
      actions: z.array(z.enum(ActionType)),
    })
  ),
});

export type CreateGroupDTO = z.infer<typeof createGroupSchema>;
