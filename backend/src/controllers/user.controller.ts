import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserValidation } from '../validation/user.validation';
import { loginUserValidation } from '../validation/loginUserValidation';
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
}catch(error){
    res.status(400).json({
        message:"Zod Error registering user",
        error: (error instanceof Error) ? error.message : error,
    });
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