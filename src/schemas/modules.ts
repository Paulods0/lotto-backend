import z from 'zod';

export const moduleSchema = z.enum(['AGENT', 'TERMINAL', 'POS', 'LICENCE', 'LICENCE', 'USER', 'SIM_CARD']);

export type TModule = z.infer<typeof moduleSchema>;
