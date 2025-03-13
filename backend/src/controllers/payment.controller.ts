// src/controllers/payment.controller.ts

import { Request, Response } from 'express';
import { EqubGroupService } from '../services/equbgroup.service';
import { BlockchainService } from '../services/blockchain.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import profileModel from '../models/profile.model';
import { Types } from 'mongoose';

// Define interface for blockchain contribution
interface BlockchainContribution {
    contributor: string;
    amount: bigint;
    timestamp: bigint;
    equbId: string;
    userId: string;
    txRef: string;
}

export class PaymentController {
    private equbGroupService: EqubGroupService;
    private blockchainService: BlockchainService;

    constructor() {
        this.equbGroupService = new EqubGroupService();
        this.blockchainService = new BlockchainService();
    }

    async checkBlockchainConnection(req: Request, res: Response) {
        try {
            const connectionStatus = await this.blockchainService.verifyConnection();
            res.json(connectionStatus);
        } catch (error) {
            console.error('Error checking blockchain connection:', error);
            res.status(500).json({
                isConnected: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }

    async initiatePayment(req: Request, res: Response) {
        try {
            const loggedinuserId = (req as AuthRequest).user?.userId;
            console.log('User initiating payment:', loggedinuserId);
            
            if (!loggedinuserId) {
                return res.status(403).json({ message: "Unauthorized: User not found in token" });
            }

            const { equbId } = req.body;
            if (!equbId) {
                return res.status(400).json({ 
                    message: "equbId is required" 
                });
            }

            const group = await this.equbGroupService.getEqubGroupsById(equbId);
            if (!group) {
                return res.status(404).json({ message: 'Equb group not found' });
            }

            if (!group.members.some(member => member.toString() === loggedinuserId)) {
                return res.status(403).json({ 
                    message: 'You are not a member of this equb group' 
                });
            }

            // Generate unique transaction reference
            const TX_REF = `tx-equb-${equbId}-${loggedinuserId}-${Date.now()}`;
            
            const profile = await profileModel.findOne({ userId: new Types.ObjectId(loggedinuserId) });
            if (!profile) {
                return res.status(404).json({ message: 'User profile not found' });
            }

            // Log to blockchain first
            console.log('Logging to blockchain...');
            const blockchainLog = await this.blockchainService.logContribution(
                equbId,
                loggedinuserId,
                group.contributionAmount,
                TX_REF
            );
            console.log('Blockchain transaction hash:', blockchainLog.transactionHash);

            // Prepare Chapa payment data
            const paymentData = {
                amount: group.contributionAmount.toString(),
                currency: 'ETB',
                email: profile.email,
                first_name: profile.firstName,
                last_name: profile.lastName,
                tx_ref: TX_REF,
                callback_url: `${process.env.BACKEND_URL}/api/payments/verify/${TX_REF}`,
                customization: {
                title: `Equb - ${group.group_name.substring(0, 5)}`
                }
            };

            // Initialize Chapa payment
            const response = await fetch(process.env.CHAPA_URL || "https://api.chapa.co/v1/transaction/initialize", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CHAPA_AUTH}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            console.log('Chapa API Response:', data);

            if (!response.ok) {
                throw new Error(`Payment initialization failed: ${JSON.stringify(data)}`);
            }

            // Save payment initiation record
            await this.equbGroupService.savePaymentInitiation({
                equbId,
                userId: loggedinuserId,
                amount: group.contributionAmount,
                txRef: TX_REF,
                status: 'PENDING',
                blockchainTxHash: blockchainLog.transactionHash
            });

            // Return both Chapa checkout URL and blockchain transaction hash
            res.json({ 
                checkoutUrl: data.data.checkout_url,
                blockchainTxHash: blockchainLog.transactionHash,
                txRef: TX_REF
            });

        } catch (error: unknown) {
            console.error('Payment initiation error:', error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Payment initiation failed', error: error.message });
            } else {
                res.status(500).json({ message: 'Payment initiation failed', error: 'Unknown error occurred' });
            }
        }
    }

    async verifyPayment(req: Request, res: Response) {
        try {
            const txRef = req.params.txRef;

            // Verify payment with Chapa
            const response = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.CHAPA_AUTH}`
                }
            });

            if (!response.ok) {
                throw new Error(`Payment verification failed: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'success') {
                // Record the contribution
                await this.equbGroupService.verifyPayment(txRef);
                
                // Redirect or respond based on your needs
                res.json({ status: 'success', message: 'Payment verified successfully' });
            } else {
                throw new Error('Payment verification failed');
            }

        } catch (error: unknown) {
            console.error('Payment verification error:', error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Payment verification failed', error: error.message });
            } else {
                res.status(500).json({ message: 'Payment verification failed', error: 'Unknown error occurred' });
            }
        }
    }

    async paymentSuccess(req: Request, res: Response) {
        res.json({ message: 'Payment completed successfully' });
    }

    async verifyBlockchainLog(req: Request, res: Response) {
        try {
            const { txRef } = req.params;
            const contract = this.blockchainService.getContract();
            const contribution = await contract.getContribution(txRef) as BlockchainContribution;
            
            // Convert BigInt values to strings before sending in response
            res.json({
                contribution: {
                    equbId: contribution.equbId,
                    userId: contribution.userId,
                    amount: contribution.amount.toString(),
                    timestamp: new Date(Number(contribution.timestamp.toString()) * 1000),
                    txRef: contribution.txRef,
                    contributor: contribution.contributor
                }
            });
        } catch (error) {
            console.error('Blockchain verification error:', error);
            res.status(500).json({ 
                message: 'Failed to verify blockchain log',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    async getAllContributions(req: Request, res: Response) {
        try {
            const { equbId } = req.params;
            if (!equbId) {
                return res.status(400).json({ message: 'equbId is required' });
            }

            const contributions = await this.blockchainService.getAllContributionsForEqub(equbId) as BlockchainContribution[];
            
            // Convert BigInt values to strings before sending in response
            const formattedContributions = contributions.map(contribution => ({
                equbId: contribution.equbId,
                userId: contribution.userId,
                amount: contribution.amount.toString(),
                timestamp: new Date(Number(contribution.timestamp.toString()) * 1000),
                txRef: contribution.txRef,
                contributor: contribution.contributor
            }));

            res.json({ contributions: formattedContributions });
        } catch (error) {
            console.error('Error getting contributions:', error);
            res.status(500).json({ 
                message: 'Failed to get contributions',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}