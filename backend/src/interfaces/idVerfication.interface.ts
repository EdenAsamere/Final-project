import { Document, Schema } from "mongoose";

export enum IdType {
  NATIONAL_ID = 'National ID',
  PASSPORT = 'Passport',
  DRIVER_LICENSE = 'Driver License'
}

export enum VerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface IIdVerification extends Document {
  userId: Schema.Types.ObjectId;
  idType: IdType;
  idDocument: string;
  selfie: string;
  status: VerificationStatus;
  adminRemark: string;
  verified: boolean;
}