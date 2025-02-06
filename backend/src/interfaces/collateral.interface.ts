import { Document } from "mongoose";
export interface ICollateral extends Document {
    documentType: string;
    documentUrl: string;
    uploadedAt: Date;
    verified: boolean;
}
