"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLicenceService = updateLicenceService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const diff_objects_1 = require("../../utils/diff-objects");
const build_licemce_reference_1 = require("../../utils/build-licemce-reference");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function updateLicenceService({ user, ...data }) {
    const [licence, admin] = await Promise.all([
        prisma_1.default.licence.findUnique({
            where: { id: data.id },
            include: { admin: true },
        }),
        data.admin_id ? prisma_1.default.administration.findUnique({ where: { id: data.admin_id } }) : Promise.resolve(undefined),
    ]);
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada');
    const number = data.number ?? licence.number;
    const year = data.creation_date?.getFullYear() ?? licence.created_at.getFullYear();
    const name = admin?.name ?? licence.admin?.name;
    const reference = (0, build_licemce_reference_1.buildReference)({ name, number, year, desc: data.description });
    await prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.licence.update({
            where: { id: data.id },
            data: {
                reference,
                number: data.number,
                description: data.description,
                creation_date: data.creation_date,
                ...(data.file && { file: data.file }),
                ...(0, connect_disconnect_1.connectOrDisconnect)('admin', data.admin_id),
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'UPDATE',
            entity: 'LICENCE',
            user_name: user.name,
            changes: (0, diff_objects_1.diffObjects)(data, updated),
            user_id: user.id,
            entity_id: licence.id,
        });
    });
    await Promise.all([await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
}
