import { Document } from 'mongoose';
export interface IUserInterface extends Document {
    phoneNumber: string;
    password: string;
    role:'Admin' | 'User';
    verified: boolean;
    chapaAccountId?: string;
}
