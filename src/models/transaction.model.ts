import { Schema, model } from 'mongoose';
import { ItransactionInterface } from '../interfaces/transaction.interface';

const transactionSchema = new Schema<ItransactionInterface>({
    equbgroupId: { type: Schema.Types.ObjectId, ref: 'Equbgroup', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['contribution', 'payout'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
}, { timestamps: true });


export default model<ItransactionInterface>('Transaction', transactionSchema);