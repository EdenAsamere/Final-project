"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEqubEventSchema = void 0;
const zod_1 = require("zod");
exports.createEqubEventSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({ required_error: "Name is required" }),
        description: (0, zod_1.string)({ required_error: "Description is required" }),
        amount: (0, zod_1.string)({ required_error: "Amount is required" }),
        startDate: (0, zod_1.string)({ required_error: "Start date is required" }),
        endDate: (0, zod_1.string)({ required_error: "End date is required" }),
        frequency: (0, zod_1.string)({ required_error: "Frequency is required" }),
        members: (0, zod_1.string)({ required_error: "Members is required" }),
    }),
});
