"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const get_cache_1 = require("../../utils/redis/get-cache");
const keys_1 = require("../../utils/redis/keys");
const set_cache_1 = require("../../utils/redis/set-cache");
async function getUser(id) {
    const cacheKey = keys_1.RedisKeys.users.byId(id);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
    if (!existingUser)
        throw new errors_1.NotFoundError('Usuário não encontrado.');
    await (0, set_cache_1.setCache)(cacheKey, existingUser);
    return existingUser;
}
