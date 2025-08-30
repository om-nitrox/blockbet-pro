// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'

export const CONTRACT_ABI = [
  'function getRoundInfo(uint256 _roundId) view returns (string, string[], bool, bool, uint256, uint256)',
  'function placeBet(uint256 _roundId, uint256 _option) payable',
  'function createRound(string _question, string[] _options)',
  'function resolveRound(uint256 _roundId, uint256 _correctOption)',
  'function claimWinnings(uint256 _roundId)',
  'function getOptionBets(uint256 _roundId, uint256 _option) view returns (uint256)',
  'function getUserBet(uint256 _roundId, address _user) view returns (uint256, uint256, bool)',
  'function owner() view returns (address)',
  'function roundCounter() view returns (uint256)',
  
  // Events
  'event RoundCreated(uint256 indexed roundId, string question)',
  'event BetPlaced(uint256 indexed roundId, address indexed bettor, uint256 option, uint256 amount)',
  'event RoundResolved(uint256 indexed roundId, uint256 correctOption)',
  'event WinningsClaimed(address indexed winner, uint256 amount)'
]

// Monad testnet configuration
export const MONAD_TESTNET = {
  chainId: '0xa1f6', // 41454 in hex
  chainName: 'Monad Testnet',
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
}

// App configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'BlockBet Pro',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Fast prediction markets on Monad',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '41454'),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.monad.xyz',
  explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://testnet-explorer.monad.xyz',
}
