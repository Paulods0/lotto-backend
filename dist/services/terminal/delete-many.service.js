"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManyTerminal = deleteManyTerminal;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const errors_1 = require("../../errors");
const delete_cache_1 = require("../../utils/redis/delete-cache");
const keys_1 = require("../../utils/redis/keys");
async function deleteManyTerminal(ids) {
    const deleted = await prisma_1.default.terminal.deleteMany({
        where: { id: { in: ids } },
    });
    if (deleted.count === 0) {
        throw new errors_1.NotFoundError('Nenhum terminal encontrado para remover.');
    }
    await (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.terminals.all());
    await (0, delete_cache_1.deleteCache)(keys_1.RedisKeys.agents.all());
    return deleted.count;
}
