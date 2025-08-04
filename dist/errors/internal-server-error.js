"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../constants/http");
const app_error_1 = __importDefault(require("./app-error"));
class InternalServerError extends app_error_1.default {
    constructor(message = 'Erro interno no servidor.') {
        super(message, http_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.default = InternalServerError;
