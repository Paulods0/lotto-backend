"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminalSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
const terminalStatus = zod_1.default.enum(['stock', 'avaria', 'em_campo', 'formacao']);
exports.createTerminalSchema = zod_1.default.object({
    id_reference: zod_1.default.number().int().optional(),
    device_id: zod_1.default.string({ error: 'O device id é obrigatório' }).min(1, 'O device id é obrigatório'),
    serial: zod_1.default.string({ error: 'O nº de série é obrigatório' }).min(1, 'O nº de série é obrigatório'),
    sim_card: zod_1.default.coerce
        .number({ error: 'O cartão sim é obrigatório' })
        .int({ error: 'O cartão sim deve ser um número inteiro' }),
    pin: zod_1.default.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
    puk: zod_1.default.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
    note: zod_1.default.string().optional(),
    agent_id: zod_1.default.uuid().optional(),
    delivery_date: zod_1.default.coerce.date(),
    status: terminalStatus.optional(),
    user: user_1.currentUserSchema,
});
