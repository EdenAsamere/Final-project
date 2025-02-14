"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserValidation = void 0;
const zod_1 = require("zod");
exports.loginUserValidation = (0, zod_1.object)({
    phoneNumber: (0, zod_1.string)({ required_error: "Phone number is required" }),
    password: (0, zod_1.string)({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});
