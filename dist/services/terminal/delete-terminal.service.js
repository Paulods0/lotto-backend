"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTerminalService = deleteTerminalService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function deleteTerminalService(id, user) {
    const existingTerminal = await prisma_1.default.terminal.findUnique({ where: { id } });
    if (!existingTerminal)
        throw new errors_1.NotFoundError('Terminal não encontrado.');
    const deletedTerminal = await prisma_1.default.$transaction(async (tx) => {
        const { id: idTerminal, created_at, ...terminalDeleted } = await tx.terminal.delete({ where: { id } });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'DELETE',
            entity: 'TERMINAL',
            user_id: user.id,
            user_name: user.name,
            entity_id: id,
            metadata: terminalDeleted, // Aqui passamos os dados deletados
        });
        return terminalDeleted;
    });
    await Promise.all([
        (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all()),
    ]);
    return deletedTerminal;
}
