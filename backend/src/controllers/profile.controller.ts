import { Request,Response } from "express";
import { ProfileService } from "../services/profile.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import userModel from '../models/user.model'; // Import the User model

const profileService = new ProfileService();

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const profile = await profileService.getUserProfile(userId);
        res.status(200).json({ message: 'Profile retrieved successfully', data: profile });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving profile' });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const profile = await profileService.updateProfile(userId, req.body);
        res.status(200).json({ message: 'Profile updated successfully', data: profile });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error updating profile' });
    }
};

export const uploadCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const { documentType, documentUrl } = req.body;
        const profile = await profileService.uploadCollateralDocument(userId, documentType, documentUrl);
        res.status(201).json({ message: 'Collateral document uploaded successfully', data: profile });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error uploading collateral document' });
    }

}

export const getCollateralDocument = async (req: Request, res: Response): Promise<void> => {   
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: 'Collateral ID is required' });
            return;
        }

        const collateral = await profileService.getCollateralDocument(collateralId);
        res.status(200).json({ message: 'Collateral document retrieved successfully', data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving collateral document' });
    }
}


export const verifyCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: 'Collateral ID is required' });
            return;
        }

        const userId = (req as AuthRequest).user?.userId;
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const user = await userModel.findById(userId).exec();
        if (!user || user.role !== 'Admin') {
            res.status(403).json({ message: 'Forbidden: Only admins can verify collateral documents' });
            return;
        }

        const collateral = await profileService.verifyCollateralDocument(collateralId);
        res.status(200).json({ message: 'Collateral document verified successfully', data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error verifying collateral document' });
    }
}


export const deleteCollateralDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const collateralId = req.params.id;
        if (!collateralId) {
            res.status(400).json({ message: 'Collateral ID is required' });
            return;
        }

        const collateral = await profileService.deleteCollateralDocument(collateralId);
        res.status(200).json({ message: 'Collateral document deleted successfully', data: collateral });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error deleting collateral document' });
    }
}
