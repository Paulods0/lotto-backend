"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePosService = updatePosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const diff_objects_1 = require("../../utils/diff-objects");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function updatePosService({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        const pos = await tx.pos.findUnique({ where: { id: data.id } });
        if (!pos)
            throw new errors_1.NotFoundError('Pos não encontrado.');
        let id_reference = null;
        let agentUpdate = undefined;
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
            id_reference = agent?.id_reference ?? null;
            agentUpdate = { connect: { id: data.agent_id } };
            if (id_reference !== null) {
                const existingPos = await tx.pos.findFirst({
                    where: {
                        id_reference,
                        NOT: { id: data.id },
                    },
                });
                if (existingPos) {
                    await tx.pos.update({
                        where: { id: existingPos.id },
                        data: { id_reference: null },
                    });
                }
            }
            // Atualiza os dados geográficos do agent
            await tx.agent.update({
                where: { id: data.agent_id },
                data: {
                    area_id: data.area_id,
                    zone_id: data.zone_id,
                    province_id: data.province_id,
                    city_id: data.city_id,
                },
            });
        }
        else {
            agentUpdate = { disconnect: true };
        }
        const updatedPos = await tx.pos.update({
            where: { id: data.id },
            data: {
                id_reference,
                latitude: data.latitude,
                longitude: data.longitude,
                agent: agentUpdate,
                ...(0, connect_disconnect_1.connectOrDisconnect)('licence', data.licence_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('type', data.type_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('subtype', data.subtype_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('area', data.area_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('zone', data.zone_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('city', data.city_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('admin', data.admin_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('province', data.province_id),
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'UPDATE',
            entity: 'POS',
            user_name: user.name,
            changes: (0, diff_objects_1.diffObjects)(data, updatedPos),
            user_id: user.id,
            entity_id: data.id,
        });
    });
    await Promise.all([await (0, redis_1.deleteCache)(keys_1.RedisKeys.pos.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())]);
    if (data.admin_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.admins.all());
    if (data.agent_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all());
    if (data.licence_id)
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all());
}
