"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentController = updateAgentController;
const id_schema_1 = require("../../validations/@common/id.schema");
const update_agent_service_1 = require("../../services/agent/update-agent.service");
const update_agent_schema_1 = require("../../validations/agent-schemas/update-agent-schema");
async function updateAgentController(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_agent_schema_1.updateAgentSchema.parse({ ...req.body, id, user });
    const response = await (0, update_agent_service_1.updateAgentService)(body);
    return res.status(200).json({
        message: 'Agente atualizado com sucesso.',
        data: response,
    });
}
