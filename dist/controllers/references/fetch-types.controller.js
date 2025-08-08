"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const fetch_types_service_1 = require("../../services/references/fetch-types-service");
async function handle(_req, res) {
    const response = await (0, fetch_types_service_1.fetchManyTypes)();
    return res.status(200).json(response);
}
