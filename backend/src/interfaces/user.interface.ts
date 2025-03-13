import { Document } from 'mongoose';

export enum UserType {
    ADMIN = 'Admin',
    USER = 'User'
}

export interface IUserInterface extends Document {
    phoneNumber: string;
    password: string;
    role: UserType;
    Collateralverified: boolean;
    Idverified: boolean;
}

