import { Prisma } from '@prisma/client';
import { CreateAuditLogDTO } from '../../validations/audit-log/create.schema';

export async function createAuditLog(tx: Prisma.TransactionClient, data: CreateAuditLogDTO) {
  return await tx.auditLog.create({
    data: {
      user_id: data.user_id,
      user_name: data.user_name,
      entity_id: data.entity_id,
      action: data.action,
      entity: data.entity,
      changes: data.changes,
      metadata: data.metadata ?? {},
    },
  });
}
