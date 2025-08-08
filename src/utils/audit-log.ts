import { Prisma } from '@prisma/client';
import { AuthPayload } from '../@types/auth-payload';
import { AuditActionType, AuditEntityType } from '../validations/audit-log/create.schema';
import { createAuditLog } from '../services/audit-log/create.service';

type AuditOptions<T> = {
  entity: AuditEntityType;
  user: AuthPayload;
  before?: T | null;
  after?: T | null;
};

export async function audit<T>(tx: Prisma.TransactionClient, action: AuditActionType, options: AuditOptions<T>) {
  await createAuditLog(tx, {
    action,
    entity: options.entity,
    user_name: options.user.name,
    user_email: options.user.email,
    changes: {
      before: options.before ?? null,
      after: options.after ?? null,
    },
  });
}
