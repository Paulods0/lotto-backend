import z from 'zod';

const auditEntity = z.enum(['AGENT', 'TERMINAL', 'POS', 'LICENCE', 'USER']);
const auditActionEnum = z.enum(['UPDATE', 'CREATE', 'DELETE', 'LOGIN', 'LOGOUT']);

const changeLog = z.object({
  before: z.record(z.string(), z.any()).nullable(),
  after: z.record(z.string(), z.any()).nullable(),
});

export const createAuditLogSchema = z.object({
  entity: auditEntity,
  entity_id: z.uuid().optional(),
  user_id: z.uuid().optional(),
  user_name: z.string(),
  action: auditActionEnum,
  metadata: z.json().optional(),
  changes: changeLog.optional(),
});

export type ChangeLog = z.infer<typeof changeLog>;
export type CreateAuditLogDTO = z.infer<typeof createAuditLogSchema>;
