"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    equbgroupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equbgroup', required: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['contribution', 'payout'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Transaction', transactionSchema);
