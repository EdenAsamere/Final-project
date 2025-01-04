import { Schema } from "mongoose";

export interface IEqubEvent {
    equbgroupId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
    eventType: string;
    date: Date;
    description?: string;
    status: 'upcoming' | 'completed' | 'cancelled';
}

