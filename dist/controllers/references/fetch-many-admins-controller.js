"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyAdminsController = fetchManyAdminsController;
const fetch_many_admins_service_1 = require("../../services/references/fetch-many-admins-service");
async function fetchManyAdminsController(_req, res) {
    const response = await (0, fetch_many_admins_service_1.fetchManyAdminsService)();
    return res.status(200).json(response);
}
