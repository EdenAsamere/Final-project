import { object, string, TypeOf } from 'zod';

export const loginUserValidation = object({
  phoneNumber: string({ required_error: "Phone number is required" }),
  password: string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
});

export type LoginUserInput = TypeOf<typeof loginUserValidation>;
