"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserController = createUserController;
const create_user_service_1 = require("../../services/user/create-user-service");
const create_user_schema_1 = require("../../validations/user/create-user-schema");
async function createUserController(req, res) {
    const body = create_user_schema_1.createUserSchema.parse({ ...req.body });
    const response = await (0, create_user_service_1.createUserService)(body);
    return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        data: response,
    });
}
