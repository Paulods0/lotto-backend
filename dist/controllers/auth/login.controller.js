"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = handle;
const date_1 = require("../../utils/date");
const login_service_1 = require("../../services/auth/login.service");
const login_schema_1 = require("../../validations/auth/login.schema");
async function handle(req, res) {
    const body = login_schema_1.loginSchema.parse(req.body);
    const { accessToken, refreshToken } = await (0, login_service_1.login)(body);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: date_1.oneDayFromNowInMs,
    });
    return res.status(200).json({ accessToken });
}
