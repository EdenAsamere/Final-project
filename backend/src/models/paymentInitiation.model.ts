// src/models/paymentInitiation.model.ts

import { Schema, model } from 'mongoose';
import { IPaymentInitiation, PaymentStatus } from '../interfaces/payment.interface';

const paymentInitiationSchema = new Schema<IPaymentInitiation>({
    equbId: {
        type: Schema.Types.ObjectId,
        ref: 'EqubGroup',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    txRef: {
        type: String,
        required: true,
        unique: true
    },
    blockchainTxHash: {
        type: String,
    },
    status: {
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    }


}, {
    timestamps: true 
});

const PaymentInitiation = model<IPaymentInitiation>('PaymentInitiation', paymentInitiationSchema);

export default PaymentInitiation;