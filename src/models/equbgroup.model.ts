import { model, Schema } from 'mongoose';
import { IEqubGroupInterface } from '../interfaces/equbgroup.interface';

const equbGroupSchema = new Schema<IEqubGroupInterface>({
    group_name: { type: String, required: true },
    description: { type: String },
    payout_Schedule: { type: Date, required: true },
    type: { type: String, enum: ['private', 'hosted'], required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    previousWinners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cycleFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    currentCycle: { type: Number, required: true },
    totalCycles: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], required: true },
}, { timestamps: true });

export default model<IEqubGroupInterface>('Equbgroup', equbGroupSchema);