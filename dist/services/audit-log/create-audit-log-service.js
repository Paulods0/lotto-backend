"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLogService = createAuditLogService;
async function createAuditLogService(tx, data) {
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
