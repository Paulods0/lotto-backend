"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const get_controller_1 = require("../controllers/agent/get.controller");
const update_controller_1 = require("../controllers/agent/update.controller");
const create_controller_1 = require("../controllers/agent/create.controller");
const fetch_controller_1 = require("../controllers/agent/fetch.controller");
const agentRouter = (0, express_1.Router)();
agentRouter.post('/', (0, catch_errors_1.default)(create_controller_1.handle));
agentRouter.put('/:id', (0, catch_errors_1.default)(update_controller_1.handle));
agentRouter.get('/', (0, catch_errors_1.default)(fetch_controller_1.handle));
agentRouter.get('/:id', (0, catch_errors_1.default)(get_controller_1.handle));
exports.default = agentRouter;
