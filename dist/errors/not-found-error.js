"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../constants/http");
const app_error_1 = __importDefault(require("./app-error"));
class NotFoundError extends app_error_1.default {
    constructor(message = 'Recurso não encotrado.') {
        super(message, http_1.HttpStatus.NOT_FOUND);
    }
}
exports.default = NotFoundError;
