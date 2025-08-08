"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAuditLogs = fetchManyAuditLogs;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const get_cache_1 = require("../../utils/redis/get-cache");
const keys_1 = require("../../utils/redis/keys");
const set_cache_1 = require("../../utils/redis/set-cache");
async function fetchManyAuditLogs() {
    const cacheKey = keys_1.RedisKeys.auditLogs.all();
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const auditLogs = await prisma_1.default.auditLog.findMany({
        orderBy: { created_at: 'desc' },
    });
    if (auditLogs.length > 0) {
        await (0, set_cache_1.setCache)(cacheKey, auditLogs);
    }
    return auditLogs;
}
