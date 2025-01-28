import { Schema, model } from 'mongoose';
import { IUserInterface } from '../interfaces/user.interface';

const user = new Schema<IUserInterface>({
       phoneNumber: {
        type: String,
        unique: true, 
    },
    password: {
        type: String,
        minlength: [8, 'Password should have at least 8 characters'],
        required: [true, 'Password is required'],
        select: false,
    }, 
    role: { type: String, enum: ['Admin', 'User'], required: true },
    verified: { type: Boolean, required: true },
    chapaAccountId: { type: String },
},
{
    timestamps: true,
});

export default model<IUserInterface>('User', user);
