"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePosSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.updatePosSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    id_reference: zod_1.default.number().int().optional(),
    agent_id: zod_1.default.uuid().optional(),
    licence_id: zod_1.default.uuid().optional(),
    type_id: zod_1.default.coerce.number().optional(),
    city_id: zod_1.default.coerce.number().optional(),
    area_id: zod_1.default.coerce.number().optional(),
    zone_id: zod_1.default.coerce.number().optional(),
    admin_id: zod_1.default.coerce.number().optional(),
    latitude: zod_1.default.coerce.number().optional(),
    longitude: zod_1.default.coerce.number().optional(),
    subtype_id: zod_1.default.coerce.number().optional(),
    province_id: zod_1.default.coerce.number().optional(),
    user: user_1.currentUserSchema,
});
