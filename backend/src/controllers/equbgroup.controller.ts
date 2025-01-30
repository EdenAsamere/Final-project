import { Request, Response } from 'express';
import EqubGroup from '../models/equbgroup.model';
import mongoose from 'mongoose';

// Create Equb Group
export const createEqubGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { group_name, description, payout_Schedule, type, admin, cycleFrequency, currentCycle, totalCycles, status } = req.body;

        if (!group_name || !payout_Schedule || !type || !admin || !cycleFrequency || !currentCycle || !totalCycles || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(admin)) {
            res.status(400).json({ message: 'Invalid admin ID' });
            return;
        }

        const newGroup = new EqubGroup({ group_name, description, payout_Schedule, type, admin, cycleFrequency, currentCycle, totalCycles, status });
        await newGroup.save();

        res.status(201).json({ message: 'Equb Group created successfully', data: newGroup });
    } catch (error) {
        console.error('Error creating Equb Group:', error);
        res.status(500).json({ message: 'Error creating Equb Group', error: error instanceof Error ? error.message : error });
    }
};

// Get all Equb Groups
export const getAllEqubGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const groups = await EqubGroup.find().populate('admin', 'name email').populate('members', 'name email').populate('previousWinners', 'name email');
        res.status(200).json({ message: 'Equb Groups retrieved successfully', data: groups });
    } catch (error) {
        console.error('Error retrieving Equb Groups:', error);
        res.status(500).json({ message: 'Error retrieving Equb Groups', error: error instanceof Error ? error.message : error });
    }
};

// Get a single Equb Group by ID
export const getEqubGroupById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }

        const group = await EqubGroup.findById(id).populate('admin', 'name email').populate('members', 'name email').populate('previousWinners', 'name email');

        if (!group) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }

        res.status(200).json({ message: 'Equb Group retrieved successfully', data: group });
    } catch (error) {
        console.error('Error retrieving Equb Group:', error);
        res.status(500).json({ message: 'Error retrieving Equb Group', error: error instanceof Error ? error.message : error });
    }
};

// Update an Equb Group by ID
export const updateEqubGroup = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }

        const updatedGroup = await EqubGroup.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

        if (!updatedGroup) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }

        res.status(200).json({ message: 'Equb Group updated successfully', data: updatedGroup });
    } catch (error) {
        console.error('Error updating Equb Group:', error);
        res.status(500).json({ message: 'Error updating Equb Group', error: error instanceof Error ? error.message : error });
    }
};

// Delete an Equb Group by ID
export const deleteEqubGroup = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }

        const deletedGroup = await EqubGroup.findByIdAndDelete(id);

        if (!deletedGroup) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }

        res.status(200).json({ message: 'Equb Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting Equb Group:', error);
        res.status(500).json({ message: 'Error deleting Equb Group', error: error instanceof Error ? error.message : error });
    }
};
