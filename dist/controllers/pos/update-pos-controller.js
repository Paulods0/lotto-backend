"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPosController = editPosController;
const id_schema_1 = require("../../validations/@common/id.schema");
const update_pos_service_1 = require("../../services/pos/update-pos.service");
const update_pos_schema_1 = require("../../validations/pos-schemas/update-pos-schema");
async function editPosController(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_pos_schema_1.updatePosSchema.parse({ ...req.body, id, user });
    const response = await (0, update_pos_service_1.updatePosService)(body);
    return res.status(200).json({
        message: 'Os dados do pos foram atualizados com sucesso.',
        data: response,
    });
}
