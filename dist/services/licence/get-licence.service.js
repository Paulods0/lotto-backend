"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicenceService = getLicenceService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function getLicenceService(id) {
    const cacheKey = keys_1.RedisKeys.licences.byId(id);
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const licence = await prisma_1.default.licence.findUnique({
        where: { id },
    });
    if (!licence)
        throw new errors_1.NotFoundError('Licença não encontrada');
    await (0, redis_1.setCache)(cacheKey, licence);
    return licence;
}
