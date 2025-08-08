"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boundedBoxSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.boundedBoxSchema = zod_1.default.object({
    minLat: zod_1.default.string(),
    maxLat: zod_1.default.string(),
    minLng: zod_1.default.string(),
    maxLng: zod_1.default.string(),
});
