"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentService = getAgentService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function getAgentService(id) {
    const cacheKey = keys_1.RedisKeys.agents.byId(id);
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const agent = await prisma_1.default.agent.findUnique({
        where: { id },
    });
    if (!agent)
        throw new errors_1.NotFoundError('Agente não encontrado.');
    await (0, redis_1.setCache)(cacheKey, agent);
    return agent;
}
