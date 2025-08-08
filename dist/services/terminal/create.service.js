"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminal = createTerminal;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function createTerminal({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
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
                    area_id: null,
                    city_id: null,
                    zone_id: null,
                    agent_id: null,
                    province_id: null,
                    id_reference: null,
                },
            });
        }
        const terminal = await tx.terminal.create({
            data: {
                id_reference,
                pin: data.pin,
                puk: data.puk,
                note: data.note,
                serial: data.serial,
                status: data.status,
                sim_card: data.sim_card,
                device_id: data.device_id,
                delivery_date: data.delivery_date,
                ...(0, connect_disconnect_1.connectIfDefined)('area', area_id),
                ...(0, connect_disconnect_1.connectIfDefined)('city', city_id),
                ...(0, connect_disconnect_1.connectIfDefined)('zone', zone_id),
                ...(0, connect_disconnect_1.connectIfDefined)('province', province_id),
                ...(0, connect_disconnect_1.connectIfDefined)('agent', data.agent_id ?? null),
            },
        });
        await (0, audit_log_1.audit)(tx, 'create', {
            entity: 'terminal',
            user,
            before: null,
            after: terminal,
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
    ]);
}
