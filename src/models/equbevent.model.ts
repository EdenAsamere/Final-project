import { Schema, model } from 'mongoose';
import { IEqubEvent } from '../interfaces/equbevent.interface';

const equbEventSchema = new Schema<IEqubEvent>({
    equbgroupId: { type: Schema.Types.ObjectId, ref: 'Equbgroup', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], required: true },
}, { timestamps: true });


export default model<IEqubEvent>('EqubEvent', equbEventSchema);