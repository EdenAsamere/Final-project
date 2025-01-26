import { Schema, model } from 'mongoose';
import { IProfile } from '../interfaces/profile.interface';

const profileSchema = new Schema<IProfile>({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { 
        type: Number,
        min: [18, 'You must be at least 18 years old to register'],
    },
    profilePicture: { type: String, required: true },
    address: {
        city: { type: String, required: true },
        subcity: { type: String, required: true },
        kebele: { type: String, required: true },
        houseNumber: { type: String, required: true },
        woreda: { type: String, required: true },
        zone: { type: String, required: true },
        region: { type: String, required: true }
    },
    collateralDocuments: {
        idCard: { type: String, required: true },
        thirdPartyIdCard: { type: String, required: true },
        bankStatement: { type: String, required: true },
        employmentLetter: { type: String, required: true },
        businessLicense: { type: String, required: true },
        other: { type: String, required: true }
    },
    penality: {
        penalityPoints: { type: Number, required: true },
        penalityReason: { type: String, required: true },
        penalityAmount: { type: Number, required: true }
    },
    email: { 
        type: String,
        unique: true, 
        validate: {
            validator: function(v: string) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        },
    },
    phoneNumber: { 
        type: String,
        unique: true, 
        validate: {
            validator: function(v: string) {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User ID is required'], 
        unique: true, 
        index: true,
    },
}
, { timestamps: true });

export default model<IProfile>('Profile', profileSchema);