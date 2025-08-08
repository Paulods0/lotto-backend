"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCache = getCache;
const redis_1 = __importDefault(require("../../lib/redis"));
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
