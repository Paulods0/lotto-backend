"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLicenceService = createLicenceService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const build_licemce_reference_1 = require("../../utils/build-licemce-reference");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function createLicenceService({ user, ...data }) {
    let reference = '';
    if (data.admin_id) {
        const admin = await prisma_1.default.administration.findUnique({
            where: { id: data.admin_id },
            select: { name: true },
        });
        if (!admin)
            throw new errors_1.NotFoundError('A administração não foi encontrada');
        const name = admin.name;
        const number = data.number;
        const year = data.creation_date?.getFullYear() ?? new Date().getFullYear();
        reference = (0, build_licemce_reference_1.buildReference)({
            name,
            number,
            year,
            desc: data.description,
        });
    }
    await prisma_1.default.$transaction(async (tx) => {
        const { id, created_at, ...licence } = await tx.licence.create({
            data: {
                reference,
                file: data.file,
                number: data.number,
                description: data.description,
                creation_date: data.creation_date,
                ...(0, connect_disconnect_1.connectIfDefined)('admin', data.admin_id),
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'CREATE',
            entity: 'LICENCE',
            user_name: user.name,
            metadata: licence,
            user_id: user.id,
            entity_id: id,
        });
    });
    await Promise.all([await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
}
