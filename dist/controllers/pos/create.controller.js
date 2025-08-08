"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const create_pos_service_1 = require("../../services/pos/create-pos.service");
const create_schema_1 = require("../../validations/pos/create.schema");
async function handle(req, res) {
    const user = req.user;
    const body = create_schema_1.createPosSchema.parse({ ...req.body, user });
    const response = await (0, create_pos_service_1.createPos)(body);
    return res.status(201).json({
        message: 'Pos criado com sucesso',
        data: response,
    });
}
