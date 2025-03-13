// src/services/blockchain.service.ts
import { ethers } from 'ethers';
const EqubContribution = require('../../build/contracts/EqubContribution.json');

export class BlockchainService {
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;
    private wallet: ethers.Wallet;

    constructor() {
        try {
            console.log('Initializing BlockchainService...');
            console.log('RPC URL:', process.env.BLOCKCHAIN_RPC_URL);
            console.log('Contract Address:', process.env.SMART_CONTRACT_ADDRESS);
            
            if (!process.env.BLOCKCHAIN_RPC_URL) {
                throw new Error('BLOCKCHAIN_RPC_URL is not set in environment variables');
            }
            if (!process.env.BLOCKCHAIN_PRIVATE_KEY) {
                throw new Error('BLOCKCHAIN_PRIVATE_KEY is not set in environment variables');
            }
            if (!process.env.SMART_CONTRACT_ADDRESS) {
                throw new Error('SMART_CONTRACT_ADDRESS is not set in environment variables');
            }

            this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
            console.log('Provider initialized');

            this.wallet = new ethers.Wallet(
                process.env.BLOCKCHAIN_PRIVATE_KEY!,
                this.provider
            );
            console.log('Wallet initialized');
            
            if (!EqubContribution.abi) {
                throw new Error('Contract ABI not found');
            }
            console.log('Contract ABI found');

            this.contract = new ethers.Contract(
                process.env.SMART_CONTRACT_ADDRESS!,
                EqubContribution.abi,
                this.wallet
            );
            console.log('Contract instance created');
        } catch (error) {
            console.error('BlockchainService initialization error:', error);
            throw error;
        }
    }

    async logContribution(
        equbId: string,
        userId: string,
        amount: number,
        txRef: string
    ) {
        console.log('Starting logContribution with params:', {
            equbId,
            userId,
            amount,
            txRef
        });

        try {
            // Verify connection and check balance before proceeding
            const connectionStatus = await this.verifyConnection();
            console.log('Wallet status:', connectionStatus);

            const timestamp = Math.floor(Date.now() / 1000);
            console.log('Using timestamp:', timestamp);
            
            // Convert amount to wei/smallest unit
            const amountInSmallestUnit = ethers.parseUnits(amount.toString(), 'ether');
            console.log('Amount in smallest unit:', amountInSmallestUnit.toString());
            
            // Get current gas price and estimate gas needed
            const feeData = await this.provider.getFeeData();
            const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei'); // Use 1 gwei if null
            const reducedGasPrice = gasPrice / BigInt(2); // Use half of current gas price
            
            console.log('Current gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'gwei');
            console.log('Using reduced gas price:', ethers.formatUnits(reducedGasPrice, 'gwei'), 'gwei');

            // Estimate gas limit
            const gasLimit = await this.contract.logContribution.estimateGas(
                equbId,
                userId,
                amountInSmallestUnit,
                timestamp,
                txRef
            );
            console.log('Estimated gas limit:', gasLimit.toString());

            // Calculate total transaction cost
            const totalCost = reducedGasPrice * gasLimit;
            console.log('Estimated total cost:', ethers.formatEther(totalCost), 'ETH');

            // Check if we have enough balance
            const balance = await this.provider.getBalance(this.wallet.address);
            console.log('Current balance:', ethers.formatEther(balance), 'ETH');

            if (balance < totalCost) {
                throw new Error(`Insufficient funds. Need ${ethers.formatEther(totalCost)} ETH but have ${ethers.formatEther(balance)} ETH`);
            }
            
            console.log('Preparing transaction...');
            const tx = await this.contract.logContribution(
                equbId,
                userId,
                amountInSmallestUnit,
                timestamp,
                txRef,
                { 
                    gasLimit: gasLimit + BigInt(50000), // Add some buffer
                    gasPrice: reducedGasPrice
                }
            );
            console.log('Transaction sent:', tx.hash);

            console.log('Waiting for transaction confirmation...');
            const receipt = await tx.wait();
            console.log('Transaction confirmed:', receipt);
            
            return {
                blockHash: receipt.blockHash,
                transactionHash: receipt.hash,
                timestamp,
                status: receipt.status === 1 ? 'success' : 'failed'
            };
        } catch (error: unknown) {
            console.error('Blockchain logging error details:', {
                error,
                errorMessage: error instanceof Error ? error.message : 'Unknown error',
                errorStack: error instanceof Error ? error.stack : undefined
            });
            
            // Check for specific error types
            if (error instanceof Error) {
                if (error.message.includes('insufficient funds')) {
                    const balanceCheck = await this.provider.getBalance(this.wallet.address);
                    throw new Error(`Insufficient funds. Current balance: ${ethers.formatEther(balanceCheck)} ETH. Please ensure your wallet has enough ETH for gas fees.`);
                }
                if (error.message.includes('nonce')) {
                    throw new Error('Transaction nonce error - please try again');
                }
                throw new Error(`Failed to log contribution to blockchain: ${error.message}`);
            }
            throw new Error('Failed to log contribution to blockchain: Unknown error');
        }
    }

    async verifyConnection() {
        try {
            console.log('Verifying blockchain connection...');
            
            // Check provider connection
            const network = await this.provider.getNetwork();
            console.log('Connected to network:', {
                chainId: network.chainId,
                name: network.name
            });

            // Check contract connection
            const address = await this.contract.getAddress();
            console.log('Contract connected at:', address);

            // Check wallet balance using provider
            const balance = await this.provider.getBalance(this.wallet.address);
            console.log('Wallet balance:', ethers.formatEther(balance), 'ETH');

            return {
                isConnected: true,
                network,
                contractAddress: address,
                walletBalance: ethers.formatEther(balance)
            };
        } catch (error) {
            console.error('Contract connection error:', error);
            return {
                isConnected: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getContribution(txRef: string) {
        try {
            console.log('Getting contribution for txRef:', txRef);
            const contribution = await this.contract.getContribution(txRef);
            console.log('Retrieved contribution:', contribution);
            
            return {
                equbId: contribution.equbId,
                userId: contribution.userId,
                amount: ethers.formatEther(contribution.amount),
                timestamp: new Date(Number(contribution.timestamp) * 1000),
                txRef: contribution.txRef
            };
        } catch (error) {
            console.error('Error getting contribution:', error);
            throw new Error('Failed to get contribution from blockchain');
        }
    }

    async getAllContributionsForEqub(equbId: string) {
        try {
            console.log('Getting all contributions for equbId:', equbId);
            const contributions = await this.contract.getContributionsByEqubId(equbId);
            console.log('Retrieved contributions:', contributions);
            
            return contributions.map((contribution: any) => ({
                equbId: contribution.equbId,
                userId: contribution.userId,
                amount: ethers.formatEther(contribution.amount),
                timestamp: new Date(Number(contribution.timestamp) * 1000),
                txRef: contribution.txRef
            }));
        } catch (error) {
            console.error('Error getting contributions:', error);
            throw new Error('Failed to get contributions from blockchain');
        }
    }

    getContract() {
        return this.contract;
    }
}