import { ethers } from 'ethers';
import { StakedIP, Withdrawal, RewardsManager, WIP } from 'story-liquid-staking-sdk';
import * as dotenv from 'dotenv';

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
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // Initialize contract instances
  const stakedIP = new StakedIP({
    address: process.env.STAKED_IP_ADDRESS!,
    provider,
    signer
  });

  const withdrawal = new Withdrawal({
    address: process.env.WITHDRAWAL_ADDRESS!,
    provider,
    signer
  });

  const rewardsManager = new RewardsManager({
    address: process.env.REWARDS_MANAGER_ADDRESS!,
    provider,
    signer
  });

  const wip = new WIP({
    address: process.env.WIP_ADDRESS!,
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
    const transferTx = await wip.transfer(process.env.RECIPIENT_ADDRESS!, transferAmount);
    await transferTx.wait();
    console.log('Transfer successful!');

    // Example: Check WIP balance
    const wipBalance = await wip.balanceOf(await signer.getAddress());
    console.log('WIP balance:', wipBalance.toString());

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error); 