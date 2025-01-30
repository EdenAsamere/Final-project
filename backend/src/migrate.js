"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("./models/user.model"));
const profile_model_1 = __importDefault(require("./models/profile.model"));
const equbgroup_model_1 = __importDefault(require("./models/equbgroup.model"));
const equbevent_model_1 = __importDefault(require("./models/equbevent.model"));
const notification_model_1 = __importDefault(require("./models/notification.model"));
const transaction_model_1 = __importDefault(require("./models/transaction.model"));
dotenv_1.default.config(); // Load .env file
const MONGO_URI = process.env.MONGO_URI;
function migrate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(MONGO_URI);
            console.log('Connected to MongoDB');
            yield user_model_1.default.createCollection();
            yield profile_model_1.default.createCollection();
            yield equbgroup_model_1.default.createCollection();
            yield equbevent_model_1.default.createCollection();
            yield notification_model_1.default.createCollection();
            yield transaction_model_1.default.createCollection();
            console.log('Collections created successfully');
        }
        catch (error) {
            console.error('Error migrating collections', error);
        }
        finally {
            mongoose_1.default.disconnect();
            console.log('Disconnected from MongoDB');
        }
    });
}
migrate();
