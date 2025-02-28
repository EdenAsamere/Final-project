import profileModel from "../models/profile.model";
import collateralModel from "../models/collateral.model";

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
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const collateral = new collateralModel({
            documentType,
            file,
            status: 'pending',
            verified: false,
        });
    
        await collateral.save();
        userProfile.collateraldocumentId.push(collateral.id);
        await userProfile.save();
        return userProfile;
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

    async deleteCollateralDocument(collateralId: string) {
        const collateral = await collateralModel.findById(collateralId).exec();
        const collateralStatus = collateral?.status;
        if(collateralStatus == "approved"){
            throw new Error("Cannot delete an approved collateral document");
        }
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
