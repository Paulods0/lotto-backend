"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAuditLogsController = fetchManyAuditLogsController;
const fetch_many_audit_logs_services_1 = require("../../services/audit-log/fetch-many-audit-logs-services");
async function fetchManyAuditLogsController(req, res) {
    const response = await (0, fetch_many_audit_logs_services_1.fetchManyAuditLogsServices)();
    return res.status(200).json(response);
}
