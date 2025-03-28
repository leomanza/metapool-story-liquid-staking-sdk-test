"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const story_liquid_staking_sdk_1 = require("story-liquid-staking-sdk");
const dotenv = __importStar(require("dotenv"));
// Load environment variables
dotenv.config();
async function main() {
    // Validate environment variables
    const requiredEnvVars = [
        'RPC_URL',
        'PRIVATE_KEY',
        'STAKED_IP_ADDRESS',
        'WITHDRAWAL_ADDRESS',
        'REWARDS_MANAGER_ADDRESS',
        'WIP_ADDRESS',
        'RECIPIENT_ADDRESS'
    ];
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }
    // Initialize provider and signer
    const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // Initialize contract instances
    const stakedIP = new story_liquid_staking_sdk_1.StakedIP({
        address: process.env.STAKED_IP_ADDRESS,
        provider,
        signer
    });
    const withdrawal = new story_liquid_staking_sdk_1.Withdrawal({
        address: process.env.WITHDRAWAL_ADDRESS,
        provider,
        signer
    });
    const rewardsManager = new story_liquid_staking_sdk_1.RewardsManager({
        address: process.env.REWARDS_MANAGER_ADDRESS,
        provider,
        signer
    });
    const wip = new story_liquid_staking_sdk_1.WIP({
        address: process.env.WIP_ADDRESS,
        provider,
        signer
    });
    try {
        // Example: Stake tokens
        console.log('Staking tokens...');
        const stakeAmount = BigInt(1000000000000000000); // 1 token
        const stakeTx = await stakedIP.stake(stakeAmount);
        await stakeTx.wait();
        console.log('Staking successful!');
        // Example: Check balance
        const balance = await stakedIP.balanceOf(await signer.getAddress());
        console.log('Staked balance:', balance.toString());
        // Example: Request withdrawal
        console.log('Requesting withdrawal...');
        const withdrawalAmount = BigInt(500000000000000000); // 0.5 tokens
        const withdrawalTx = await withdrawal.requestWithdrawal(withdrawalAmount);
        await withdrawalTx.wait();
        console.log('Withdrawal requested!');
        // Example: Check rewards
        const rewards = await stakedIP.rewardsOf(await signer.getAddress());
        console.log('Pending rewards:', rewards.toString());
        // Example: Claim rewards
        console.log('Claiming rewards...');
        const claimTx = await stakedIP.claimRewards();
        await claimTx.wait();
        console.log('Rewards claimed!');
        // Example: Transfer WIP tokens
        console.log('Transferring WIP tokens...');
        const transferAmount = BigInt(100000000000000000); // 0.1 tokens
        const transferTx = await wip.transfer(process.env.RECIPIENT_ADDRESS, transferAmount);
        await transferTx.wait();
        console.log('Transfer successful!');
        // Example: Check WIP balance
        const wipBalance = await wip.balanceOf(await signer.getAddress());
        console.log('WIP balance:', wipBalance.toString());
    }
    catch (error) {
        console.error('Error:', error);
    }
}
main().catch(console.error);
