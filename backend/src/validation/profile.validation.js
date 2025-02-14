"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.penaltySchema = exports.uploadDocumentSchema = exports.updateProfileSchema = exports.profileSchema = void 0;
const zod_1 = require("zod");
const addressSchema = zod_1.z.object({
    city: zod_1.z.string().min(2, "City name is too short"),
    subcity: zod_1.z.string().optional(),
    kebele: zod_1.z.string().optional(),
    houseNumber: zod_1.z.string().optional(),
    woreda: zod_1.z.string().optional(),
    zone: zod_1.z.string().optional(),
    region: zod_1.z.string().optional(),
});
exports.profileSchema = zod_1.z.object({
    profilePicture: zod_1.z.string().url().optional(), // Optional field, must be a valid URL
    address: addressSchema.optional(), // Address is optional but must match the schema
});
exports.updateProfileSchema = exports.profileSchema.partial(); // Allows partial updates
exports.uploadDocumentSchema = zod_1.z.object({
    documentType: zod_1.z.enum(["idCard", "bankStatement", "passport", "other"]),
    documentUrl: zod_1.z.string().url("Invalid document URL"),
});
exports.penaltySchema = zod_1.z.object({
    penaltyPoints: zod_1.z.number().min(0, "Penalty points must be 0 or greater"),
    penaltyReason: zod_1.z.string().min(5, "Reason must be at least 5 characters"),
    penaltyAmount: zod_1.z.number().min(0, "Penalty amount must be 0 or greater"),
});
