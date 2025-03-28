# Story Liquid Staking SDK Usage Example

This is an example project demonstrating how to use the Story Liquid Staking SDK.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Access to an Ethereum RPC endpoint
- A wallet with some ETH for gas fees

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd story-liquid-staking-sdk-usage-example
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your configuration:
```env
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
STAKED_IP_ADDRESS=your_staked_ip_contract_address
WITHDRAWAL_ADDRESS=your_withdrawal_contract_address
REWARDS_MANAGER_ADDRESS=your_rewards_manager_contract_address
WIP_ADDRESS=your_wip_contract_address
RECIPIENT_ADDRESS=recipient_wallet_address
```

## Usage

1. Build the project:
```bash
npm run build
# or
yarn build
```

2. Run the example:
```bash
npm start
# or
yarn start
```

For development, you can use:
```bash
npm run dev
# or
yarn dev
```

## Example Features

The example demonstrates the following functionality:

- Staking tokens
- Checking staked balance
- Requesting withdrawals
- Checking and claiming rewards
- Transferring WIP tokens
- Checking WIP balance

## Security Notes

- Never commit your `.env` file or expose your private keys
- Always use environment variables for sensitive information
- Test with small amounts first
- Double-check all contract addresses before using them

## License

MIT 