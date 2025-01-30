"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const equbEventSchema = new mongoose_1.Schema({
    equbgroupId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Equbgroup', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('EqubEvent', equbEventSchema);
