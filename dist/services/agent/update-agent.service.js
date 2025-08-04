"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentService = updateAgentService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
const diff_objects_1 = require("../../utils/diff-objects");
async function updateAgentService({ user, ...data }) {
    const agent = await prisma_1.default.agent.findUnique({ where: { id: data.id } });
    if (!agent)
        throw new errors_1.NotFoundError('Agente não encontrado');
    await prisma_1.default.$transaction(async (tx) => {
        // Atualiza dados básicos do agente
        const updated = await tx.agent.update({
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
            },
        });
        // Atualiza o terminal se fornecido
        if (data.terminal_id) {
            // Remove terminal anterior vinculado a este agente
            await tx.terminal.updateMany({
                where: { agent_id: agent.id },
                data: {
                    agent_id: null,
                    id_reference: null,
                    status: false,
                },
            });
            const terminal = await tx.terminal.findUnique({
                where: { id: data.terminal_id },
                select: { agent_id: true },
            });
            if (terminal?.agent_id && terminal.agent_id !== agent.id) {
                await tx.terminal.update({
                    where: { id: data.terminal_id },
                    data: { agent_id: null, id_reference: null, status: false },
                });
            }
            await tx.terminal.update({
                where: { id: data.terminal_id },
                data: {
                    agent_id: agent.id,
                    id_reference: agent.id_reference,
                    status: true,
                },
            });
        }
        // Atualiza o POS se fornecido
        if (data.pos_id) {
            // Remove POS anterior vinculado a este agente
            await tx.pos.updateMany({
                where: { agent_id: agent.id },
                data: {
                    agent_id: null,
                    id_reference: null,
                },
            });
            const existingPos = await tx.pos.findUnique({
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
            if (!existingPos)
                throw new errors_1.NotFoundError('POS não encontrado');
            if (existingPos.agent_id && existingPos.agent_id !== agent.id) {
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
            // Atualiza os relacionamentos do agente com base no POS
            await tx.agent.update({
                where: { id: agent.id },
                data: {
                    ...(0, connect_disconnect_1.connectOrDisconnect)('area', existingPos.area_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('zone', existingPos.zone_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('province', existingPos.province_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('city', existingPos.city_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('type', existingPos.type_id),
                    ...(0, connect_disconnect_1.connectOrDisconnect)('subtype', existingPos.subtype_id),
                },
            });
        }
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'UPDATE',
            entity: 'AGENT',
            user_name: user.name,
            changes: (0, diff_objects_1.diffObjects)(data, updated),
            user_id: user.id,
            entity_id: agent.id,
        });
    });
    // Limpa cache relacionado
    await Promise.all([
        (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all()),
        (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
    return agent.id;
}
