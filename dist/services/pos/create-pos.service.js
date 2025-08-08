"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPos = createPos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const errors_1 = require("../../errors");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function createPos({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        let id_reference = null;
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
            if (!agent)
                throw new errors_1.NotFoundError('Agente não encontrado');
            id_reference = agent.id_reference ?? null;
            if (id_reference) {
                const existingPos = await tx.pos.findFirst({ where: { id_reference } });
                if (existingPos) {
                    await tx.pos.update({
                        where: { id: existingPos.id },
                        data: { id_reference: null },
                    });
                }
            }
        }
        if (data.licence_id) {
            const licence = await tx.licence.findUnique({
                where: { id: data.licence_id },
                include: { pos: { select: { id: true } } },
            });
            if (!licence)
                throw new errors_1.NotFoundError('Licença não encontrada');
            const posCount = licence.pos.length;
            const limit = licence.limit;
            if (posCount >= limit) {
                throw new errors_1.BadRequestError('Esta licença já está a ser usada');
            }
            // Marcar licença como 'em_uso' se atingir ou ultrapassar o limite de POS permitidos
            const limitReached = posCount + 1 >= limit;
            await tx.licence.update({
                where: { id: licence.id },
                data: {
                    coordinates: data.coordinates,
                    status: limitReached ? 'em_uso' : 'livre',
                },
            });
        }
        const { id, created_at, ...pos } = await tx.pos.create({
            data: {
                id_reference,
                coordinates: data.coordinates,
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
        await (0, audit_log_1.audit)(tx, 'create', {
            entity: 'pos',
            user,
            after: pos,
            before: null,
        });
    });
    const promises = [(0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()), (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all())];
    if (data.admin_id)
        promises.push((0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()));
    if (data.agent_id)
        promises.push((0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()));
    if (data.licence_id)
        promises.push((0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()));
    await Promise.all(promises);
}
