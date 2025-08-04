"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const fetch_many_audit_logs_controller_1 = require("../controllers/audit-log/fetch-many-audit-logs-controller");
const auditLogRouter = (0, express_1.Router)();
auditLogRouter.get('/', (0, catch_errors_1.default)(fetch_many_audit_logs_controller_1.fetchManyAuditLogsController));
exports.default = auditLogRouter;
