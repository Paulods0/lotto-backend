import z from 'zod';

export const actionsSchema = z.enum(['READ', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT', 'IMPORT']);

export type TAction = z.infer<typeof actionsSchema>;
