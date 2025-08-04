"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const get_agent_controller_1 = require("../controllers/agent/get-agent-controller");
const update_agent_controller_1 = require("../controllers/agent/update-agent-controller");
const create_agent_controller_1 = require("../controllers/agent/create-agent-controller");
const fetch_many_agents_controller_1 = require("../controllers/agent/fetch-many-agents-controller");
const agentRouter = (0, express_1.Router)();
agentRouter.post('/', (0, catch_errors_1.default)(create_agent_controller_1.createAgentController));
agentRouter.put('/:id', (0, catch_errors_1.default)(update_agent_controller_1.updateAgentController));
agentRouter.get('/', (0, catch_errors_1.default)(fetch_many_agents_controller_1.fetchManyAgentsController));
agentRouter.get('/:id', (0, catch_errors_1.default)(get_agent_controller_1.getAgentController));
exports.default = agentRouter;
