"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTerminalController = createTerminalController;
const create_terminal_service_1 = require("../../services/terminal/create-terminal.service");
const create_terminal_schema_1 = require("../../validations/terminal-schemas/create-terminal-schema");
async function createTerminalController(req, res) {
    const user = req.user;
    const body = create_terminal_schema_1.createTerminalSchema.parse({ ...req.body, user });
    const response = await (0, create_terminal_service_1.createTerminalService)(body);
    return res.status(201).json({
        message: 'Terminal criado com sucesso',
        data: response,
    });
}
