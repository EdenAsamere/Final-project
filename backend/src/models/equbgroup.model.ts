import { model, Schema } from 'mongoose';
import { IEqubGroupInterface } from '../interfaces/equbgroup.interface';

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
}, { timestamps: true });

export default model<IEqubGroupInterface>('Equbgroup', equbGroupSchema);