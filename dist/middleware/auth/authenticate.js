"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../constants/env"));
const http_1 = require("../../constants/http");
async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token)
        return res.status(http_1.HttpStatus.UNAUTHORIZED).json({ message: 'Não autorizado.' });
    jsonwebtoken_1.default.verify(token, env_1.default.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
            return res.status(http_1.HttpStatus.FORBIDDEN).json({ message: 'Acesso proibido.' });
        req.user = user;
        next();
    });
}
