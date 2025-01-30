"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user = new mongoose_1.Schema({
    phoneNumber: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minlength: [8, 'Password should have at least 8 characters'],
        required: [true, 'Password is required'],
        select: false,
    },
    role: { type: String, enum: ['Admin', 'User'], required: true },
    verified: { type: Boolean, required: true },
    chapaAccountId: { type: String },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('User', user);
