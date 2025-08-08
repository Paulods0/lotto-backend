"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLicence = createLicence;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function createLicence(input) {
    const { user, ...data } = input;
    await prisma_1.default.$transaction(async (tx) => {
        const admin = await prisma_1.default.administration.findUnique({
            where: { id: data.admin_id },
            select: { name: true },
        });
        if (!admin)
            throw new errors_1.NotFoundError('A administração não foi encontrada');
        const { id, created_at, ...created } = await tx.licence.create({
            data: {
                file: data.file,
                limit: data.limit,
                number: data.number,
                reference: data.reference,
                description: data.description,
                expires_at: data.expires_at,
                creation_date: data.creation_date,
                ...(0, connect_disconnect_1.connectIfDefined)('admin', data.admin_id),
            },
        });
        await (0, audit_log_1.audit)(tx, 'create', {
            user,
            entity: 'licence',
            before: null,
            after: created,
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
}
