"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerminalSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.updateTerminalSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    id_reference: zod_1.default.number().int().optional(),
    serial: zod_1.default.string().optional(),
    sim_card: zod_1.default.coerce.number().int({ error: 'O cartão sim deve ser um número inteiro' }).optional(),
    pin: zod_1.default.coerce.number().int({ error: 'O pin deve ser um número inteiro' }).optional(),
    puk: zod_1.default.coerce.number().int({ error: 'O puk deve ser um número inteiro' }).optional(),
    status: zod_1.default.boolean().optional(),
    agent_id: zod_1.default.uuid().optional(),
    user: user_1.currentUserSchema,
});
