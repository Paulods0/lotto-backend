"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCache = deleteCache;
const redis_1 = __importDefault(require("../../lib/redis"));
/**
 * Deleta todas as chaves no Redis que casam com o padrão fornecido
 */
async function deleteCache(pattern) {
    try {
        let cursor = '0';
        do {
            const [nextCursor, keys] = await redis_1.default.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            cursor = nextCursor;
            if (keys.length > 0) {
                await redis_1.default.del(...keys);
            }
        } while (cursor !== '0');
    }
    catch (error) {
        console.error(`Erro ao fazer scan e deletar chaves com padrão [${pattern}]:`, error);
    }
}
