"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const profile_model_1 = __importDefault(require("../models/profile.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
class UserService {
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phoneNumber, password } = body;
            const user = yield user_model_1.default
                .findOne({ phoneNumber })
                .select('+password')
                .exec();
            if (!user) {
                throw new Error('Invalid username or password');
            }
            const isPasswordValid = yield bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid username or password');
            }
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, phoneNumber: user.phoneNumber, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
            return {
                token,
                user: {
                    _id: user._id,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    verified: user.verified,
                },
            };
        });
    }
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, phoneNumber, city, password, confirmPassword } = body;
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            const hashedPassword = yield bcrypt.hash(password, 10);
            const newUser = new user_model_1.default({
                phoneNumber: phoneNumber,
                password: hashedPassword,
                role: 'User',
                verified: false,
            });
            const savedUser = yield newUser.save();
            const newProfile = new profile_model_1.default({
                firstName,
                lastName,
                address: {
                    city,
                    region: '',
                    subcity: '',
                    kebele: '',
                    houseNumber: '',
                    woreda: '',
                    zone: '',
                },
                userId: savedUser._id,
                email: '',
                collateralDocuments: {
                    idCard: '',
                    thirdPartyIdCard: '',
                    bankStatement: '',
                    employmentLetter: '',
                    businessLicense: '',
                    other: '',
                },
                penality: {
                    penalityPoints: 0,
                    penalityReason: '',
                    penalityAmount: 0,
                },
            });
            yield newProfile.save();
            return savedUser;
        });
    }
}
exports.UserService = UserService;
