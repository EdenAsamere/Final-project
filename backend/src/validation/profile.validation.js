"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfileValidation = void 0;
const zod_1 = require("zod");
exports.createProfileValidation = (0, zod_1.object)({
    body: (0, zod_1.object)({
        firstName: (0, zod_1.string)({ required_error: "First name is required" }),
        lastName: (0, zod_1.string)({ required_error: "Last name is required" }),
        age: (0, zod_1.number)().min(18, "You must be at least 18 years old to register"),
        email: (0, zod_1.string)().email(),
        phoneNumber: (0, zod_1.string)().regex(/\d{3}-\d{3}-\d{4}/, "Invalid phone number format"),
        password: (0, zod_1.string)({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
        role: (0, zod_1.object)({
            name: (0, zod_1.string)(),
            permissions: (0, zod_1.array)((0, zod_1.string)()),
            grantAll: (0, zod_1.string)()
        }, { required_error: "Role is required" })
    })
});
