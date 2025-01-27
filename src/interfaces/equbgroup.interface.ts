import { Schema, Document } from "mongoose";
export interface IEqubGroupInterface extends Document {
    group_name: string;
    description: string;
    payout_Schedule: Date;
    type: 'private' | 'hosted';
    admin: Schema.Types.ObjectId; 
    members: Schema.Types.ObjectId[];
    previousWinners: Schema.Types.ObjectId[]; 
    cycleFrequency: 'daily' | 'weekly' | 'monthly';
    currentCycle: number;
    totalCycles: number;
    status: 'active' | 'completed';
}