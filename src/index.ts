import { ethers } from 'ethers';
import { StakedIP, Withdrawal, RewardsManager, IPToken } from 'story-liquid-staking-sdk';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Validate environment variables
  const requiredEnvVars = [
    'RPC_URL',
    'PRIVATE_KEY',
    'IP_TOKEN_ADDRESS',
    'STAKED_IP_ADDRESS',
    'WITHDRAWAL_ADDRESS',
    'REWARDS_MANAGER_ADDRESS',
    'RECIPIENT_ADDRESS'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  // Initialize provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  provider.getResolver = async () => null; // Disable ENS resolution
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // Initialize contract instances
  const ipToken = new IPToken({
    address: process.env.IP_TOKEN_ADDRESS!,
    provider,
    signer
  });

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

  try {
    // Check IP token balance
    const ipBalance = await ipToken.balanceOf(await signer.getAddress());
    console.log('IP token balance:', ipBalance.toString());

    // Check if we have enough IP tokens
    const stakeAmount = BigInt(1000000000000000000); // 1 token
    if (ipBalance < stakeAmount) {
      throw new Error('Not enough IP tokens to stake');
    }

    // Check if we have approved enough tokens
    const allowance = await ipToken.allowance(await signer.getAddress(), stakedIP.address);
    if (allowance < stakeAmount) {
      console.log('Approving IP tokens...');
      const approveTx = await ipToken.approve(stakedIP.address, stakeAmount);
      await approveTx.wait();
      console.log('Approval successful!');
    }

    // Example: Stake tokens
    console.log('Staking tokens...');
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

  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);