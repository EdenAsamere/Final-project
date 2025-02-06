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
    collateraldocumentId: [Schema.Types.ObjectId];
    penality: {
        penalityPoints: number;  
        penalityReason: string;  
        penalityAmount: number;  
    };
    email: {type: string,required: false},
    userId: Schema.Types.ObjectId;
}
