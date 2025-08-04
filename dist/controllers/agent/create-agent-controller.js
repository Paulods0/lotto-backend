"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentController = createAgentController;
const http_1 = require("../../constants/http");
const create_agent_service_1 = require("../../services/agent/create-agent.service");
const create_agent_schema_1 = require("../../validations/agent-schemas/create-agent-schema");
async function createAgentController(req, res) {
    const user = req.user;
    const body = create_agent_schema_1.createAgentSchema.parse({ ...req.body, user });
    const response = await (0, create_agent_service_1.createAgentService)(body);
    return res.status(http_1.HttpStatus.CREATED).json({
        message: 'Agente criado com sucesso.',
        data: response,
    });
}
