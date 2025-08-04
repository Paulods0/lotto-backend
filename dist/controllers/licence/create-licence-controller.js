"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLicenceController = createLicenceController;
const create_licence_service_1 = require("../../services/licence/create-licence.service");
const create_licence_schema_1 = require("../../validations/licence-schemas/create-licence-schema");
async function createLicenceController(req, res) {
    const body = create_licence_schema_1.createLicenceSchema.parse(req.body);
    const response = await (0, create_licence_service_1.createLicenceService)(body);
    return res.status(201).json({
        message: 'Licença criada com sucesso',
        data: response,
    });
}
