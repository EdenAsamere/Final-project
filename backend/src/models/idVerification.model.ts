import { Schema, model } from 'mongoose';
import { IIdVerification, IdType, VerificationStatus } from '../interfaces/idVerfication.interface';

const IdVerificationSchema = new Schema<IIdVerification>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      unique: true 
    },
    idType: { 
      type: String, 
      enum: Object.values(IdType),
      required: true
    },
    frontidDocument: {
      type: String,
      required: true
    },
    backidDocument: {
      type: String,
      required: true
    },
    selfie: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(VerificationStatus),
    },
    adminRemark: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default model<IIdVerification>('IdVerification', IdVerificationSchema);