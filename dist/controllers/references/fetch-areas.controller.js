"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const fetch_areas_service_1 = require("../../services/references/fetch-areas-service");
async function handle(_req, res) {
    const response = await (0, fetch_areas_service_1.fetchManyAreas)();
    return res.status(200).json(response);
}
