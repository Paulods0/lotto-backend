"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCache = setCache;
exports.getCache = getCache;
exports.deleteCache = deleteCache;
const redis_1 = __importDefault(require("../lib/redis"));
/**
 * Seta um valor no Redis com expiração
 */
async function setCache(key, value, seconds = 60 * 5) {
    try {
        await redis_1.default.set(key, JSON.stringify(value), 'EX', seconds);
    }
    catch (error) {
        console.error(`Erro ao setar cache [${key}] no Redis:`, error);
    }
}
/**
 * Obter os dados do Redis
 */
async function getCache(key) {
    const value = await redis_1.default.get(key);
    if (!value)
        return null;
    try {
        return JSON.parse(value);
    }
    catch (error) {
        console.error(`Erro ao fazer parse do cache da chave "${key}":`, error);
        return null;
    }
}
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
