"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const create_service_1 = require("../../services/terminal/create.service");
const create_schema_1 = require("../../validations/terminal/create.schema");
async function handle(req, res) {
    const user = req.user;
    const body = create_schema_1.createTerminalSchema.parse({ ...req.body, user });
    const response = await (0, create_service_1.createTerminal)(body);
    return res.status(201).json({
        message: 'Terminal criado com sucesso',
        data: response,
    });
}
