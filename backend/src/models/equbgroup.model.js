"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const equbGroupSchema = new mongoose_1.Schema({
    group_name: { type: String, required: true },
    description: { type: String },
    payout_Schedule: { type: Date, required: true },
    type: { type: String, enum: ['private', 'hosted'], required: true },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    previousWinners: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    cycleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    currentCycle: { type: Number, required: true },
    totalCycles: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Equbgroup', equbGroupSchema);
