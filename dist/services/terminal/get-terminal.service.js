"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTerminalService = getTerminalService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const keys_1 = require("../../utils/cache-keys/keys");
const redis_1 = require("../../utils/redis");
async function getTerminalService(id) {
    const cacheKey = keys_1.RedisKeys.terminals.byId(id);
    const cached = await (0, redis_1.getCache)(cacheKey);
    if (cached)
        return cached;
    const terminal = await prisma_1.default.terminal.findUnique({
        where: { id },
        select: {
            id: true,
            id_reference: true,
            pin: true,
            puk: true,
            serial: true,
            sim_card: true,
            status: true,
            agent: {
                select: {
                    id: true,
                    id_reference: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });
    if (!terminal)
        throw new errors_1.NotFoundError('Terminal não encontrado.');
    await (0, redis_1.setCache)(cacheKey, terminal);
    return terminal;
}
