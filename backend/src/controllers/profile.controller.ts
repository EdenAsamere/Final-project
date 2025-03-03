import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import userModel from "../models/user.model";
import collateralModel from "../models/collateral.model";


const profileService = new ProfileService();

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        const profile = await profileService.getUserProfile(userId);
        res.status(200).json({ message: "Profile retrieved successfully", data: profile });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving profile" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const profile = await profileService.updateProfile(userId, req.body);
        res.status(200).json({ message: "Profile updated successfully", data: profile });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error updating profile" });
    }
};

export const uploadCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
      
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
    
        const documentType = req.body.documentType;
        const file = req.file.path;
        if (!documentType) {
            res.status(400).json({ error: "Document type is required" });
            return;
        }
     
        const existingDocument = await collateralModel.findOne({ userId, documentType }).exec();
     
        if (existingDocument) {
            res.status(400).json({ error: `You have already uploaded a ${documentType}. You can only upload one.` });
            return;
        }

        const newDocument = await profileService.uploadCollateralDocument(userId, documentType, file);
        res.status(201).json({ message: "Collateral document uploaded successfully", data: newDocument });
    } catch (error) {
        console.log(error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: `Error uploading collateral document: ${errorMessage}` });
    }
};


export const rejectCollateral = async (req: Request, res: Response): Promise<void> => {
    try{
        const collateralId = req.params.id;
        const { adminRemark } = req.body;
        if (!collateralId) {
            res.status(400).json({ message: "Collateral ID is required" });
            return;
        }

        const collateral = await profileService.rejectCollateralDocument(collateralId, adminRemark);
        res.status(200).json({ message: "Collateral document rejected successfully", data: collateral });

    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : "Error rejecting collateral document" });
    }
};
export const getCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: "Collateral ID is required" });
            return;
        }

        const collateral = await profileService.getCollateralDocument(collateralId);
        res.status(200).json({ message: "Collateral document retrieved successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving collateral document" });
    }
};
export const getUserCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try{
        const {userId} = req.params;
        const loggedinuserId = (req as AuthRequest).user?.userId;
        const user = await userModel.findById(loggedinuserId).exec();
        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Only admins can see others collateral documents" });
            return;
        }
        const collateral = await profileService.getUserCollateralDocuments(userId);
        res.status(200).json({ message: "Collateral document retrieved successfully", data: collateral });
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving collateral document" });
    }
};

export const getMyCollateralDocuments = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        const collateral = await profileService.getMyCollateralDocuments(userId);
        console.log("collateral", collateral);
        res.status(200).json({ message: "Collateral document retrieved successfully", data: collateral });
    }
    catch(error){
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving collateral document" });
    }
};
    

export const verifyCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: "Collateral ID is required" });
            return;
        }

        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }

        const user = await userModel.findById(userId).exec();
        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Only admins can verify collateral documents" });
            return;
        }

        const collateral = await profileService.verifyCollateralDocument(collateralId);
        res.status(200).json({ message: "Collateral document verified successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error verifying collateral document" });
    }
};

export const getApprovedCollateralDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;

        const user = await userModel.findById(userId).exec();
        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Only admins can verify collateral documents" });
            return;
        }
        const collateral = await profileService.getApprovedCollateralDocuments();
        res.status(200).json({ message: "Approved collateral documents retrieved successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving approved collateral documents" });
    }
}
export const getPendingCollateralDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;

        const user = await userModel.findById(userId).exec();
        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Only admins can verify collateral documents" });
            return;
        }
        const collateral = await profileService.getPendingCollateralDocuments();
        res.status(200).json({ message: "Pending collateral documents retrieved successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving approved collateral documents" });
    }
}
export const getRejectedCollateralDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;

        const user = await userModel.findById(userId).exec();
        if (!user || user.role !== "Admin") {
            res.status(403).json({ message: "Forbidden: Only admins can verify collateral documents" });
            return;
        }
        const collateral = await profileService.getRejectedCollateralDocuments();
        res.status(200).json({ message: "Rejected collateral documents retrieved successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving approved collateral documents" });
    }
};
export const updateCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: "Collateral ID is required" });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "No file provided" });
            return;
        }

        console.log("Updating collateral file:", req.file.path);

        // Extract the uploaded file path
        const fileUrl = req.file.path; // Assuming multer stores file in `req.file.path`
        // Call service to update only the file
        const updatedCollateral = await profileService.updateCollateralDocument(collateralId, fileUrl);

        res.status(200).json({
            message: "Collateral document file updated successfully",
            data: updatedCollateral,
        });
        console.log("Updated Collateral File:", updatedCollateral);
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Error updating collateral document",
        });
    }
};


export const deleteCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: "Collateral ID is required" });
            return;
        }



        const collateral = await profileService.deleteCollateralDocument(collateralId);
        res.status(200).json({ message: "Collateral document deleted successfully", data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error deleting collateral document" });
    }

    
};

export const getIdverificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: "Unauthorized: User not found in token" });
            return;
        }
        const idVerification = await profileService.getIdverificationStatus(userId);
        res.status(200).json({ message: "ID verification status retrieved successfully", data: idVerification });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Error retrieving ID verification status" });
    }
}