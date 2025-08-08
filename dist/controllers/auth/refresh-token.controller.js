"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const env_1 = __importDefault(require("../../constants/env"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function handle(req, res) {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, env_1.default.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || !decoded)
            return res.sendStatus(403);
        const user = decoded;
        const accessToken = jsonwebtoken_1.default.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        }, env_1.default.JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: '15m',
        });
        return res.json({ accessToken });
    });
}
