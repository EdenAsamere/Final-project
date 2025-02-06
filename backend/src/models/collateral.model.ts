import {Schema, model } from 'mongoose';
import { ICollateral } from '../interfaces/collateral.interface';

const collateralSchema = new Schema<ICollateral>({
    documentType: { type: String, required: true },  
    documentUrl: { type: String, required: true },  
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }     
}

, { timestamps: true });

export default model<ICollateral>('Collateral', collateralSchema);
