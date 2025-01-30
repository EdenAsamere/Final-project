"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_service_1 = require("../services/user.service");
const user_validation_1 = require("../validation/user.validation");
const loginUserValidation_1 = require("../validation/loginUserValidation");
const userService = new user_service_1.UserService();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        user_validation_1.createUserValidation.parse(req.body);
        const { firstName, lastName, phoneNumber, city, password, confirmPassword } = req.body;
        try {
            const user = yield userService.register({
                firstName,
                lastName,
                phoneNumber,
                city,
                password,
                confirmPassword,
            });
            res.status(201).json({
                message: 'User registered successfully',
                user,
            });
        }
        catch (error) {
            res.status(400).json({
                message: "Error registering user",
                error: (error instanceof Error) ? error.message : error,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Zod Error registering user",
            error: (error instanceof Error) ? error.message : error,
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        loginUserValidation_1.loginUserValidation.parse(req.body);
        const { phoneNumber, password } = req.body;
        try {
            const user = yield userService.login({ phoneNumber, password });
            res.status(200).json({
                message: "Login successful",
                user,
            });
        }
        catch (error) {
            res.status(401).json({
                message: "Login failed",
                error: (error instanceof Error) ? error.message : error,
            });
        }
    }
    catch (error) {
        res.status(400).json({
            message: "Validation error",
            error: (error instanceof Error) ? error.message : error,
        });
    }
});
exports.loginUser = loginUser;
