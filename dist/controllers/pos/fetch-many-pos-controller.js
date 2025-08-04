"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyPosController = fetchManyPosController;
const query_schema_1 = require("../../validations/@common/query.schema");
const fetch_many_pos_service_1 = require("../../services/pos/fetch-many-pos.service");
async function fetchManyPosController(req, res) {
    const query = query_schema_1.paramsSchema.parse(req.query);
    const result = await (0, fetch_many_pos_service_1.fetchManyPosService)(query);
    return res.status(200).json(result);
}
