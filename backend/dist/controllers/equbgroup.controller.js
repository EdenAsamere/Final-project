"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEqubGroup = exports.updateEqubGroup = exports.getEqubGroupById = exports.getAllEqubGroups = exports.createEqubGroup = void 0;
const equbgroup_model_1 = __importDefault(require("../models/equbgroup.model"));
const mongoose_1 = __importDefault(require("mongoose"));
// Create Equb Group
const createEqubGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_name, description, payout_Schedule, type, admin, cycleFrequency, currentCycle, totalCycles, status } = req.body;
        if (!group_name || !payout_Schedule || !type || !admin || !cycleFrequency || !currentCycle || !totalCycles || !status) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(admin)) {
            res.status(400).json({ message: 'Invalid admin ID' });
            return;
        }
        const newGroup = new equbgroup_model_1.default({ group_name, description, payout_Schedule, type, admin, cycleFrequency, currentCycle, totalCycles, status });
        yield newGroup.save();
        res.status(201).json({ message: 'Equb Group created successfully', data: newGroup });
    }
    catch (error) {
        console.error('Error creating Equb Group:', error);
        res.status(500).json({ message: 'Error creating Equb Group', error: error instanceof Error ? error.message : error });
    }
});
exports.createEqubGroup = createEqubGroup;
// Get all Equb Groups
const getAllEqubGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groups = yield equbgroup_model_1.default.find().populate('admin', 'name email').populate('members', 'name email').populate('previousWinners', 'name email');
        res.status(200).json({ message: 'Equb Groups retrieved successfully', data: groups });
    }
    catch (error) {
        console.error('Error retrieving Equb Groups:', error);
        res.status(500).json({ message: 'Error retrieving Equb Groups', error: error instanceof Error ? error.message : error });
    }
});
exports.getAllEqubGroups = getAllEqubGroups;
// Get a single Equb Group by ID
const getEqubGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }
        const group = yield equbgroup_model_1.default.findById(id).populate('admin', 'name email').populate('members', 'name email').populate('previousWinners', 'name email');
        if (!group) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }
        res.status(200).json({ message: 'Equb Group retrieved successfully', data: group });
    }
    catch (error) {
        console.error('Error retrieving Equb Group:', error);
        res.status(500).json({ message: 'Error retrieving Equb Group', error: error instanceof Error ? error.message : error });
    }
});
exports.getEqubGroupById = getEqubGroupById;
// Update an Equb Group by ID
const updateEqubGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }
        const updatedGroup = yield equbgroup_model_1.default.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedGroup) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }
        res.status(200).json({ message: 'Equb Group updated successfully', data: updatedGroup });
    }
    catch (error) {
        console.error('Error updating Equb Group:', error);
        res.status(500).json({ message: 'Error updating Equb Group', error: error instanceof Error ? error.message : error });
    }
});
exports.updateEqubGroup = updateEqubGroup;
// Delete an Equb Group by ID
const deleteEqubGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid Equb Group ID' });
            return;
        }
        const deletedGroup = yield equbgroup_model_1.default.findByIdAndDelete(id);
        if (!deletedGroup) {
            res.status(404).json({ message: 'Equb Group not found' });
            return;
        }
        res.status(200).json({ message: 'Equb Group deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting Equb Group:', error);
        res.status(500).json({ message: 'Error deleting Equb Group', error: error instanceof Error ? error.message : error });
    }
});
exports.deleteEqubGroup = deleteEqubGroup;
