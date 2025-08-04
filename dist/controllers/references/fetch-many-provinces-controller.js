"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyProvincesController = fetchManyProvincesController;
const fetch_many_provinces_service_1 = require("../../services/references/fetch-many-provinces-service");
async function fetchManyProvincesController(_req, res) {
    const response = await (0, fetch_many_provinces_service_1.fetchManyProvincesService)();
    return res.status(200).json(response);
}
