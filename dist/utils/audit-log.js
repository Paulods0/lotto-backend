"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = audit;
const create_service_1 = require("../services/audit-log/create.service");
async function audit(tx, action, options) {
    await (0, create_service_1.createAuditLog)(tx, {
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
