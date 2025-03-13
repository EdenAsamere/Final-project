import { model, Schema } from 'mongoose';
import { IEqubGroupInterface } from '../interfaces/equbgroup.interface';

const contributionSchema = new Schema({
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
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['COMPLETED', 'FAILED'],
        required: true
    }
});

const equbGroupSchema = new Schema<IEqubGroupInterface>({
    group_name: { type: String, required: true },
    description: { type: String,required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, enum: ['private', 'hosted'], required: true },
    max_no_of_members :{type:Number, required:true}, 
    equbadmin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    previousWinners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cycleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    currentCycle: { type: Number },
    status: { type: String, enum: ['Active', 'Inactive'], required: true },
    joinRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    joinRequestStatus: { type: String, enum: ['pending', 'approved', 'rejected'] },
    contributions: [contributionSchema],
    contributionAmount: { type: Number, required: true },
    totalContribution: { type: Number, default: 0 },
    totalWinners: { type: Number, default: 0 },
    totalParticipants: { type: Number, default: 0 },
    totalWinnings: { type: Number, default: 0 },
    totalPenalties: { type: Number, default: 0 },
    totalWithdrawals: { type: Number, default: 0 },
    totalDeposits: { type: Number, default: 0 },
    
}, { timestamps: true });

export default model<IEqubGroupInterface>('Equbgroup', equbGroupSchema);