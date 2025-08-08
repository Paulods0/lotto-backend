"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLog = createAuditLog;
async function createAuditLog(tx, data) {
    return await tx.auditLog.create({
        data: {
            user_name: data.user_name,
            user_email: data.user_email,
            action: data.action,
            entity: data.entity,
            changes: data.changes,
        },
    });
}
