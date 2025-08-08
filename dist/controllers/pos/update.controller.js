"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const id_schema_1 = require("../../validations/common/id.schema");
const update_pos_service_1 = require("../../services/pos/update-pos.service");
const update_schema_1 = require("../../validations/pos/update.schema");
async function handle(req, res) {
    const user = req.user;
    const { id } = id_schema_1.idSchema.parse(req.params);
    const body = update_schema_1.updatePosSchema.parse({ ...req.body, id, user });
    const response = await (0, update_pos_service_1.updatePos)(body);
    return res.status(200).json({
        message: 'Os dados do pos foram atualizados com sucesso.',
        data: response,
    });
}
