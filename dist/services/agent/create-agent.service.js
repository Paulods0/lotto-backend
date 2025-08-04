"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentService = createAgentService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function createAgentService({ user, ...data }) {
    const createdAgent = await prisma_1.default.$transaction(async (tx) => {
        const idReference = await tx.idReference.update({
            where: { type: data.type },
            data: {
                counter: { increment: 1 },
            },
        });
        const agent = await tx.agent.create({
            data: {
                id_reference: idReference.counter,
                first_name: data.first_name,
                last_name: data.last_name,
                agent_type: data.type,
                genre: data.genre,
                phone_number: data.phone_number,
                afrimoney_number: data.afrimoney_number,
                status: data.status,
                bi_number: data.bi_number,
            },
        });
        if (data.terminal_id) {
            await tx.terminal.update({
                where: { id: data.terminal_id },
                data: {
                    agent_id: null,
                    id_reference: null,
                    status: false,
                },
            });
            await tx.terminal.update({
                where: { id: data.terminal_id },
                data: {
                    agent_id: agent.id,
                    id_reference: agent.id_reference,
                    status: true,
                },
            });
        }
        if (data.pos_id) {
            await tx.pos.update({
                where: { id: data.pos_id },
                data: {
                    agent_id: null,
                    id_reference: null,
                },
            });
            const pos = await tx.pos.update({
                where: { id: data.pos_id },
                data: {
                    agent_id: agent.id,
                    id_reference: agent.id_reference,
                },
                select: {
                    area_id: true,
                    zone_id: true,
                    city_id: true,
                    type_id: true,
                    subtype_id: true,
                    province_id: true,
                },
            });
            await tx.agent.update({
                where: { id: agent.id },
                data: {
                    ...(0, connect_disconnect_1.connectIfDefined)('area', pos.area_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('zone', pos.zone_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('province', pos.province_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('city', pos.city_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('type', pos.type_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('subtype', pos.subtype_id),
                },
            });
        }
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'CREATE',
            entity: 'AGENT',
            user_name: user.name,
            metadata: data,
            user_id: user.id,
            entity_id: agent.id,
        });
        return agent;
    });
    await Promise.all([
        (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
    return createdAgent.id;
}
