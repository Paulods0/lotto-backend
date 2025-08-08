"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const fetch_provinces_service_1 = require("../../services/references/fetch-provinces-service");
async function handle(_req, res) {
    const response = await (0, fetch_provinces_service_1.fetchManyProvinces)();
    return res.status(200).json(response);
}
