"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_terminal_controller_1 = require("../controllers/terminal/get-terminal-controller");
const update_terminal_controller_1 = require("../controllers/terminal/update-terminal-controller");
const create_terminal_controller_1 = require("../controllers/terminal/create-terminal-controller");
const delete_terminal_controller_1 = require("../controllers/terminal/delete-terminal-controller");
const fetch_many_terminals_controller_1 = require("../controllers/terminal/fetch-many-terminals-controller");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const terminalRouter = (0, express_1.Router)();
terminalRouter.post('/', (0, catch_errors_1.default)(create_terminal_controller_1.createTerminalController));
terminalRouter.put('/:id', (0, catch_errors_1.default)(update_terminal_controller_1.updateTerminalController));
terminalRouter.delete('/:id', (0, catch_errors_1.default)(delete_terminal_controller_1.deleteTerminalController));
terminalRouter.get('/', (0, catch_errors_1.default)(fetch_many_terminals_controller_1.fetchManyTerminalsController));
terminalRouter.get('/:id', (0, catch_errors_1.default)(get_terminal_controller_1.getTerminalController));
exports.default = terminalRouter;
