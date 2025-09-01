import z from 'zod';

export const membershipSchema = z.object({
  user_id: z.string(),
  group_id: z.string(),
});
export type Membership = z.infer<typeof membershipSchema>;
