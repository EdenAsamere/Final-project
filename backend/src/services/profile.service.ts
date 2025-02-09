import profileModel from "../models/profile.model";
import collateralModel from "../models/collateral.model";
import { ICollateral } from "../interfaces/collateral.interface";
import { IProfile } from "../interfaces/profile.interface";

export class ProfileService {
    async getUserProfile(userId: string){
        return await profileModel.findOne({ userId }).exec();
    }

    async updateProfile(userId: string, updateData: any) {
        return await profileModel.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { new: true }
        ).exec();
    }

    async uploadCollateralDocument(
        userId: string,
        documentType: string,
        documentUrl: string
    ) {
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
    
        // Save the collateral document
        const collateral = new collateralModel({
            documentType,
            documentUrl,
            status: 'pending',
            verified: false,
        });
    
        await collateral.save();
    
        // Link to user profile
        userProfile.collateraldocumentId.push(collateral.id);
        await userProfile.save();
    
        return userProfile;
    }
    

    async getCollateralDocument(collateralId: string) {
        return await collateralModel.findById(collateralId).exec();
    }
    async getUserCollateralDocuments(userId: string) {
        return await collateralModel.find({ userId }).exec();
    };
    async getMyCollateralDocuments(userId: string) {
        return await collateralModel.find({ userId }).exec();
    };
   
    async updateCollateralDocument(collateralId: string, updateData: any) {
        return await collateralModel.findOneAndUpdate(
            { _id: collateralId },
            { $set: updateData },
            { new: true }
        ).exec();
    };

    async getRejectedCollateralDocuments() {
        return await collateralModel.find({ status: 'rejected' }).exec();
    }
    async getApprovedCollateralDocuments() {
        return await collateralModel.find({ status: 'approved' }).exec();
    }
    async getPendingCollateralDocuments() {
        return await collateralModel.find({ status: 'pending' }).exec();
    }
   

    async verifyCollateralDocument(collateralId: string) {
        return await collateralModel.findOneAndUpdate(
            { _id: collateralId },
            { $set: { verified: true, status: 'approved' } },
            { new: true }
        ).exec();
    }
    
    async rejectCollateralDocument(collateralId: string, adminRemark: string) {
        return await collateralModel.findOneAndUpdate(
            { _id: collateralId },
            { $set: { verified: false, status: 'rejected', adminRemark } },
            { new: true }
        ).exec();
    };

    async deleteCollateralDocument(collateralId: string) {
        const collateral = await collateralModel.findById(collateralId).exec();
        
        if (!collateral) {
            return null;
        }
        await collateral.deleteOne();
    
        return collateral;
    }

    async addPenality(
        userId: string,
        penalityPoints: number,
        penalityReason: string,
        penalityAmount: number
    ){
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }

        userProfile.penality.penalityPoints = penalityPoints;
        userProfile.penality.penalityReason = penalityReason;
        userProfile.penality.penalityAmount = penalityAmount;
        await userProfile.save();

        return userProfile;
    }

    async getPenalityDetails(userId: string){
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }

        return {
            penalityPoints: userProfile.penality.penalityPoints,
            penalityReason: userProfile.penality.penalityReason,
            penalityAmount: userProfile.penality.penalityAmount,
        };
    }

    async updatePenalityDetails(userId: string, updateData: any): Promise<void> {
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const { penalityPoints, penalityReason, penalityAmount } = updateData;
        userProfile.penality.penalityPoints = penalityPoints;
        userProfile.penality.penalityReason = penalityReason;
        userProfile.penality.penalityAmount = penalityAmount;

        await userProfile.save();
    }
}
