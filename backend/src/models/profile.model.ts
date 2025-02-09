import { Schema, model } from 'mongoose';
import { IProfile } from '../interfaces/profile.interface';

const profileSchema = new Schema<IProfile>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: {
        type: Number,
        min: [18, 'You must be at least 18 years old to register'],
    },
    profilePicture: { type: String },
    address: {
        city: { type: String },
        subcity: { type: String },
        kebele: { type: String },
        houseNumber: { type: String },
        woreda: { type: String },
        zone: { type: String },
        region: { type: String }
    },
    collateraldocumentId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Collateral',
        }
    ],    
    penality: {
        penalityPoints: { type: Number },
        penalityReason: { type: String },
        penalityAmount: { type: Number }
    },
    email: {
        type: String,
        required: false,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        index: true,
    },
}, { timestamps: true });

export default model<IProfile>('Profile', profileSchema);
