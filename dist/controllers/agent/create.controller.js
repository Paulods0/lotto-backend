"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const http_1 = require("../../constants/http");
const create_service_1 = require("../../services/agent/create.service");
const create_schema_1 = require("../../validations/agent/create.schema");
async function handle(req, res) {
    const user = req.user;
    const body = create_schema_1.createAgentSchema.parse({ ...req.body, user });
    const response = await (0, create_service_1.createAgent)(body);
    return res.status(http_1.HttpStatus.CREATED).json({
        message: 'Agente criado com sucesso.',
        data: response,
    });
}
