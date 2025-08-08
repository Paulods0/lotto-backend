"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const envSchema = zod_1.default.object({
    JWT_ACCESS_TOKEN_SECRET: zod_1.default.string(),
    JWT_REFRESH_TOKEN_SECRET: zod_1.default.string(),
    JWT_EXPIRES_IN: zod_1.default.string(),
    PORT: zod_1.default.number().default(3333),
    DATABASE_URL: zod_1.default.string(),
    REDIS_URL: zod_1.default.string().default('redis://localhost:6379'),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.log('Enviroment variables error: ', parsed.error);
    throw new Error('Enviroment variable is required: ', parsed.error);
}
const env = parsed.data;
exports.default = env;
