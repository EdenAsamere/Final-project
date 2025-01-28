import UserModel  from '../models/user.model';
import  ProfileModel  from '../models/profile.model';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

export class UserService {
    async login(body: { phoneNumber: string; password: string }): Promise<any> {
        const { phoneNumber, password } = body;

        const user = await UserModel
            .findOne({ phoneNumber })
            .select('+password')
            .exec();

        if (!user) {

            throw new Error('Invalid username or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error('Invalid username or password');
        }
        const JWT_SECRET = process.env.JWT_SECRET
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const token = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
          );
      

        return {
            token,
            user: {
                _id: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role,
                verified: user.verified,
            },
    }
    }


    async register(body: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        city: string;
        password: string;
        confirmPassword: string;
    }): Promise<any> {
        const { firstName, lastName, phoneNumber, city, password, confirmPassword } = body;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            phoneNumber: phoneNumber, 
            password: hashedPassword,
            role: 'User',
            verified: false, 
        });

        const savedUser = await newUser.save();
        const newProfile = new ProfileModel({
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
            email:'',
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


        await newProfile.save();

        return savedUser;
    }
}