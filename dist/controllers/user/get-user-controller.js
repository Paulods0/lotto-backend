"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserController = getUserController;
const id_schema_1 = require("../../validations/@common/id.schema");
const get_user_service_1 = require("../../services/user/get-user-service");
async function getUserController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_user_service_1.getUserService)(id);
    return res.status(200).json(response);
}
