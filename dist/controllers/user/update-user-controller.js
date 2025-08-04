"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserController = editUserController;
const id_schema_1 = require("../../validations/@common/id.schema");
const edit_user_schema_1 = require("../../validations/user/edit-user-schema");
const edit_user_service_1 = require("../../services/user/edit-user-service");
async function editUserController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = edit_user_schema_1.editUserSchema.parse({ ...req.body, id });
    const response = await (0, edit_user_service_1.editUserService)(body);
    return res.status(200).json({
        message: 'Os dados do usuário foram atualizados com sucesso.',
        data: response,
    });
}
