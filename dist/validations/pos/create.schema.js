"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.createPosSchema = zod_1.default.object({
    agent_id: zod_1.default.uuid().optional(),
    licence_id: zod_1.default.uuid().optional(),
    type_id: zod_1.default.coerce.number().optional(),
    city_id: zod_1.default.coerce.number().optional(),
    area_id: zod_1.default.coerce.number().optional(),
    zone_id: zod_1.default.coerce.number().optional(),
    admin_id: zod_1.default.coerce.number().optional(),
    subtype_id: zod_1.default.coerce.number().optional(),
    province_id: zod_1.default.coerce.number().optional(),
    id_reference: zod_1.default.number().int().optional(),
    coordinates: zod_1.default.string().min(1, 'As coordenadas são obrigatórias'),
    user: user_1.currentUserSchema,
});
