import { Schema, Document } from "mongoose";
export interface IEqubGroupInterface extends Document {
    group_name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: 'private' | 'hosted';
    equbadmin: Schema.Types.ObjectId; 
    max_no_of_members: number;
    members: Schema.Types.ObjectId[];
    previousWinners: Schema.Types.ObjectId[]; 
    cycleFrequency: 'daily' | 'weekly' | 'monthly';
    currentCycle: number;
    status: 'active' | 'completed';
}