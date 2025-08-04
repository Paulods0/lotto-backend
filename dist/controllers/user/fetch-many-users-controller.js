"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchManyUsersController = fetchManyUsersController;
const query_schema_1 = require("../../validations/@common/query.schema");
const fetch_many_users_service_1 = require("../../services/user/fetch-many-users-service");
async function fetchManyUsersController(req, res) {
    const { limit, page, query } = query_schema_1.paramsSchema.parse(req.query);
    const response = await (0, fetch_many_users_service_1.fetchManyUsersService)({ limit, page, query });
    return res.status(200).json(response);
}
