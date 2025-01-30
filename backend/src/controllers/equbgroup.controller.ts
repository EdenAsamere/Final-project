import { Request, Response } from 'express';
import { EqubGroupService } from '../services/equbgroup.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const equbGroupService = new EqubGroupService();

export const createEqubGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const equbadminId = (req as AuthRequest).user?.userId;
        const equbType = (req as AuthRequest).user?.role == 'Admin' ? 'hosted' : 'private';
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



