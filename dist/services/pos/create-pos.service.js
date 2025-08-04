"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosService = createPosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function createPosService({ user, ...data }) {
    const result = await prisma_1.default.$transaction(async (tx) => {
        let id_reference = null;
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({
                where: { id: data.agent_id },
            });
            if (!agent)
                throw new Error('Agente não encontrado');
            id_reference = agent.id_reference ?? null;
            if (id_reference) {
                const existingPos = await tx.pos.findFirst({
                    where: { id_reference },
                });
                if (existingPos) {
                    await tx.pos.update({
                        where: { id: existingPos.id },
                        data: { id_reference: null },
                    });
                }
            }
        }
        const pos = await tx.pos.create({
            data: {
                id_reference,
                latitude: data.latitude,
                longitude: data.longitude,
                ...(0, connect_disconnect_1.connectIfDefined)('area', data.area_id),
                ...(0, connect_disconnect_1.connectIfDefined)('type', data.type_id),
                ...(0, connect_disconnect_1.connectIfDefined)('subtype', data.subtype_id),
                ...(0, connect_disconnect_1.connectIfDefined)('zone', data.zone_id),
                ...(0, connect_disconnect_1.connectIfDefined)('city', data.city_id),
                ...(0, connect_disconnect_1.connectIfDefined)('admin', data.admin_id),
                ...(0, connect_disconnect_1.connectIfDefined)('agent', data.agent_id),
                ...(0, connect_disconnect_1.connectIfDefined)('licence', data.licence_id),
                ...(0, connect_disconnect_1.connectIfDefined)('province', data.province_id),
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'CREATE',
            entity: 'POS',
            user_name: user.name,
            metadata: pos,
            user_id: user.id,
            entity_id: pos.id,
        });
        return pos.id;
    });
    await Promise.all([await (0, redis_1.deleteCache)(keys_1.RedisKeys.pos.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
    if (data.admin_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.admins.all());
    if (data.agent_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all());
    if (data.licence_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all());
    return result;
}
