import { Request, Response } from 'express';
import { EqubGroupService } from '../services/equbgroup.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import userModel from '../models/user.model';
import { UserType } from '../interfaces/user.interface';
import { EqubGroupType } from '../interfaces/equbgroup.interface';

const equbGroupService = new EqubGroupService();

export const createEqubGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const equbadminId = (req as AuthRequest).user?.userId;
        const userInfo = await userModel.findById(equbadminId).exec();
        if(!userInfo){
            res.status(400).json({ message: "User not found" });
            return;
        }
        if(!userInfo.Collateralverified){
            res.status(400).json({ message: "At least one collateral verification is required" });
            return;
        }
        if(!userInfo.Idverified){
            res.status(400).json({ message: "ID verification is required" });
            return;
        }

        const equbType = (req as AuthRequest).user?.role == UserType.ADMIN ? EqubGroupType.HOSTED : EqubGroupType.PRIVATE;
        const currentCycle = 1;
        if (!equbadminId) {
            res.status(403).json({ message: 'Unauthorized: Admin user not found in token' });
            return;
        }

        const equbGroup = await equbGroupService.createEqubGroup({ ...req.body, equbadmin: equbadminId,type:equbType,currentCycle });

        res.status(201).json({ message: 'Equb Group created successfully', data: equbGroup });
    } catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : 'Error creating Equb Group' });
    }
};

export const getEqubGroupsCreatedByMe = async (req: Request, res: Response):Promise<void> => {
    try {
        const equbadminId = (req as AuthRequest).user?.userId;
        console.log(equbadminId);

        if (!equbadminId) {
            res.status(403).json({ message: 'Unauthorized: Admin user not found in token' });
            return;
        }
        const userInfo = await userModel.findById(equbadminId).exec();
        if(!userInfo){
            res.status(400).json({ message: "User not found" });
            return;
        }
        if(!userInfo.Collateralverified){
            res.status(400).json({ message: "At least one collateral verification is required" });
            return;
        }
        if(!userInfo.Idverified){
            res.status(400).json({ message: "ID verification is required" });
            return;
        }

        const groups = await equbGroupService.getAllEqubGroupsCreatedByMe(equbadminId);
        res.status(200).json({ message: 'Equb Groups retrieved successfully', data: groups });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving Equb Groups' });
    }
};

export const getAllEqubGroups = async (res: Response):Promise<void> => {
    try {
        
        const groups = await equbGroupService.getAllEqubGroups();
        res.status(200).json({ message: 'Equb Groups retrieved successfully', data: groups });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving Equb Groups' });
    }
};


export const getEqubGroupById = async (req: Request, res: Response):Promise<void> => {
    try {
        const equbId = req.params.id;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        const groups = await equbGroupService.getEqubGroupsById(equbId);
        res.status(200).json({ message: 'Equb Group retrieved successfully', data: groups });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : 'Error retrieving Equb Groups' });
    }
};

export const updateEqubGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const equbId = req.params.id;
        const updateData = req.body;
        const userId = (req as AuthRequest).user?.userId;
        console.log(userId)
        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }

        const updatedGroup = await equbGroupService.updateEqubGroup(equbId, updateData, userId);
        res.status(200).json({ message: 'Equb Group updated successfully', data: updatedGroup });
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error updating Equb Group' });
    }
};

export const deleteEqubGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const equbId = req.params.id;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }

        const response = await equbGroupService.deleteEqubGroup(equbId, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error deleting Equb Group' });
    }
};


export const sendJoinRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;
        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        } 
      
        const response = await equbGroupService.SendJoinRequest(equbId, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error sending join request' });
    }
}

export const getJoinRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;
        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }
        const response = await equbGroupService.getJoinRequests(equbId, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting join requests' });
    }
}

export const approveJoinRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, userId } = req.body;
        const approverId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'User ID is required' });
            return;
        }   
        if (!approverId) {
            res.status(403).json({ message: 'Unauthorized: Approver not found in token' });
            return;
        }
        const response = await equbGroupService.approveJoinRequest(equbId, userId, approverId);
        res.status(200).json(response);
    } catch (error) {   
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error approving join request' });
    }
}   

