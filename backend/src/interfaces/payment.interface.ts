// src/interfaces/payment.interface.ts

import { Types } from 'mongoose';

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

export interface IPaymentInitiation {
    equbId: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    txRef: string;
    blockchainTxHash: string;
    status: PaymentStatus;
    paymentMethod?: string;
    currency?: string;
    paymentDate?: Date;
    verificationDate?: Date;
    metadata?: Map<string, string>;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IContribution {
    userId: Types.ObjectId;
    amount: number;
    txRef: string;
    date: Date;
    status: 'COMPLETED' | 'FAILED';
}