"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.currentUserSchema = zod_1.default.object({
    id: zod_1.default.uuid(),
    email: zod_1.default.email(),
    name: zod_1.default.string(),
    role: zod_1.default.string(),
});
