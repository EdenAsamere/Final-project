import { Schema,Document } from "mongoose";
export interface ItransactionInterface extends Document {
    equbgroupId: Schema.Types.ObjectId; 
    senderId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId
    amount: number;
    transactionType: 'contribution' | 'payout';
    status: 'pending' | 'completed' | 'failed';
}
