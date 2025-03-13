import {Schema, model } from 'mongoose';
import { CollateralStatus,DocumentType, ICollateral } from '../interfaces/collateral.interface';

const CollateralSchema = new Schema<ICollateral>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User"},
        documentType: { 
            type: String,
            enum: Object.values(DocumentType),
            required:true},
        file: { type: String, required:true },
        adminRemark: { type: String },
        status: { 
            type: String,
            enum: Object.values(CollateralStatus),
            default: CollateralStatus.PENDING }
    },
    { timestamps: true } 
);

export default model<ICollateral>("Collateral", CollateralSchema);

