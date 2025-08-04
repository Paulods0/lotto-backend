"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const get_licence_controller_1 = require("../controllers/licence/get-licence-controller");
const create_licence_controller_1 = require("../controllers/licence/create-licence-controller");
const delete_licence_controller_1 = require("../controllers/licence/delete-licence-controller");
const fetch_many_licences_controller_1 = require("../controllers/licence/fetch-many-licences-controller");
const update_licence_controller_1 = require("../controllers/licence/update-licence-controller");
const licenceRouter = (0, express_1.Router)();
licenceRouter.post('/', (0, catch_errors_1.default)(create_licence_controller_1.createLicenceController));
licenceRouter.put('/:id', (0, catch_errors_1.default)(update_licence_controller_1.updateLicenceController));
licenceRouter.delete('/:id', (0, catch_errors_1.default)(delete_licence_controller_1.deleteLicenceController));
licenceRouter.get('/:id', (0, catch_errors_1.default)(get_licence_controller_1.getLicenceController));
licenceRouter.get('/', (0, catch_errors_1.default)(fetch_many_licences_controller_1.fetchManyLicencesController));
exports.default = licenceRouter;
