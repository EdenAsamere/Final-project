import mongoose, { Types } from 'mongoose';
import EqubGroup from '../models/equbgroup.model';
import { EqubGroupStatus, JoinRequestStatus } from '../interfaces/equbgroup.interface';
import PaymentInitiation from '../models/paymentInitiation.model';
import { any } from 'zod';
import { PaymentStatus } from '../interfaces/payment.interface';
import userModel from '../models/user.model';

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

    async SendJoinRequest(equbId:string,userId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        if(!user.Idverified){
            throw new Error('You must verify your ID to join a group');
        }

        if(!user.Collateralverified){
            throw new Error('You must verify your collateral to join a group');
        }
        const owner = group.equbadmin.toString();
        const isMember = group.members.map(id => id.toString()).includes(userId);
        if(isMember){
            throw new Error('You are already a member of this group');
        }


        if(owner === userId){
            throw new Error('You cannot send a join request to your own group');
        }
        
        if(group.joinRequests.map(id => id.toString()).includes(userId)){
            throw new Error('You have already sent a join request');
        }
        group.joinRequests.push(userId as any);
        await group.save();
        return { message: 'Join request sent successfully' };
    }   

    async getJoinRequests(equbId:string, userId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        if(group.equbadmin.toString() !== userId){
            throw new Error('Unauthorized: Only the creator can view join requests');
        }
        return group.joinRequests;
    }

        async approveJoinRequest(equbId:string,userId:string,approverId:string){
            const group = await EqubGroup.findById(equbId);
            if (!group) {
                throw new Error('Equb Group not found');
            }
            if(group.equbadmin.toString() !== approverId){
                throw new Error('Unauthorized: Only the creator can approve join requests');
            }
        group.joinRequests = group.joinRequests.filter(id => id.toString() !== userId);
        group.joinRequestStatus = JoinRequestStatus.APPROVED;
        group.members.push(userId as any);
        await group.save();
        return { message: 'Join request approved successfully' };
    }

    async rejectJoinRequest(equbId:string,rejecterId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        if(group.equbadmin.toString() !== rejecterId){
            throw new Error('Unauthorized: Only the creator can reject join requests');
        }
        
        group.joinRequestStatus = JoinRequestStatus.REJECTED;
        await group.save();
        return { message: 'Join request rejected successfully' };
    }


    async getEqubGroupMembers(equbId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        return group.members;
    }

    async getEqubGroupPreviousWinners(equbId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        return group.previousWinners;
    }

    async getEqubGroupInformation(equbId:string){
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        return group;
    }

    async addMemberToGroup(equbId: string, userId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        // Check if user is already a member
        if (group.members.includes(userId as any)) {
            throw new Error('User is already a member of this group');
        }
        
        // Check if group is full
        if (group.members.length >= group.max_no_of_members) {
            throw new Error('Group has reached maximum number of members');
        }
        
        group.members.push(userId as any);
        await group.save();
        return { message: 'Member added successfully' };
    }

    async removeMemberFromGroup(equbId: string, userId: string, adminId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        // Check if requester is admin
        if (group.equbadmin.toString() !== adminId) {
            throw new Error('Unauthorized: Only the creator can remove members');
        }
        
        // Check if user is a member
        if (!group.members.includes(userId as any)) {
            throw new Error('User is not a member of this group');
        }
        
        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();
        return { message: 'Member removed successfully' };
    }

    async leaveGroup(equbId: string, userId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        // Check if user is a member
        if (!group.members.includes(userId as any)) {
            throw new Error('User is not a member of this group');
        }
        
        group.members = group.members.filter(id => id.toString() !== userId);
        await group.save();
        return { message: 'Left group successfully' };
    }

    async selectWinner(equbId: string, adminId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        // Check if requester is admin
        if (group.equbadmin.toString() !== adminId) {
            throw new Error('Unauthorized: Only the creator can select winners');
        }
        
        // Get eligible members (members who haven't won yet)
        const eligibleMembers = group.members.filter(member => 
            !group.previousWinners.includes(member));
        
        if (eligibleMembers.length === 0) {
            throw new Error('No eligible members for winning');
        }
        
        // Randomly select a winner
        const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
        const winner = eligibleMembers[randomIndex];
        
        group.previousWinners.push(winner);
        await group.save();
        
        return { 
            message: 'Winner selected successfully',
            winner: winner 
        };
    }

    async getCurrentWinner(equbId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        if (group.previousWinners.length === 0) {
            return { message: 'No winner has been selected yet' };
        }
        
        return {
            currentWinner: group.previousWinners[group.previousWinners.length - 1]
        };
    }

    async updateGroupStatus(equbId: string, status: string, adminId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        // Check if requester is admin
        if (group.equbadmin.toString() !== adminId) {
            throw new Error('Unauthorized: Only the creator can update group status');
        }
        
        group.status = EqubGroupStatus as any; 
        await group.save();
        return { 
            message: 'Group status updated successfully',
            newStatus: status 
        };
    }

    async checkGroupProgress(equbId: string) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb Group not found');
        }
        
        return {
            totalMembers: group.members.length,
            maxMembers: group.max_no_of_members,
            winnersCount: group.previousWinners.length,
            remainingRounds: group.max_no_of_members - group.previousWinners.length,
            startDate: group.startDate,
            endDate: group.endDate,
            status: group.status
        };
    }

    async searchEqubGroups(searchCriteria: any) {
        const query: any = {};
        
        if (searchCriteria.status) {
            query.status = searchCriteria.status;
        }
        
        if (searchCriteria.contributionAmount) {
            query.contributionAmount = searchCriteria.contributionAmount;
        }
        
        if (searchCriteria.maxMembers) {
            query.max_no_of_members = searchCriteria.maxMembers;
        }
        
        const groups = await EqubGroup.find(query);
        return groups;
    }

    async getActiveGroups() {
        const groups = await EqubGroup.find({ status: EqubGroupStatus.ACTIVE });
        return groups;
    }

    async getCompletedGroups() {
        const groups = await EqubGroup.find({ status: EqubGroupStatus.COMPLETED });
        return groups;
    }

    async savePaymentInitiation(paymentData: {
        equbId: string;
        userId: string;
        amount: number;
        txRef: string;
        status: string;
        blockchainTxHash: string;
    }) {
        const payment = new PaymentInitiation(paymentData);
        await payment.save();
        return payment;
    }

    async verifyPayment(txRef: string) {
        const payment = await PaymentInitiation.findOne({ txRef });
        if (!payment) {
            throw new Error('Payment record not found');
        }

        // Update payment status
        payment.status = PaymentStatus.COMPLETED;
        await payment.save();

        // Record the contribution
        await this.recordContribution(
            payment.equbId as any,
            payment.userId as any,
            payment.amount,
            payment.txRef,
            payment.blockchainTxHash as any
        );

        return payment;
    }

    private async recordContribution(
        equbId: string,
        userId: string,
        amount: number,
        txRef: string,
        blockchainTxHash: string
    ) {
        const group = await EqubGroup.findById(equbId);
        if (!group) {
            throw new Error('Equb group not found');
        }

        // Add contribution to group
        const contribution = {
            userId: userId as any,
            amount,
            txRef,
            date: new Date(),
            status: 'COMPLETED',
            blockchainTxHash
        };

        if (!group.contributions) {
            group.contributions = [];
        }

        group.contributions.push(contribution);
        await group.save();

        return contribution;
    }
}
