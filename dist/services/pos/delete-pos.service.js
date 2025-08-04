"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePosService = deletePosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
const create_audit_log_service_1 = require("../audit-log/create-audit-log-service");
async function deletePosService(id, user) {
    // Verifica se o POS existe
    const pos = await prisma_1.default.pos.findUnique({ where: { id } });
    if (!pos) {
        throw new errors_1.NotFoundError(`POS com o ID ${id} não foi encontrado.`);
    }
    // Se o POS estiver associado a um agente, desassocia e limpa os campos do agente
    if (pos.agent_id) {
        await prisma_1.default.agent.update({
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
    // Deleta o POS
    await prisma_1.default.$transaction(async (tx) => {
        const deletedPos = await tx.pos.delete({ where: { id } });
        await (0, create_audit_log_service_1.createAuditLogService)(tx, {
            action: 'DELETE',
            entity: 'POS',
            user_name: user.name,
            metadata: deletedPos,
            user_id: user.id,
            entity_id: id,
        });
    });
    // Limpa os caches
    await Promise.all([
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.pos.all()),
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.admins.all()),
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.auditLogs.all()),
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all()),
        await (0, redis_1.deleteCache)(keys_1.RedisKeys.licences.all()),
    ]);
}
