"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyTerminalService = deleteManyTerminalService;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const redis_1 = require("../../utils/redis");
const keys_1 = require("../../utils/cache-keys/keys");
async function deleteManyTerminalService(ids) {
    const deleted = await prisma_1.default.terminal.deleteMany({
        where: { id: { in: ids } },
    });
    if (deleted.count === 0) {
        throw new errors_1.NotFoundError('Nenhum terminal encontrado para remover.');
    }
    await (0, redis_1.deleteCache)(keys_1.RedisKeys.terminals.all());
    await (0, redis_1.deleteCache)(keys_1.RedisKeys.agents.all());
    return deleted.count;
}
