"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTerminalController = updateTerminalController;
const id_schema_1 = require("../../validations/@common/id.schema");
const update_terminal_service_1 = require("../../services/terminal/update-terminal.service");
const update_terminal_schema_1 = require("../../validations/terminal-schemas/update-terminal-schema");
async function updateTerminalController(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_terminal_schema_1.updateTerminalSchema.parse({ ...req.body, id, user });
    const response = await (0, update_terminal_service_1.updateTerminalService)(body);
    return res.status(200).json({
        message: 'Os dados do terminal foram atualizados com sucesso.',
        data: response,
    });
}
