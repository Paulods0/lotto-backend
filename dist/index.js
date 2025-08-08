"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const env_1 = __importDefault(require("./constants/env"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = require("./middleware/error-handler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// const allowedOrigins = ['https://mtjogos.co.ao', 'http://localhost:5173'];
const allowedOrigins = ['*'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use('/api', routes_1.default);
app.use(error_handler_1.errorHandler);
app.listen(env_1.default.PORT, '0.0.0.0', () => {
    console.log(`App running on port:${env_1.default.PORT}`);
});
exports.default = app;
