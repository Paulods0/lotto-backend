"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPosController = createPosController;
const create_pos_service_1 = require("../../services/pos/create-pos.service");
const create_pos_schema_1 = require("../../validations/pos-schemas/create-pos-schema");
async function createPosController(req, res) {
    const user = req.user;
    const body = create_pos_schema_1.createPosSchema.parse({ ...req.body, user });
    const response = await (0, create_pos_service_1.createPosService)(body);
    return res.status(201).json({
        message: 'Pos criado com sucesso',
        data: response,
    });
}
