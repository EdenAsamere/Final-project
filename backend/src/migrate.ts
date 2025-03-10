import mongoose from "mongoose";
import dotenv from "dotenv";

import User  from "./models/user.model";
import Profile  from "./models/profile.model";
import EqubGroup from "./models/equbgroup.model";
import EqubEvent from "./models/equbevent.model";
import Notification from "./models/notification.model";
import Transaction from "./models/transaction.model";
import collateralModel from "./models/collateral.model";

dotenv.config(); // Load .env file
const MONGO_URI = process.env.MONGO_URI ;

async function migrate() {
    try {
        await mongoose.connect(MONGO_URI as string);


        console.log('Connected to MongoDB');

        await User.createCollection();
        await Profile.createCollection();
        await EqubGroup.createCollection();
        await EqubEvent.createCollection();
        await Notification.createCollection();
        await Transaction.createCollection();
        await collateralModel.createCollection();

        console.log('Collections created successfully');
    } catch (error) {
        console.error('Error migrating collections', error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

migrate();