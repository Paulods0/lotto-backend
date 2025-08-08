"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePos = updatePos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const connect_disconnect_1 = require("../../utils/connect-disconnect");
async function updatePos({ user, ...data }) {
    await prisma_1.default.$transaction(async (tx) => {
        const pos = await tx.pos.findUnique({ where: { id: data.id } });
        if (!pos)
            throw new errors_1.NotFoundError('POS não encontrado.');
        // Gerencia relacionamento com o agente
        let id_reference = null;
        let agentUpdate = { disconnect: true };
        if (data.agent_id) {
            const agent = await tx.agent.findUnique({ where: { id: data.agent_id } });
            if (!agent)
                throw new errors_1.NotFoundError('Agente não encontrado.');
            id_reference = agent.id_reference ?? null;
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
            await tx.agent.update({
                where: { id: data.agent_id },
                data: {
                    area_id: data.area_id,
                    zone_id: data.zone_id,
                    city_id: data.city_id,
                    province_id: data.province_id,
                },
            });
        }
        // Atualiza o POS
        const after = await tx.pos.update({
            where: { id: data.id },
            data: {
                id_reference,
                agent: agentUpdate,
                coordinates: data.coordinates,
                ...(0, connect_disconnect_1.connectOrDisconnect)('type', data.type_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('subtype', data.subtype_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('province', data.province_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('area', data.area_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('zone', data.zone_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('city', data.city_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('admin', data.admin_id),
                ...(0, connect_disconnect_1.connectOrDisconnect)('licence', data.licence_id),
            },
        });
        const licenceWasRemoved = !data.licence_id && pos.licence_id;
        const licenceChanged = pos.licence_id !== data.licence_id;
        // Caso a licença anterior tenha sido removida
        if ((licenceChanged || licenceWasRemoved) && pos.licence_id) {
            const oldLicence = await tx.licence.findUnique({
                where: { id: pos.licence_id },
            });
            if (!oldLicence)
                throw new errors_1.NotFoundError('Licença anterior não encontrada.');
            const remainingPos = await tx.pos.count({
                where: { licence_id: pos.licence_id, NOT: { id: data.id } },
            });
            const newStatus = remainingPos >= (oldLicence.limit ?? Infinity) ? 'em_uso' : 'livre';
            await tx.licence.update({
                where: { id: pos.licence_id },
                data: { status: newStatus },
            });
        }
        // Caso esteja conectando uma nova licença
        if (data.licence_id) {
            const newLicence = await tx.licence.findUnique({
                where: { id: data.licence_id },
            });
            if (!newLicence)
                throw new errors_1.NotFoundError('Nova licença não encontrada.');
            const totalPos = await tx.pos.count({
                where: {
                    licence_id: data.licence_id,
                    NOT: { id: data.id },
                },
            });
            const limit = newLicence.limit ?? Infinity;
            if (licenceChanged && totalPos >= limit) {
                throw new errors_1.BadRequestError('Esta licença já atingiu o número máximo de POS permitidos.');
            }
            const newStatus = totalPos + 1 >= limit ? 'em_uso' : 'livre';
            await tx.licence.update({
                where: { id: data.licence_id },
                data: {
                    coordinates: data.coordinates,
                    status: newStatus,
                },
            });
        }
        // Registra no log de auditoria
        await (0, audit_log_1.audit)(tx, 'update', {
            user,
            entity: 'pos',
            before: pos,
            after,
        });
    });
    // Limpa os caches afetados
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
        data.admin_id && (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        data.agent_id && (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        data.licence_id && (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()),
    ]);
}
async function validateAndUpdateLicence(tx, posId, licenceId, coordinates) {
    const licence = await tx.licence.findUnique({ where: { id: licenceId } });
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada.');
    const totalPos = await tx.pos.count({
        where: { licence_id: licenceId, NOT: { id: posId } },
    });
    const limit = licence.limit ?? Infinity;
    const limitReached = totalPos + 1 >= limit;
    const newStatus = limitReached ? 'em_uso' : 'livre';
    await tx.licence.update({
        where: { id: licenceId },
        data: {
            coordinates,
            status: newStatus,
        },
    });
    if (totalPos >= limit) {
        throw new Error('Esta licença já atingiu o número máximo de POS permitidos.');
    }
}
