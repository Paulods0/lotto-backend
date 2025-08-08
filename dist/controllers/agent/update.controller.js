"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const update_service_1 = require("../../services/agent/update.service");
const update_schema_1 = require("../../validations/agent/update.schema");
async function handle(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_schema_1.updateAgentSchema.parse({ ...req.body, id, user });
    const response = await (0, update_service_1.updateAgent)(body);
    return res.status(200).json({
        message: 'Agente atualizado com sucesso.',
        data: response,
    });
}
