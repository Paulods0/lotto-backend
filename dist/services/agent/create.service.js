"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = createAgent;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function createAgent({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        // Atualiza referência
        const idReference = await tx.idReference.update({
            where: { type: data.type },
            data: { counter: { increment: 1 } },
        });
        // Cria o agente
        let agent = await tx.agent.create({
            data: {
                genre: data.genre,
                status: data.status,
                agent_type: data.type,
                bi_number: data.bi_number,
                last_name: data.last_name,
                first_name: data.first_name,
                phone_number: data.phone_number,
                id_reference: idReference.counter,
                training_date: data.training_date,
                afrimoney_number: data.afrimoney_number,
            },
        });
        // Se tiver terminal associado
        if (data.terminal_id) {
            await tx.terminal.update({
                where: { id: data.terminal_id },
                data: {
                    agent_id: agent.id,
                    id_reference: agent.id_reference,
                    status: 'em_campo',
                },
            });
        }
        // Se tiver POS associado
        if (data.pos_id) {
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
            agent = await tx.agent.update({
                where: { id: agent.id },
                data: {
                    ...(0, connect_disconnect_1.connectIfDefined)('area', pos.area_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('zone', pos.zone_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('city', pos.city_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('type', pos.type_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('subtype', pos.subtype_id),
                    ...(0, connect_disconnect_1.connectIfDefined)('province', pos.province_id),
                },
            });
        }
        // Auditoria
        await (0, audit_log_1.audit)(tx, 'create', {
            user,
            before: null,
            after: agent,
            entity: 'agent',
        });
    });
    // Limpa cache
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
}
