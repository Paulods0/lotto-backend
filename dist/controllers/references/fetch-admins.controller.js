"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const fetch_admins_service_1 = require("../../services/references/fetch-admins-service");
async function handle(_req, res) {
    const response = await (0, fetch_admins_service_1.fetchManyAdmins)();
    return res.status(200).json(response);
}
