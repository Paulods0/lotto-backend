"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const delete_service_1 = require("../../services/licence/delete.service");
async function handle(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const user = req.user;
    await (0, delete_service_1.deleteLicence)(id, user);
    return res.status(200).json({
        message: 'Licença removida com sucesso.',
    });
}
