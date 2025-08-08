"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPos = getPos;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const get_cache_1 = require("../../utils/redis/get-cache");
const keys_1 = require("../../utils/redis/keys");
const set_cache_1 = require("../../utils/redis/set-cache");
async function getPos(id) {
    const cacheKey = keys_1.RedisKeys.pos.byId(id);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const pos = await prisma_1.default.pos.findUnique({ where: { id } });
    if (!pos)
        throw new errors_1.NotFoundError('Pos não encontrado.');
    await (0, set_cache_1.setCache)(cacheKey, pos);
    return pos;
}
