"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminalService = createTerminalService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function createTerminalService({ user, ...data }) {
    return await prisma_1.default
        .$transaction(async (tx) => {
        let id_reference = null;
        let area_id = null;
        let city_id = null;
        let province_id = null;
        let zone_id = null;
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
            if (!agent)
                throw new errors_1.NotFoundError('Agente não encontrado');
            id_reference = agent.id_reference;
            area_id = agent.area_id ?? null;
            city_id = agent.city_id ?? null;
            province_id = agent.province_id ?? null;
            zone_id = agent.zone_id ?? null;
            await tx.terminal.updateMany({
                where: { agent_id: agent.id },
                data: {
                    agent_id: null,
                    id_reference: null,
                    status: false,
                    area_id: null,
                    city_id: null,
                    province_id: null,
                    zone_id: null,
                },
            });
        }
        const terminal = await tx.terminal.create({
            data: {
                id_reference,
                pin: data.pin,
                puk: data.puk,
                serial: data.serial,
                sim_card: data.sim_card,
                status: data.agent_id ? true : false,
                ...(0, connect_disconnect_1.connectIfDefined)('area', area_id),
                ...(0, connect_disconnect_1.connectIfDefined)('city', city_id),
                ...(0, connect_disconnect_1.connectIfDefined)('zone', zone_id),
                ...(0, connect_disconnect_1.connectIfDefined)('province', province_id),
                ...(0, connect_disconnect_1.connectIfDefined)('agent', data.agent_id ?? null),
            },
            select: {
                id: true,
                agent_id: true,
            },
        });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'CREATE',
            entity: 'TERMINAL',
            user_id: user.id,
            user_name: user.name,
            entity_id: terminal.id,
            metadata: data,
        });
        return terminal;
    })
        .then(async (terminal) => {
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all());
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all());
        if (terminal.agent_id) {
            await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all());
        }
        return terminal.id;
    });
}
