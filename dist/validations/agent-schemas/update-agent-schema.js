"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const create_agent_schema_1 = require("./create-agent-schema");
const user_1 = require("../../@types/user");
exports.updateAgentSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    id_reference: zod_1.default.number().optional(),
    first_name: zod_1.default.string().optional(),
    last_name: zod_1.default.string().optional(),
    genre: create_agent_schema_1.genre.optional(),
    type: create_agent_schema_1.agentType.optional(),
    phone_number: zod_1.default.coerce.number().optional(),
    afrimoney_number: zod_1.default.coerce.number().optional(),
    bi_number: zod_1.default.string().optional(),
    status: create_agent_schema_1.agentStatus.optional(),
    pos_id: zod_1.default.uuid().optional(),
    terminal_id: zod_1.default.uuid().optional(),
    user: user_1.currentUserSchema,
});
