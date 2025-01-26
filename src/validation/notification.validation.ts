import { object, string } from "zod";

export const createEqubEventSchema = object({
    body: object({
        name: string({ required_error: "Name is required" }),
        startDate: string({ required_error: "Start date is required" }),
        endDate: string({ required_error: "End date is required" }),
        frequency: string({ required_error: "Frequency is required" }),
        members: string({ required_error: "Members is required" }),
    }),
});
