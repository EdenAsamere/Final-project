import { object, string, TypeOf } from 'zod';

export const createUserValidation = object({
  password: string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .regex(/\d/, "Password must contain at least one number"),
});

export type CreateUserInput = TypeOf<typeof createUserValidation>;
