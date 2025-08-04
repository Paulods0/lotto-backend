"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLicenceSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
exports.updateLicenceSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    number: zod_1.default.coerce.string().optional(),
    description: zod_1.default.coerce.string().optional(),
    latitude: zod_1.default.coerce.number().optional(),
    longitude: zod_1.default.coerce.number().optional(),
    file: zod_1.default.string().optional().nullable(),
    creation_date: zod_1.default.coerce.date().optional(),
    admin_id: zod_1.default.coerce.number().optional(),
    user: user_1.currentUserSchema,
});
