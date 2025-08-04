"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../constants/http");
class AppError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || http_1.HttpStatus.BAD_REQUEST;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
