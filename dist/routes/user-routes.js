"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const get_user_controller_1 = require("../controllers/user/get-user-controller");
const update_user_controller_1 = require("../controllers/user/update-user-controller");
const create_user_controller_1 = require("../controllers/user/create-user-controller");
const delete_user_controller_1 = require("../controllers/user/delete-user-controller");
const fetch_many_users_controller_1 = require("../controllers/user/fetch-many-users-controller");
const catch_errors_1 = __importDefault(require("../utils/catch-errors"));
const userRouter = (0, express_1.Router)();
userRouter.post('/', (0, catch_errors_1.default)(create_user_controller_1.createUserController));
userRouter.put('/:id', (0, catch_errors_1.default)(update_user_controller_1.editUserController));
userRouter.delete('/:id', (0, catch_errors_1.default)(delete_user_controller_1.deleteUserController));
userRouter.get('/:id', (0, catch_errors_1.default)(get_user_controller_1.getUserController));
userRouter.get('/', (0, catch_errors_1.default)(fetch_many_users_controller_1.fetchManyUsersController));
exports.default = userRouter;
