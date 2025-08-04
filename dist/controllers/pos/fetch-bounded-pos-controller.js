"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBoundedPosController = fetchBoundedPosController;
const fetch_bounded_pos_service_1 = require("../../services/pos/fetch-bounded-pos-service");
const bounds_1 = require("../../validations/pos-schemas/bounds");
async function fetchBoundedPosController(req, res) {
    const bounds = bounds_1.boundedBoxSchema.parse(req.query);
    const response = await (0, fetch_bounded_pos_service_1.fecthBoundedPosService)(bounds);
    return res.status(200).json(response);
}
