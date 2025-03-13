import { Document, Schema } from "mongoose";

export enum DocumentType {
    BANK_STATEMENT = 'Bank Statement',
    LAND_DEEDS = 'Land deeds',
    CAR_OWNERSHIP = 'Car ownership',
    HOUSE_OWNERSHIP = 'House ownership',
    BUSINESS_LICENSE = 'Business license',
    EMPLOYMENT_CONTRACT = 'Employment contract'
}

export enum CollateralStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export interface ICollateral extends Document {
    userId: Schema.Types.ObjectId;
    documentType: DocumentType;
    file: string;
    adminRemark: string;
    status: CollateralStatus;
}
