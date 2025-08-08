"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLicenceSchema = exports.licenceStatus = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.licenceStatus = zod_1.default.enum(['livre', 'em_uso']);
exports.createLicenceSchema = zod_1.default.object({
    number: zod_1.default.string({ error: 'O número da licença é obrigatório' }),
    description: zod_1.default.string({ error: 'A descrição da licença é obrigatória' }),
    file: zod_1.default.string().optional(),
    coordinates: zod_1.default.string().optional(),
    reference: zod_1.default.string().toUpperCase().min(1, { error: 'A referência da licença é obrigatória' }),
    limit: zod_1.default.coerce.number().optional(),
    creation_date: zod_1.default.coerce.date().optional(),
    expires_at: zod_1.default.coerce.date().optional(),
    admin_id: zod_1.default.coerce.number({ error: 'A administração é obrigatória' }),
    user: user_1.currentUserSchema,
});
