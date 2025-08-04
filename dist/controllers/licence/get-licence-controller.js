"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicenceController = getLicenceController;
const id_schema_1 = require("../../validations/@common/id.schema");
const get_licence_service_1 = require("../../services/licence/get-licence.service");
async function getLicenceController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_licence_service_1.getLicenceService)(id);
    return res.status(200).json(response);
}
