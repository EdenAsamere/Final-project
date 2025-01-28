import mongoose from "mongoose";

import User  from "./models/user.model";
import Profile  from "./models/profile.model";
import EqubGroup from "./models/equbgroup.model";
import EqubEvent from "./models/equbevent.model";
import Notification from "./models/notification.model";
import Transaction from "./models/transaction.model";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/equb';

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI);


        console.log('Connected to MongoDB');

        await User.createCollection();
        await Profile.createCollection();
        await EqubGroup.createCollection();
        await EqubEvent.createCollection();
        await Notification.createCollection();
        await Transaction.createCollection();

        console.log('Collections created successfully');
    } catch (error) {
        console.error('Error migrating collections', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

migrate();