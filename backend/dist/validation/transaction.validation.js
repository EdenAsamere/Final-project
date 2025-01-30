"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        sender: (0, zod_1.string)({ required_error: "Sender is required" }),
        receiver: (0, zod_1.string)({ required_error: "Receiver is required" }),
        amount: (0, zod_1.string)({ required_error: "Amount is required" }),
    }),
});
