"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTerminal = deleteTerminal;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function deleteTerminal(id, user) {
    await prisma_1.default.$transaction(async (tx) => {
        const existingTerminal = await tx.terminal.findUnique({ where: { id } });
        if (!existingTerminal)
            throw new errors_1.NotFoundError('Terminal não encontrado.');
        await tx.terminal.delete({ where: { id } });
        await (0, audit_log_1.audit)(tx, 'delete', {
            entity: 'terminal',
            user,
            before: null,
            after: existingTerminal,
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
    ]);
}
