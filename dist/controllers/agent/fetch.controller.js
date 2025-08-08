"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const query_schema_1 = require("../../validations/common/query.schema");
const fetch_many_service_1 = require("../../services/agent/fetch-many.service");
async function handle(req, res) {
    const query = query_schema_1.paramsSchema.parse(req.query);
    const response = await (0, fetch_many_service_1.fetchManyAgents)(query);
    return res.status(200).json(response);
}
