import EqubGroup from '../models/equbgroup.model';

export class EqubGroupService {
    async createEqubGroup(data: any) {
        if (!data.group_name || !data.startDate || !data.endDate || !data.cycleFrequency || !data.max_no_of_members ||!data.contributionAmount || !data.status || !data.description) {
            throw new Error('Missing required fields');
        }
        if (data.startDate > data.endDate) {
            throw new Error('Start date cannot be greater than end date');
        }
        const newGroup = new EqubGroup(data);
        await newGroup.save();
        return newGroup;
    }

    async getAllEqubGroupsCreatedByMe(adminId: string) {
        if (!adminId) {
            throw new Error('Admin ID is required');
        }
        const groups = await EqubGroup.find({ equbadmin: adminId });
        return groups;
    }
    
    async getAllEqubGroups() {
        const groups = await EqubGroup.find();
        return groups;
    }
    async getEqubGroupsById(equbId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }

        return group;
    }

    async updateEqubGroup(equbId: string, updateData: any, userId:string){
        const group = await EqubGroup.findById(equbId);

        if (!group) {
            throw new Error('Equb Group not found');
        }
        console.log(group.equbadmin.toString());
        if (group.equbadmin.toString() !== userId) {
            throw new Error('Unauthorized: Only the creator can update this group');
        }

        const updatedGroup = await EqubGroup.findByIdAndUpdate(equbId, updateData, { new: true, runValidators: true });

        return updatedGroup;
    }

    async deleteEqubGroup(equbId:string,userId:string){
        const group = await EqubGroup.findById(equbId);

        if (!group) {
            throw new Error('Equb Group not found');
        }

        if (group.equbadmin.toString() !== userId) {
            throw new Error('Unauthorized: Only the creator can delete this group');
        }

        await EqubGroup.findByIdAndDelete(equbId);
        return { message: 'Equb Group deleted successfully' };
    }
}

