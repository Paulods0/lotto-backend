"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTerminalController = deleteTerminalController;
const id_schema_1 = require("../../validations/@common/id.schema");
const delete_terminal_service_1 = require("../../services/terminal/delete-terminal.service");
async function deleteTerminalController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const user = req.user;
    await (0, delete_terminal_service_1.deleteTerminalService)(id, user);
    return res.status(200).json({
        message: 'Terminal removido com sucesso',
    });
}
