"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentController = getAgentController;
const id_schema_1 = require("../../validations/@common/id.schema");
const get_agent_service_1 = require("../../services/agent/get-agent.service");
async function getAgentController(req, res) {
    const { id } = id_schema_1.idSchema.parse(req.params);
    const response = await (0, get_agent_service_1.getAgentService)(id);
    return res.status(200).json(response);
}
