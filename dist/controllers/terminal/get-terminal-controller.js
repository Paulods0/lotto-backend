"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTerminalController = getTerminalController;
const id_schema_1 = require("../../validations/@common/id.schema");
const get_terminal_service_1 = require("../../services/terminal/get-terminal.service");
async function getTerminalController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_terminal_service_1.getTerminalService)(id);
    return res.status(200).json(response);
}
