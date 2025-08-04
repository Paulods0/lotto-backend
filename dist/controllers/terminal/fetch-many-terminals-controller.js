"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyTerminalsController = fetchManyTerminalsController;
const query_schema_1 = require("../../validations/@common/query.schema");
const fetch_many_terminals_service_1 = require("../../services/terminal/fetch-many-terminals.service");
async function fetchManyTerminalsController(req, res) {
    const query = query_schema_1.paramsSchema.parse(req.query);
    const response = await (0, fetch_many_terminals_service_1.fetchManyTerminalsService)(query);
    return res.status(200).json(response);
}
