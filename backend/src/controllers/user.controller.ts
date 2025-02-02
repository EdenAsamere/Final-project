import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserValidation } from '../validation/user.validation';
import { loginUserValidation } from '../validation/loginUserValidation';
import { ZodError } from 'zod';
const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
    try{
        createUserValidation.parse(req.body);
        const { firstName, lastName, phoneNumber,city,  password, confirmPassword } = req.body;

        try {
            const user = await userService.register({
                firstName,
                lastName,
                phoneNumber,
                city,
                password,
                confirmPassword,
            });
            res.status(201).json({
                message: 'User registered successfully',
                user,
            });
        } catch (error) {
            res.status(400).json({
                message:"Error registering user",
                error: (error instanceof Error) ? error.message : error,
            });
        }
  }catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."), // Convert path to string
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors: formattedErrors, // Send structured errors
      });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
      loginUserValidation.parse(req.body);
  
      const { phoneNumber, password } = req.body;
  
      try {
        const user = await userService.login({ phoneNumber, password });
        res.status(200).json({
          message: "Login successful",
          user,
        });
      } catch (error) {
        res.status(401).json({
          message: "Login failed",
          error: (error instanceof Error) ? error.message : error,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Validation error",
        error: (error instanceof Error) ? error.message : error,
      });
    }
  };