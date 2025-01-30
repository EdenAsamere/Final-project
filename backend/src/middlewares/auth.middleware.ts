import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access Denied. No token provided.' });
    return;
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not defined');

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; phoneNumber: string; role: string };

    (req as AuthRequest).user = decoded; // Type assertion

    next(); // Continue to the next middleware/controller
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
