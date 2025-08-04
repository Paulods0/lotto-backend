"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAuditLogsServices = fetchManyAuditLogsServices;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function fetchManyAuditLogsServices() {
    const cacheKey = keys_1.RedisKeys.auditLogs.all();
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const auditLogs = await prisma_1.default.auditLog.findMany({
        orderBy: { created_at: 'desc' },
    });
    if (auditLogs.length > 0) {
        await (0, redis_1.setCache)(cacheKey, auditLogs);
    }
    return auditLogs;
}
