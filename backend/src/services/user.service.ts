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
            { expiresIn: "24h" }
          );
      

        return {
            token,
            user: {
                _id: user._id,
                phoneNumber: user.phoneNumber,
                role: user.role,
                idverified: user.Idverified,
                collateralVerified: user.Collateralverified,
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
        const { firstName, lastName, phoneNumber, city, password, confirmPassword} = body;
      
      
        // Check for existing user
        const existingUser = await UserModel.findOne({ phoneNumber });
        if (existingUser) {
          throw new Error('Phone number already registered');
        }
      
        // Password validation
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
      
        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
          phoneNumber,
          password: hashedPassword,
          role: 'User',
          Idverified : false,
          Collateralverified : false,
        });
        
      
        const savedUser = await newUser.save();
      
        // Create profile
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
          email: '',
          collateraldocumentId: [], // Correct field name
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