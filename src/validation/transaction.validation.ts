import { object, string } from "zod";
export const createTransactionSchema = object({
    body: object({
        sender: string({ required_error: "Sender is required" }),
        receiver: string({ required_error: "Receiver is required" }),
        amount: string({ required_error: "Amount is required" }),
    }),
});
