"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicence = getLicence;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const keys_1 = require("../../utils/redis/keys");
const get_cache_1 = require("../../utils/redis/get-cache");
const set_cache_1 = require("../../utils/redis/set-cache");
async function getLicence(id) {
    const cacheKey = keys_1.RedisKeys.licences.byId(id);
    const cached = await (0, get_cache_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const licence = await prisma_1.default.licence.findUnique({
        where: { id },
    });
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada');
    await (0, set_cache_1.setCache)(cacheKey, licence);
    return licence;
}
