"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosService = getPosService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function getPosService(id) {
    const cacheKey = keys_1.RedisKeys.pos.byId(id);
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const pos = await prisma_1.default.pos.findUnique({ where: { id } });
    if (!pos)
        throw new errors_1.NotFoundError('Pos não encontrado.');
    await (0, redis_1.setCache)(cacheKey, pos);
    return pos;
}
