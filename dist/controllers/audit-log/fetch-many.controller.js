"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const fetch_many_service_1 = require("../../services/audit-log/fetch-many.service");
async function handle(_req, res) {
    const response = await (0, fetch_many_service_1.fetchManyAuditLogs)();
    return res.status(200).json(response);
}
