"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerminalSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_1 = require("../../@types/user");
const create_schema_1 = require("./create.schema");
exports.updateTerminalSchema = create_schema_1.createTerminalSchema.partial().extend({
    id: zod_1.default.uuid(),
    user: user_1.currentUserSchema,
});
