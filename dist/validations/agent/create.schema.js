"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentSchema = exports.genre = exports.agentStatus = exports.agentType = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.agentType = zod_1.default.enum(['lotaria_nacional', 'revendedor'], { error: 'O tipo é obrigatório' });
exports.agentStatus = zod_1.default.enum(['ativo', 'negado', 'agendado', 'apto']);
exports.genre = zod_1.default.enum(['masculino', 'feminino'], { error: 'O gênero é obrigatório' });
exports.createAgentSchema = zod_1.default.object({
    genre: exports.genre,
    type: exports.agentType,
    first_name: zod_1.default.string({ error: 'O nome é obrigatório' }),
    last_name: zod_1.default.string({ error: 'O sobrenome é obrigatório' }),
    training_date: zod_1.default.coerce.date({ error: 'A data de formação é obrigatória' }),
    pos_id: zod_1.default.uuid().optional(),
    status: exports.agentStatus.optional(),
    terminal_id: zod_1.default.uuid().optional(),
    bi_number: zod_1.default.string().optional(),
    id_reference: zod_1.default.number().optional(),
    phone_number: zod_1.default.coerce.number().optional(),
    afrimoney_number: zod_1.default.coerce.number().optional(),
    user: user_1.currentUserSchema,
});
