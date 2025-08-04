"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = exports.userRoleEnum = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userRoleEnum = zod_1.default.enum(['dev', 'super_admin', 'area_manager', 'supervisor'], {
    error: 'A role é obrigatória',
});
exports.createUserSchema = zod_1.default.object({
    first_name: zod_1.default.string('O nome é obrigatório.').min(2, 'O nome deve ter no mínimo 2 caractéres.'),
    last_name: zod_1.default.string('O sobrenome é obrigatório.').min(2, 'O sobrenome deve conter no mínimo 2 caractéres.'),
    email: zod_1.default
        .email('O email é obrigatório.')
        .refine(val => val.includes('@lotarianacional.co.ao'), { error: 'O email deve pertencer à Lotaria Nacional' })
        .min(2, 'O email é obrigatório.'),
    password: zod_1.default
        .string('O palavra-passe é obrigatória.')
        .min(6, 'A palavra-passe deve ter no mínimo 6 dígitos/caractéres'),
    role: exports.userRoleEnum,
    reset_password_token: zod_1.default.string().optional(),
});
