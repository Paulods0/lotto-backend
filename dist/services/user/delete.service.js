"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = deleteUser;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function deleteUser(id, user) {
    await prisma_1.default.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({ where: { id } });
        if (!existingUser)
            throw new errors_1.NotFoundError('Usuário não econtrado.');
        await tx.user.delete({
            where: { id },
        });
        const { id: userId, created_at, password, ...rest } = existingUser;
        await (0, audit_log_1.audit)(tx, 'delete', {
            entity: 'user',
            user,
            after: null,
            before: rest,
        });
    });
    await Promise.all([(0, delete_cache_1.deleteCache)(keys_1.RedisKeys.users.all()), (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
}
