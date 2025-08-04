"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const create_user_schema_1 = require("./create-user-schema");
exports.editUserSchema = zod_1.default.object({
    id: zod_1.default.uuid().min(1, 'O id é obrigatório.'),
    first_name: zod_1.default.string('O nome é obrigatório.').min(2, 'O nome deve ter no mínimo 2 caractéres.').optional(),
    last_name: zod_1.default
        .string('O sobrenome é obrigatório.')
        .min(2, 'O sobrenome deve conter no mínimo 2 caractéres.')
        .optional(),
    email: zod_1.default
        .email('O email é obrigatório.')
        .refine(val => val.includes('@lotarianacional.co.ao'), { error: 'O email deve pertencer à Lotaria Nacional' })
        .optional(),
    password: zod_1.default
        .string('O palavra-passe é obrigatória.')
        .min(6, 'A palavra-passe deve ter no mínimo 6 dígitos/caractéres')
        .optional(),
    role: create_user_schema_1.userRoleEnum.optional(),
    reset_password_token: zod_1.default.string().optional(),
});
