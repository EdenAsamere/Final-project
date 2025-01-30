"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.js (or index.js)
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./config/db"); // Ensure your db connection is correct
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const equbgroup_routes_1 = __importDefault(require("./routes/equbgroup.routes")); // Correct route import
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Define routes
app.use('/api/users', user_routes_1.default);
app.use('/api/equb', equbgroup_routes_1.default); // Ensure this is properly mounted
// Connect to the database
(0, db_1.connectDB)();
exports.default = app; // Export the app instance
