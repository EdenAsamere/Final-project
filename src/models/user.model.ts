import { Schema, model } from 'mongoose';
import { IUserInterface } from '../interfaces/user.interface';

const user = new Schema<IUserInterface>({
       phoneNumber: {
        type: String,
        unique: true, // Assuming email should be unique
        validate: {
          validator: function(v: string) {
            // Example: Validate if the phone number follows a specific format
            return /\d{3}-\d{3}-\d{4}/.test(v);
          },
          message: props => `${props.value} is not a valid phone number!`
        },
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
