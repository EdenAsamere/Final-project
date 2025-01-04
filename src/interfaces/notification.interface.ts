import { Schema } from "mongoose";

export interface INotification extends Document {
    userId: Schema.Types.ObjectId; // Reference to User
    message: string;
    type: "deadline" | "payout" | "reminder" | "announcement";
    seen: boolean;
  }
