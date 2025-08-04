"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserService = getUserService;
const redis_1 = __importDefault(require("../../lib/redis"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
async function getUserService(id) {
    const cacheKey = `users:${id}`;
    const existingUser = await prisma_1.default.user.findUnique({ where: { id } });
    const cached = await redis_1.default.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    if (!existingUser) {
        throw new errors_1.NotFoundError('Usuário não encontrado.');
    }
    const exptime = 60 * 5;
    await redis_1.default.set(cacheKey, JSON.stringify(existingUser), 'EX', exptime);
    return existingUser;
}
