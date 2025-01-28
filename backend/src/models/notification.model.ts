import { Schema, model } from 'mongoose';
import { INotification } from '../interfaces/notification.interface';

const notificationSchema = new Schema<INotification>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['deadline', 'payout', 'reminder', 'announcement'], required: true },
    seen: { type: Boolean, default: false },
}, { timestamps: true });

export default model<INotification>('Notification', notificationSchema);