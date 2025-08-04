"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLicenceController = deleteLicenceController;
const id_schema_1 = require("../../validations/@common/id.schema");
const delete_licence_service_1 = require("../../services/licence/delete-licence.service");
async function deleteLicenceController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const user = req.user;
    await (0, delete_licence_service_1.deleteLicenceService)(id, user);
    return res.status(200).json({
        message: 'Licença removida com sucesso.',
    });
}
