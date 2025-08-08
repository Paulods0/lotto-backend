"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pos_routes_1 = __importDefault(require("./pos.routes"));
const auth_router_1 = __importDefault(require("./auth.router"));
const user_routes_1 = __importDefault(require("./user.routes"));
const agent_routes_1 = __importDefault(require("./agent.routes"));
const licence_routes_1 = __importDefault(require("./licence.routes"));
const terminal_routes_1 = __importDefault(require("./terminal.routes"));
const audit_log_routes_1 = __importDefault(require("./audit-log.routes"));
const authenticate_1 = require("../middleware/auth/authenticate");
const references_routes_1 = require("./references.routes");
const refresh_token_controller_1 = require("../controllers/auth/refresh-token.controller");
const router = (0, express_1.Router)();
// Auth routers
router.use('/auth', auth_router_1.default);
//refresh token
router.post('/refresh-token', refresh_token_controller_1.handle);
// Main routers
router.use('/users', authenticate_1.authenticate, user_routes_1.default);
router.use('/pos', authenticate_1.authenticate, pos_routes_1.default);
router.use('/agents', authenticate_1.authenticate, agent_routes_1.default);
router.use('/licences', authenticate_1.authenticate, licence_routes_1.default);
router.use('/terminals', authenticate_1.authenticate, terminal_routes_1.default);
// Other routers
router.use('/admins', authenticate_1.authenticate, references_routes_1.adminRoutes);
router.use('/types', authenticate_1.authenticate, references_routes_1.typesRoutes);
router.use('/areas', authenticate_1.authenticate, references_routes_1.areasRoutes);
router.use('/provinces', authenticate_1.authenticate, references_routes_1.provincesRoutes);
router.use('/audit-logs', authenticate_1.authenticate, audit_log_routes_1.default);
exports.default = router;
