"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const zod_1 = __importDefault(require("zod"));
const errors_1 = require("../../errors");
const delete_many_service_1 = require("../../services/terminal/delete-many.service");
async function handle(req, res) {
    const idsSchema = zod_1.default.object({
        ids: zod_1.default.array(zod_1.default.uuid()),
    });
    const { ids } = idsSchema.parse(req.body);
    if (ids.length === 0) {
        throw new errors_1.BadRequestError('A lista de IDs não pode estar vazia.');
    }
    await (0, delete_many_service_1.deleteManyTerminal)(ids);
    return res.status(200).json({
        message: 'Terminais removidos com sucesso.',
    });
}
