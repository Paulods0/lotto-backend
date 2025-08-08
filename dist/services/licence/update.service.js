"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLicence = updateLicence;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function updateLicence({ user, ...data }) {
    const [licence, admin] = await Promise.all([
        prisma_1.default.licence.findUnique({
            where: { id: data.id },
            include: { admin: true },
        }),
        data.admin_id ? prisma_1.default.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
    ]);
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada');
    if (data.admin_id && !admin)
        throw new errors_1.NotFoundError('Administração não encontrada');
    const posCount = await prisma_1.default.pos.count({
        where: { licence_id: data.id },
    });
    const newStatus = data.limit && posCount < data.limit ? 'livre' : 'em_uso';
    await prisma_1.default.$transaction(async (tx) => {
        const after = await tx.licence.update({
            where: { id: data.id },
            data: {
                file: data.file,
                limit: data.limit,
                status: newStatus,
                number: data.number,
                reference: data.reference,
                expires_at: data.expires_at,
                description: data.description,
                coordinates: data.coordinates,
                creation_date: data.creation_date,
                ...(0, connect_disconnect_1.connectOrDisconnect)('admin', data.admin_id),
            },
            include: {
                admin: true,
            },
        });
        await (0, audit_log_1.audit)(tx, 'update', {
            user,
            entity: 'licence',
            before: licence,
            after,
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
}
