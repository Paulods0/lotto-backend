"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLicenceService = deleteLicenceService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function deleteLicenceService(id, user) {
    const licence = await prisma_1.default.licence.findUnique({
        where: { id },
        select: { id: true },
    });
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada');
    await prisma_1.default.$transaction(async (tx) => {
        await tx.licence.delete({ where: { id } });
        const { id: licenceID, ...data } = licence;
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'DELETE',
            entity: 'LICENCE',
            user_name: user.name,
            metadata: data,
            user_id: user.id,
            entity_id: id,
        });
    });
    await Promise.all([await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
    return id;
}
