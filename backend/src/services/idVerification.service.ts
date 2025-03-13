import IdVerification from '../models/idVerification.model';
import profileModel from "../models/profile.model";
import { IdType, VerificationStatus } from '../interfaces/idVerfication.interface';
import userModel from '../models/user.model';
export class IdVerificationService {
    async uploadIdVerificationDocument(
        userId: string,
        idType: string,
        idDocument: string,
    ){
        const userProfile = await profileModel.findOne({ userId
        }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const idVerification = new IdVerification({
            userId,
            idType,
            idDocument,
            selfie: '',
            adminRemark: '',
            verified: false
        });

        await idVerification.save();
        userProfile.idVerificationId = idVerification.id;
        await userProfile.save();
        return idVerification;
    }

    async uploadSelfie(userId: string, selfie: string) {
        const userProfile = await profileModel.findOne({ userId
        }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const idVerification = await IdVerification.findOne({ userId }).exec();
        if (!idVerification) {
            throw new Error("ID verification not found");
        }
        idVerification.selfie = selfie;
        await idVerification.save();
        return idVerification;
 
    }

    async submitIdVerificationDocument(userId: string) {
        const idVerification = await IdVerification.findOne({ userId }).exec();
        if (!idVerification) {
            throw new Error("ID verification not found");
        }
        idVerification.status = VerificationStatus.PENDING; ;
        await idVerification.save();
        return idVerification;
    }


    async approveIdVerificationDocument(idVerificationId: string, idOwner: string) {
        
        const updatedIdVerification = await IdVerification.findOneAndUpdate(
            { _id: idVerificationId },
            { $set: { verified: true, status: VerificationStatus.APPROVED } },
            { new: true }
        ).exec();
        const user = await userModel.findOne({ userId: idOwner }).exec();
        if(user){
            user.Idverified = true;
            await user.save();
        }
        return updatedIdVerification;

    };

    async rejectIdVerificationDocument(idVerificationId: string, adminRemark: string) {
        return await IdVerification.findOneAndUpdate(
            { _id: idVerificationId },
            { $set: { verified: false, status: VerificationStatus.REJECTED, adminRemark } },
            { new: true }
        ).exec();
    };

    async deleteIdVerificationDocument(idVerificationId: string) {
        const idVerification = await IdVerification.findById
        (idVerificationId).exec();
        const idVerificationStatus = idVerification?.status;
        if(idVerificationStatus == VerificationStatus.APPROVED){
            throw new Error("Cannot delete an approved ID verification document");
        }
        if (!idVerification) {
            return null;
        }
        await idVerification.deleteOne();
        return idVerification;
    }

    async getApprovedIdVerificationDocuments() {
        return await IdVerification.find({ status: VerificationStatus.APPROVED }).exec();
    }

    async getPendingIdVerificationDocuments() {
        return await IdVerification.find({ status: VerificationStatus.PENDING }).exec();
    }

    async getRejectedIdVerificationDocuments() {
        return await IdVerification.find({ status: VerificationStatus.REJECTED }).exec();
    }

    async reuploadDocumentafterRejection(userId: string, idType: IdType, idDocument: string) {
        const userProfile = await profileModel.findOne({ userId }).exec();
        if (!userProfile) {
            throw new Error("User profile not found");
        }
        const idVerification = await IdVerification.findOne({ userId }).exec();
        if (!idVerification) {
            throw new Error("ID verification not found");
        }
        if (idVerification.status == VerificationStatus.REJECTED) {
            idVerification.idType = idType;
            idVerification.idDocument = idDocument;
            idVerification.selfie = '';
            idVerification.status = VerificationStatus.PENDING;
            await idVerification.save();
            return idVerification;
        }
        throw new Error("ID verification not rejected");
    }

    async reuploadDocumentBeforeSubmission(userId: string, idType: IdType, idDocument: string) {
        const userProfile = await profileModel.findOne({ userId
        }).exec();

        if (!userProfile) {
            throw new Error("User profile not found");
        }

        const idVerification = await IdVerification.findOne({ userId }).exec();
        if (!idVerification) {
            throw new Error("ID verification not found");
        }
        idVerification.idType = idType;
        idVerification.idDocument = idDocument;
        await idVerification.save();
        return idVerification;
    }
}
