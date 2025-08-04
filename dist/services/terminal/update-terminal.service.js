"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerminalService = updateTerminalService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
const diff_objects_1 = require("../../utils/diff-objects");
async function updateTerminalService({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        const terminal = await tx.terminal.findUnique({
            where: { id: data.id },
        });
        if (!terminal)
            throw new errors_1.NotFoundError('Terminal não encontrado');
        let id_reference = null;
        let area_id = null;
        let city_id = null;
        let province_id = null;
        let zone_id = null;
        let status = false;
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
            if (!agent)
                throw new errors_1.NotFoundError('Agente não encontrado');
            id_reference = agent.id_reference;
            area_id = agent.area_id;
            city_id = agent.city_id;
            province_id = agent.province_id;
            zone_id = agent.zone_id;
            status = true;
            await tx.terminal.updateMany({
                where: { agent_id: agent.id },
                data: {
                    agent_id: null,
                    id_reference: null,
                    area_id: null,
                    city_id: null,
                    province_id: null,
                    zone_id: null,
                    status: false,
                },
            });
        }
        const { id, created_at, ...updated } = await tx.terminal.update({
            where: { id: data.id },
            data: {
                status,
                id_reference,
                pin: data.pin,
                puk: data.puk,
                serial: data.serial,
                sim_card: data.sim_card,
                ...(0, connect_disconnect_1.connectOrDisconnect)('area', area_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('city', city_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('zone', zone_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('province', province_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('agent', data.agent_id ?? null),
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'UPDATE',
            entity: 'TERMINAL',
            user_name: user.name,
            entity_id: data.id,
            user_id: user.id,
            changes: (0, diff_objects_1.diffObjects)(data, updated),
        });
        return updated;
    });
    await (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all()), await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all());
    if (data.agent_id) {
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all());
    }
}
