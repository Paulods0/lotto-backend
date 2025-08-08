"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.paramsSchema = zod_1.default.object({
    page: zod_1.default.coerce.number().optional().default(1),
    limit: zod_1.default.coerce.number().optional().default(30),
    query: zod_1.default.string().trim().optional().default(''),
    status: zod_1.default.string().trim().optional().default(''),
    type_id: zod_1.default.coerce.number().optional(),
    subtype_id: zod_1.default.coerce.number().optional(),
    city_id: zod_1.default.coerce.number().optional(),
    area_id: zod_1.default.coerce.number().optional(),
    admin_id: zod_1.default.coerce.number().optional(),
    zone_id: zod_1.default.coerce.number().optional(),
    province_id: zod_1.default.coerce.number().optional(),
    agent_id: zod_1.default.string().optional(),
    delivery_date: zod_1.default.string().optional(),
    training_date: zod_1.default.string().optional(),
    coordinates: zod_1.default.string().optional(),
});
