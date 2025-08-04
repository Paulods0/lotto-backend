"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = deleteUserController;
const id_schema_1 = require("../../validations/@common/id.schema");
const delete_user_service_1 = require("../../services/user/delete-user-service");
async function deleteUserController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    await (0, delete_user_service_1.deleteUserService)(id);
    return res.status(200).json({
        message: 'Usuário removido com sucesso',
    });
}
