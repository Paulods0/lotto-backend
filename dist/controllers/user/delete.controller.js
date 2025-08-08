"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const delete_service_1 = require("../../services/user/delete.service");
async function handle(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    await (0, delete_service_1.deleteUser)(id, user);
    return res.status(200).json({
        message: 'Usuário removido com sucesso',
    });
}
