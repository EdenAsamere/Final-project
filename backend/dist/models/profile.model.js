"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: {
        type: Number,
        min: [18, 'You must be at least 18 years old to register'],
    },
    profilePicture: { type: String },
    address: {
        city: { type: String },
        subcity: { type: String },
        kebele: { type: String },
        houseNumber: { type: String },
        woreda: { type: String },
        zone: { type: String },
        region: { type: String }
    },
    collateralDocuments: {
        idCard: { type: String },
        thirdPartyIdCard: { type: String },
        bankStatement: { type: String },
        employmentLetter: { type: String },
        businessLicense: { type: String },
        other: { type: String }
    },
    penality: {
        penalityPoints: { type: Number },
        penalityReason: { type: String },
        penalityAmount: { type: Number }
    },
    email: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true,
        index: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Profile', profileSchema);
