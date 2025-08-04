"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const create_agent_schema_1 = require("../agent-schemas/create-agent-schema");
exports.paramsSchema = zod_1.default.object({
    page: zod_1.default.coerce.number().optional().default(1),
    limit: zod_1.default.coerce.number().optional().default(30),
    query: zod_1.default.string().trim().optional(),
    type_id: zod_1.default.coerce.number().optional(),
    city_id: zod_1.default.coerce.number().optional(),
    area_id: zod_1.default.coerce.number().optional(),
    admin_id: zod_1.default.coerce.number().optional(),
    zone_id: zod_1.default.coerce.number().optional(),
    province_id: zod_1.default.coerce.number().optional(),
    agent_id: zod_1.default.string().optional(),
    status: create_agent_schema_1.agentStatus.optional(),
});
