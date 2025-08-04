"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePosController = deletePosController;
const id_schema_1 = require("../../validations/@common/id.schema");
const delete_pos_service_1 = require("../../services/pos/delete-pos.service");
async function deletePosController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const user = req.user;
    await (0, delete_pos_service_1.deletePosService)(id, user);
    return res.status(200).json({
        message: 'Pos removido com sucesso',
    });
}
