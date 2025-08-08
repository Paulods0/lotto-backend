"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("../constants/env"));
// 172.17.198.67
// host: "172.17.198.67",
// password: "msftsrep0."
const redis = new ioredis_1.default(env_1.default.REDIS_URL);
redis.on('ready', async () => {
    console.log('✅ Conectado ao Redis com sucesso!');
});
redis.on('error', err => {
    console.error('❌ Erro ao conectar ao Redis:', err);
});
exports.default = redis;
