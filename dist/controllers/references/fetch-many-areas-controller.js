"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAreasController = fetchManyAreasController;
const fetch_many_areas_service_1 = require("../../services/references/fetch-many-areas-service");
async function fetchManyAreasController(_req, res) {
    const response = await (0, fetch_many_areas_service_1.fetchManyAreasService)();
    return res.status(200).json(response);
}
