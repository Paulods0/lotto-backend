"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const authenticate_1 = require("../middleware/auth/authenticate");
const login_controller_1 = require("../controllers/auth/login.controller");
const logout_controller_1 = require("../controllers/auth/logout.controller");
const get_profile_controller_1 = require("../controllers/auth/get-profile.controller");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, catch_errors_1.default)(login_controller_1.handle));
authRouter.get('/logout', (0, catch_errors_1.default)(logout_controller_1.handle));
authRouter.get('/me', authenticate_1.authenticate, (0, catch_errors_1.default)(get_profile_controller_1.handle));
exports.default = authRouter;
