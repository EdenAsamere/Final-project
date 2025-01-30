"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['deadline', 'payout', 'reminder', 'announcement'], required: true },
    seen: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Notification', notificationSchema);
