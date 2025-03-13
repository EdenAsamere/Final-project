import { Schema, Document } from "mongoose";

export enum EqubGroupType {
    PRIVATE = 'private',
    HOSTED = 'hosted'
}

export enum EqubGroupStatus {
    ACTIVE = 'active',
    COMPLETED = 'completed'
}

export enum JoinRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export enum CycleFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export enum EventType {
    WINNER_SELECTION = 'winner_selection',
    PAYMENT = 'payment',
    WITHDRAWAL = 'withdrawal',
    DEPOSIT = 'deposit',
    PENALTY = 'penalty',
    OTHER = 'other'
}

export enum EventStatus {
    UPCOMING = 'upcoming',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}









export interface IEqubGroupInterface extends Document {
    group_name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    type: EqubGroupType;
    equbadmin: Schema.Types.ObjectId; 
    max_no_of_members: number;
    members: Schema.Types.ObjectId[];
    previousWinners: Schema.Types.ObjectId[]; 
    cycleFrequency: CycleFrequency;
    currentCycle: number;
    status: EqubGroupStatus;
    joinRequests: Schema.Types.ObjectId[];
    joinRequestStatus: JoinRequestStatus; 
    contributions: {
        userId: Schema.Types.ObjectId;
        amount: number;
        txRef: string;
        date: Date;
        status: string;
    }[];
    contributionAmount: number;
    totalContribution: number;
    totalWinners: number;
    totalParticipants: number;
    totalWinnings: number;
    totalPenalties: number;
    totalWithdrawals: number;
    totalDeposits: number;
}