import z from 'zod';

const auditActionEnum = z.enum(['update', 'create', 'delete']);
const auditEntity = z.enum(['agent', 'terminal', 'pos', 'licence', 'user', 'sim_card']);

export type AuditActionType = z.infer<typeof auditActionEnum>;
export type AuditEntityType = z.infer<typeof auditEntity>;

const auditLogchanges = z.object({
  before: z.record(z.string(), z.any()).nullable().optional(),
  after: z.record(z.string(), z.any()).nullable().optional(),
});

export const createAuditLogSchema = z.object({
  entity: auditEntity,
  user_name: z.string(),
  user_email: z.email(),
  action: auditActionEnum,
  changes: auditLogchanges,
});

export type AuditLogChanges = z.infer<typeof auditLogchanges>;
export type CreateAuditLogDTO = z.infer<typeof createAuditLogSchema>;
