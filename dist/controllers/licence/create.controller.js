"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const create_service_1 = require("../../services/licence/create.service");
const create_schema_1 = require("../../validations/licence/create.schema");
async function handle(req, res) {
    const user = req.user;
    const body = create_schema_1.createLicenceSchema.parse({ ...req.body, user });
    const response = await (0, create_service_1.createLicence)(body);
    return res.status(201).json({
        message: 'Licença criada com sucesso',
        data: response,
    });
}
