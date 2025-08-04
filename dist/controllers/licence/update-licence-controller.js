"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLicenceController = updateLicenceController;
const id_schema_1 = require("../../validations/@common/id.schema");
const update_licence_service_1 = require("../../services/licence/update-licence.service");
const update_licence_schema_1 = require("../../validations/licence-schemas/update-licence-schema");
async function updateLicenceController(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_licence_schema_1.updateLicenceSchema.parse({ ...req.body, id, user });
    const response = await (0, update_licence_service_1.updateLicenceService)(body);
    return res.status(200).json({
        message: 'Licença atualizada com sucesso',
        data: response,
    });
}
