"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const update_service_1 = require("../../services/terminal/update.service");
const update_schema_1 = require("../../validations/terminal/update.schema");
async function handle(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_schema_1.updateTerminalSchema.parse({ ...req.body, id, user });
    const response = await (0, update_service_1.updateTerminal)(body);
    return res.status(200).json({
        message: 'Os dados do terminal foram atualizados com sucesso.',
        data: response,
    });
}
