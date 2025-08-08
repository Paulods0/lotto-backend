"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePos = deletePos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const audit_log_1 = require("../../utils/audit-log");
const keys_1 = require("../../utils/redis/keys");
const delete_cache_1 = require("../../utils/redis/delete-cache");
async function deletePos(id, user) {
    await prisma_1.default.$transaction(async (tx) => {
        const pos = await tx.pos.findUnique({ where: { id } });
        if (!pos)
            throw new errors_1.NotFoundError(`O POS não foi encontrado.`);
        // Se o POS estiver associado a um agente, limpa os campos do agente
        if (pos.agent_id) {
            await tx.agent.update({
                where: { id: pos.agent_id },
                data: {
                    type_id: null,
                    subtype_id: null,
                    zone_id: null,
                    area_id: null,
                    province_id: null,
                    city_id: null,
                },
            });
        }
        await tx.pos.delete({ where: { id } });
        if (pos.licence_id) {
            const remainingPosCount = await tx.pos.count({
                where: { licence_id: pos.licence_id },
            });
            const status = remainingPosCount === 0 ? 'livre' : 'em_uso';
            await tx.licence.update({
                where: { id: pos.licence_id },
                data: { status },
            });
        }
        await (0, audit_log_1.audit)(tx, 'delete', {
            entity: 'pos',
            user,
            after: null,
            before: pos,
        });
    });
    // Limpa os caches
    await Promise.all([
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.licences.all()),
        (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
    ]);
}
