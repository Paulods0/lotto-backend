"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const get_service_1 = require("../../services/terminal/get.service");
async function handle(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_service_1.getTerminal)(id);
    return res.status(200).json(response);
}
