import { Document, Schema } from "mongoose";
export interface ICollateral extends Document {
    userId: Schema.Types.ObjectId;
    documentType: 'Bank Statment'|'Land deeds'|'Car ownership'|'House ownership'|'Business license'|'Employment contract';
    documentUrl: string;
    adminRemark: string;
    status: 'pending' | 'approved' | 'rejected';
    verified: boolean;
}