export const rejectJoinRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, userId } = req.body;
        const rejecterId = (req as AuthRequest).user?.userId;           
    
        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }   
        if (!rejecterId) {
            res.status(403).json({ message: 'Unauthorized: Rejecter not found in token' });
            return;
        }
        const response = await equbGroupService.rejectJoinRequest(equbId, rejecterId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error rejecting join request' });
    }
}

export const getEqubGroupMembers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }   
        const response = await equbGroupService.getEqubGroupMembers(equbId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting equb group members' });
    }
}

export const getEqubGroupPreviousWinners = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }   
        const response = await equbGroupService.getEqubGroupPreviousWinners(equbId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting equb group previous winners' });
    }
}

export const getEqubGroupInformation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }
        const response = await equbGroupService.getEqubGroupInformation(equbId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting equb group information' });
    }
}

export const addMemberToGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, userId } = req.body;
        const adminId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        if (!adminId) {
            res.status(403).json({ message: 'Unauthorized: Admin not found in token' });
            return;
        }

        const response = await equbGroupService.addMemberToGroup(equbId, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error adding member to group' });
    }
}


export const removeMemberFromGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, userId } = req.body;
        const adminId = (req as AuthRequest).user?.userId;  

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }
        if (!adminId) {
            res.status(403).json({ message: 'Unauthorized: Admin not found in token' });
            return;
        }

        const response = await equbGroupService.removeMemberFromGroup(equbId, userId, adminId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error removing member from group' });
    }
}

export const leaveGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const response = await equbGroupService.leaveGroup(equbId, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error leaving group' });
    }
}

export const selectWinner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const adminId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!adminId) {
            res.status(403).json({ message: 'Unauthorized: Admin not found in token' });
            return;
        }

        const response = await equbGroupService.selectWinner(equbId, adminId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error selecting winner' });
    }
}

export const getCurrentWinner = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const response = await equbGroupService.getCurrentWinner(equbId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting current winner' });
    }
}

export const updateGroupStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, status } = req.body;
        const adminId = (req as AuthRequest).user?.userId;  

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!adminId) {
            res.status(403).json({ message: 'Unauthorized: Admin not found in token' });
            return;
        }

        const response = await equbGroupService.updateGroupStatus(equbId, status, adminId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error updating group status' });
    }
}


export const checkGroupProgress = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const response = await equbGroupService.checkGroupProgress(equbId);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error checking group progress' });
    }
}   

export const searchEqubGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const { searchCriteria } = req.body;
        const userId = (req as AuthRequest).user?.userId;

        if (!searchCriteria) {
            res.status(400).json({ message: 'Search criteria is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }

        const response = await equbGroupService.searchEqubGroups(searchCriteria);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error searching equb groups' });
    }
}


export const getActiveGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await equbGroupService.getActiveGroups();
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting active groups' });
    }
}

export const getCompletedGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await equbGroupService.getCompletedGroups();
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error getting completed groups' });
    }
}


export const savePaymentInitiation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { equbId, userId, amount, txRef, status } = req.body;
        const adminId = (req as AuthRequest).user?.userId;

        if (!equbId) {
            res.status(400).json({ message: 'Equb ID is required' });
            return;
        }
        if (!userId) {
            res.status(403).json({ message: 'Unauthorized: User not found in token' });
            return;
        }
        if (!adminId) {
            res.status(403).json({ message: 'Unauthorized: Admin not found in token' });
            return;
        }

        const response = await equbGroupService.savePaymentInitiation({equbId, userId, amount, txRef, status});
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error saving payment initiation' });
    }
}


export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { txRef } = req.body;
        const adminId = (req as AuthRequest).user?.userId;

        if (!txRef) {
            res.status(400).json({ message: 'Transaction reference is required' });
            return;
        }

        const response = await equbGroupService.verifyPayment(txRef);
        res.status(200).json(response);
    } catch (error) {
        res.status(403).json({ message: error instanceof Error ? error.message : 'Error verifying payment' });
    }
}





