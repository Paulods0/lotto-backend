"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAgentsController = fetchManyAgentsController;
const query_schema_1 = require("../../validations/@common/query.schema");
const fetch_many_agents_service_1 = require("../../services/agent/fetch-many-agents.service");
async function fetchManyAgentsController(req, res) {
    const query = query_schema_1.paramsSchema.parse(req.query);
    const response = await (0, fetch_many_agents_service_1.fetchManyAgentsService)(query);
    return res.status(200).json(response);
}
