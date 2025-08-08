"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLicence = deleteLicence;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function deleteLicence(id, user) {
    await prisma_1.default.$transaction(async (tx) => {
        const licence = await tx.licence.findUnique({
            where: { id },
        });
        if (!licence)
            throw new errors_1.NotFoundError('Licença não encontrada');
        await tx.licence.delete({ where: { id } });
        await (0, audit_log_1.audit)(tx, 'delete', {
            user,
            entity: 'licence',
            before: licence,
            after: null,
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
    return id;
}
