import {object, string, array, TypeOf, number} from 'zod';

export const createProfileValidation = object({
    body : object({
        firstName: string({ required_error: "First name is required" }),
        lastName: string({ required_error: "Last name is required" }),
        age: number().min(18, "You must be at least 18 years old to register"),
        email : string().email(),
        phoneNumber: string().regex(/\d{3}-\d{3}-\d{4}/, "Invalid phone number format"),
        password: string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters")
    })
})

export type CreateProfileInput = TypeOf<typeof createProfileValidation>;
