import {Schema, model } from 'mongoose';
import { ICollateral } from '../interfaces/collateral.interface';

const CollateralSchema = new Schema<ICollateral>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User"},
        documentType: { type: String, enum:['Bank Statment','Land deeds','Car ownership','House ownership','Business license','Employment contract'] , required:true},
        documentUrl: { type: String, required:true },
        adminRemark: { type: String },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        verified: { type: Boolean, default: false }
    },
    { timestamps: true } 
);

export default model<ICollateral>("Collateral", CollateralSchema);

