import { Document, Schema } from 'mongoose';
export interface IProfile extends Document {
    firstName?: string;
    lastName?: string;
    age?: number,
    profilePicture?: string;
    address: {
        city: string;
        subcity: string;
        kebele: string;
        houseNumber: string;
        woreda: string;
        zone: string;
        region: string;   
        
    };
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
    email: {type: string,required: false},
    userId: Schema.Types.ObjectId;
}
