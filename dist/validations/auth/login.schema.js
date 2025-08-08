"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.loginSchema = zod_1.default.object({
    email: zod_1.default
        .email('O email é obrigatório.')
        .refine(val => val.includes('@lotarianacional.co.ao'), { error: 'O email deve pertencer à Lotaria Nacional' })
        .min(2, 'O email é obrigatório.'),
    password: zod_1.default
        .string('O palavra-passe é obrigatória.')
        .min(6, 'A palavra-passe deve ter no mínimo 6 dígitos/caractéres'),
});
