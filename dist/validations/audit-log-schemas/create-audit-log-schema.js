"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuditLogSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const auditEntity = zod_1.default.enum(['AGENT', 'TERMINAL', 'POS', 'LICENCE', 'USER']);
const auditActionEnum = zod_1.default.enum(['UPDATE', 'CREATE', 'DELETE', 'LOGIN', 'LOGOUT']);
const changeLog = zod_1.default.object({
    before: zod_1.default.record(zod_1.default.string(), zod_1.default.any()).nullable(),
    after: zod_1.default.record(zod_1.default.string(), zod_1.default.any()).nullable(),
});
exports.createAuditLogSchema = zod_1.default.object({
    entity: auditEntity,
    entity_id: zod_1.default.uuid().optional(),
    user_id: zod_1.default.uuid().optional(),
    user_name: zod_1.default.string(),
    action: auditActionEnum,
    metadata: zod_1.default.json().optional(),
    changes: changeLog.optional(),
});
