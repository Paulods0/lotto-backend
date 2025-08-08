"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const get_controller_1 = require("../controllers/terminal/get.controller");
const update_controller_1 = require("../controllers/terminal/update.controller");
const create_controller_1 = require("../controllers/terminal/create.controller");
const delete_controller_1 = require("../controllers/terminal/delete.controller");
const fetch_many_controller_1 = require("../controllers/terminal/fetch-many.controller");
const terminalRouter = (0, express_1.Router)();
terminalRouter.post('/', (0, catch_errors_1.default)(create_controller_1.handle));
terminalRouter.put('/:id', (0, catch_errors_1.default)(update_controller_1.handle));
terminalRouter.delete('/:id', (0, catch_errors_1.default)(delete_controller_1.handle));
terminalRouter.get('/', (0, catch_errors_1.default)(fetch_many_controller_1.handle));
terminalRouter.get('/:id', (0, catch_errors_1.default)(get_controller_1.handle));
exports.default = terminalRouter;
