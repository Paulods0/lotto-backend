"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyLicencesController = fetchManyLicencesController;
const query_schema_1 = require("../../validations/@common/query.schema");
const fetch_many_licences_service_1 = require("../../services/licence/fetch-many-licences.service");
async function fetchManyLicencesController(req, res) {
    const query = query_schema_1.paramsSchema.parse(req.query);
    const response = await (0, fetch_many_licences_service_1.fetchManyLicencesService)(query);
    return res.status(200).json(response);
}
