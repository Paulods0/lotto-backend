"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const get_pos_service_1 = require("../../services/pos/get-pos.service");
async function handle(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_pos_service_1.getPos)(id);
    return res.status(200).json(response);
}
