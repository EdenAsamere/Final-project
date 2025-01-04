import {object, string, array, TypeOf} from 'zod';

export const createUserValidation = object({
    body : object({
        phoneNumber: string().regex(/\d{3}-\d{3}-\d{4}/, "Invalid phone number format"),
        password: string({ required_error: "Password is required" }).min(8, "Password must be at least 8 characters"),
        role: object({
            name: string(),
            permissions: array(string()),
            grantAll: string()
        },{required_error: "Role is required"})
    })
})

export type CreateUserInput = TypeOf<typeof createUserValidation>;
