"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgent = updateAgent;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const audit_log_1 = require("../../utils/audit-log");
async function updateAgent({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        const agent = await tx.agent.findUnique({ where: { id: data.id } });
        if (!agent)
            throw new errors_1.NotFoundError('Agente não encontrado');
        let extraRelations = {};
        // Terminal reassociation
        if (data.terminal_id !== undefined) {
            await tx.terminal.updateMany({
                where: { agent_id: agent.id },
                data: { agent_id: null, id_reference: null },
            });
            if (data.terminal_id !== null) {
                const terminal = await tx.terminal.findUnique({
                    where: { id: data.terminal_id },
                });
                if (!terminal)
                    throw new errors_1.NotFoundError('Terminal não encontrado');
                if (terminal.agent_id && terminal.agent_id !== agent.id) {
                    await tx.terminal.update({
                        where: { id: data.terminal_id },
                        data: { agent_id: null, id_reference: null },
                    });
                }
                await tx.terminal.update({
                    where: { id: data.terminal_id },
                    data: {
                        agent_id: agent.id,
                        id_reference: agent.id_reference,
                    },
                });
            }
        }
        // POS reassociation
        if (data.pos_id !== undefined) {
            await tx.pos.updateMany({
                where: { agent_id: agent.id },
                data: { agent_id: null, id_reference: null },
            });
            if (data.pos_id !== null) {
                const pos = await tx.pos.findUnique({
                    where: { id: data.pos_id },
                    select: {
                        agent_id: true,
                        area_id: true,
                        zone_id: true,
                        city_id: true,
                        province_id: true,
                        type_id: true,
                        subtype_id: true,
                    },
                });
                if (!pos)
                    throw new errors_1.NotFoundError('POS não encontrado');
                if (pos.agent_id && pos.agent_id !== agent.id) {
                    await tx.pos.update({
                        where: { id: data.pos_id },
                        data: { agent_id: null, id_reference: null },
                    });
                }
                await tx.pos.update({
                    where: { id: data.pos_id },
                    data: {
                        agent_id: agent.id,
                        id_reference: agent.id_reference,
                    },
                });
                extraRelations = {
                    ...(0, connect_disconnect_1.connectOrDisconnect)('area', pos.area_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('zone', pos.zone_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('province', pos.province_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('city', pos.city_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('type', pos.type_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('subtype', pos.subtype_id),
                };
            }
        }
        // Atualiza agente com todos os dados de uma vez
        const updatedAgent = await tx.agent.update({
            where: { id: data.id },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                agent_type: data.type,
                genre: data.genre,
                bi_number: data.bi_number,
                phone_number: data.phone_number,
                afrimoney_number: data.afrimoney_number,
                status: data.status,
                training_date: data.training_date,
                ...extraRelations,
            },
        });
        await (0, audit_log_1.audit)(tx, 'update', {
            user,
            before: agent,
            after: updatedAgent,
            entity: 'agent',
        });
    });
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
}
