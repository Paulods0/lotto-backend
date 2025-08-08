"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgent = getAgent;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function getAgent(id) {
    const cacheKey = keys_1.RedisKeys.agents.byId(id);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const agent = await prisma_1.default.agent.findUnique({
        where: { id },
    });
    if (!agent)
        throw new errors_1.NotFoundError('Agente não encontrado.');
    await (0, set_cache_1.setCache)(cacheKey, agent);
    return agent;
}
