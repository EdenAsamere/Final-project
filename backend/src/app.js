"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv")); // Import dotenv
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api/users', user_routes_1.default);
(0, db_1.connectDB)();
exports.default = app;
