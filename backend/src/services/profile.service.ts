import profileModel from "../models/profile.model";
import collateralModel from "../models/collateral.model";
import IdVerification from '../models/idVerification.model';
import mongoose from "mongoose";

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
        file: string
    ) {
        const userProfile = await profileModel.findOne({ userId }).exec();
        console.log("userProfile", userProfile);
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const collateral = new collateralModel({
            userId,
            documentType,
            file,
            status: 'pending',
            verified: false,
        });
    
        await collateral.save();
        userProfile.collateraldocumentId.push(collateral.id);
        await userProfile.save();
        return collateral;
    }
    
    async updateCollateralDocument(collateralId: string, fileUrl: string) {
        const existingDocument = await collateralModel.findById(collateralId).exec();
        if (!existingDocument) {
            throw new Error("Collateral document not found");
        }
    
        if (!fileUrl) {
            throw new Error("No file URL provided for update");
        }
    
        const updatedCollateral = await collateralModel.findOneAndUpdate(
            { _id: collateralId },
            { $set: { file:fileUrl } }, // Only update the fileUrl field
            { new: true }
        ).exec();
    
        console.log("Updated Collateral File:", updatedCollateral);
        return updatedCollateral;
    }

    async getCollateralDocument(collateralId: string) {
        return await collateralModel.findById(collateralId).exec();
    }
    async getUserCollateralDocuments(userId: string) {
        return await collateralModel.find({ userId }).exec();
    };
    async getMyCollateralDocuments(userId: string) {
        console.log("userId", userId);
        return await collateralModel.find({ userId }).exec();
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

    async deleteCollateralDocument(collateralId: string, userId: string) {
        const collateral = await collateralModel.findById(collateralId).exec();
   
        if (!collateral) {
            throw new Error("Collateral document not found");
        }
    

        if (collateral.status === "approved") {
            throw new Error("Cannot delete an approved collateral document");
        }
    
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
    
        const collateralIndex = userProfile.collateraldocumentId.findIndex(id => 
            id.toString() === collateralId.toString()
        );
    
        if (collateralIndex === -1) {
            throw new Error("Collateral document not associated with this user");
        }
    
        userProfile.collateraldocumentId.splice(collateralIndex, 1);
        
      
        await userProfile.save();
        await collateral.deleteOne();
    
        return { message: "Collateral document deleted successfully" };
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

    async getIdverificationStatus(userId: String):Promise<any>{
        const userProfile = await profileModel.findOne({ userId
        }).exec();

        if (!userProfile) {
            throw new Error("User profile not found");
        }

        const verificationStatusofuser = await IdVerification.findOne({ userId: userProfile.userId }).exec();
        return verificationStatusofuser;
    }
}
