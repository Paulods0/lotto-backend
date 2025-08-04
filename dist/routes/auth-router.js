"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const login_controller_1 = require("../controllers/auth/login-controller");
const logout_controller_1 = require("../controllers/auth/logout-controller");
const get_user_profile_1 = require("../controllers/auth/get-user-profile");
const authenticate_1 = require("../middleware/auth/authenticate");
const authRouter = (0, express_1.Router)();
authRouter.post('/login', (0, catch_errors_1.default)(login_controller_1.loginController));
authRouter.get('/logout', (0, catch_errors_1.default)(logout_controller_1.logoutController));
authRouter.get('/me', authenticate_1.authenticate, (0, catch_errors_1.default)(get_user_profile_1.getUserProfileController));
exports.default = authRouter;
