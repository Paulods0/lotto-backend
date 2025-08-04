"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyTypesController = fetchManyTypesController;
const fetch_many_types_service_1 = require("../../services/references/fetch-many-types-service");
async function fetchManyTypesController(_req, res) {
    const response = await (0, fetch_many_types_service_1.fetchManyTypesService)();
    return res.status(200).json(response);
}
