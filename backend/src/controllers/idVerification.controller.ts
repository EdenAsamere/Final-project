import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import idVerificationModel from "../models/idVerification.model";
import { IdVerificationService } from "../services/idVerification.service";
import userModel from "../models/user.model";

const idVerificationService = new IdVerificationService();

export const uploadIdVerificationDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        if(!req.file){
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const idType = req.body.idType;
        const file = req.file.path;
        if (!idType) {
            res.status(400).json({ error: "id type is required" });
            return;
        }
        if (!file) {
            res.status(400).json({ error: "id Document file is required" });
            return;
        }

        const existingDocument = await idVerificationModel.findOne({ userId, idType }).exec();   
            if (existingDocument) {
                res.status(400).json({ error: `You have already uploaded a ${idType}. You can only upload one.` });
                return;
            }
        const result = await idVerificationService.uploadIdVerificationDocument(userId, idType, file);
        res.status(201).json({ message: "id document uploaded successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
}

export const uploadSelfie = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        if(!req.file){
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const file = req.file.path;
        if (!file) {
            res.status(400).json({ error: "Selfie file is required" });
            return;
        }
        const result = await idVerificationService.uploadSelfie(userId, file);
        res.status(201).json({ message: "Selfie uploaded successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}


export const submitIdVerificationDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        const result = await idVerificationService.submitIdVerificationDocument(userId);
        res.status(201).json({ message: "id document submitted successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}


export const approveIdVerificationDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const idVerificationId = req.params.id;
        if (!idVerificationId) {
            res.status(400).json({ message: "ID verification ID is required" });
            return;
        }
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
                if (!user || user.role !== "Admin") {
                    res.status(403).json({ message: "Forbidden: Only admins can verify id documents" });
                    return;
                }
        

        const result = await idVerificationService.approveIdVerificationDocument(idVerificationId);
        res.status(201).json({ message: "id document approved successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const rejectIdVerificationDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const idVerificationId = req.params.id;
        if (!idVerificationId) {
            res.status(400).json({ message: "ID verification ID is required" });
            return;
        }
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
                if (!user || user.role !== "Admin") {
                    res.status(403).json({ message: "Forbidden: Only admins can reject id documents" });
                    return;
                }
        

        const adminRemark = req.body.adminRemark;
        if (!adminRemark) {
            res.status(400).json({ message: "Admin remark is required" });
            return;
        }
        const result = await idVerificationService.rejectIdVerificationDocument(idVerificationId, adminRemark);
        res.status(201).json({ message: "id document rejected successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const deleteIdVerificationDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const idVerificationId = req.params.id;
        if (!idVerificationId) {
            res.status(400).json({ message: "ID verification ID is required" });
            return;
        }
        const result = await idVerificationService.deleteIdVerificationDocument(idVerificationId);
        res.status(201).json({ message: "id document deleted successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const getPendingIdVerificationDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
                if (!user || user.role !== "Admin") {
                    res.status(403).json({ message: "Forbidden: Only admins can get pending id documents" });
                    return;
                }
        
        const result = await idVerificationService.getPendingIdVerificationDocuments();
        res.status(200).json({ data: result });


    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}
     

export const getrejectedIdVerificationDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
                if (!user || user.role !== "Admin") {
                    res.status(403).json({ message: "Forbidden: Only admins can get rejected id documents" });
                    return;
                }
        
        const result = await idVerificationService.getRejectedIdVerificationDocuments();
        res.status(200).json({ data: result });


    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}


export const getApprovedIdVerificationDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
                if (!user || user.role !== "Admin") {
                    res.status(403).json({ message: "Forbidden: Only admins can get approved id documents" });
                    return;
                }
        
        const result = await idVerificationService.getApprovedIdVerificationDocuments();
        res.status(200).json({ data: result });


    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

export const reuploadDocumentafterRejection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        if(!req.file){
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const idType = req.body.idType;
        const idDocument = req.file.path;
        if (!idType) {
            res.status(400).json({ error: "id type is required" });
            return;
        }
        if (!idDocument) {
            res.status(400).json({ error: "id Document file is required" });
            return;
        }
        const result = await idVerificationService.reuploadDocumentafterRejection(userId, idType, idDocument);
        res.status(201).json({ message: "id document reuploaded successfully", data: result });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
}

