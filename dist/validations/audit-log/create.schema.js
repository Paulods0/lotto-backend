"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLogSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const auditActionEnum = zod_1.default.enum(['update', 'create', 'delete']);
const auditEntity = zod_1.default.enum(['agent', 'terminal', 'pos', 'licence', 'user']);
const auditLogchanges = zod_1.default.object({
    before: zod_1.default.record(zod_1.default.string(), zod_1.default.any()).nullable().optional(),
    after: zod_1.default.record(zod_1.default.string(), zod_1.default.any()).nullable().optional(),
});
exports.createAuditLogSchema = zod_1.default.object({
    entity: auditEntity,
    user_name: zod_1.default.string(),
    user_email: zod_1.default.email(),
    action: auditActionEnum,
    changes: auditLogchanges,
});
