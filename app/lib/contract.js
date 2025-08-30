// Contract configuration and utilities
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'

export const CONTRACT_ABI = [
  // View functions
  'function getRoundInfo(uint256 _roundId) view returns (string, string[], bool, bool, uint256, uint256)',
  'function getOptionBets(uint256 _roundId, uint256 _option) view returns (uint256)',
  'function getUserBet(uint256 _roundId, address _user) view returns (uint256, uint256, bool)',
  'function getRoundBettors(uint256 _roundId) view returns (address[])',
  'function owner() view returns (address)',
  'function roundCounter() view returns (uint256)',
  
  // State changing functions
  'function placeBet(uint256 _roundId, uint256 _option) payable',
  'function createRound(string _question, string[] _options)',
  'function resolveRound(uint256 _roundId, uint256 _correctOption)',
  'function claimWinnings(uint256 _roundId)',
  'function emergencyWithdraw()',
  'function transferOwnership(address newOwner)',
  
  // Events
  'event RoundCreated(uint256 indexed roundId, string question)',
  'event BetPlaced(uint256 indexed roundId, address indexed bettor, uint256 option, uint256 amount)',
  'event RoundResolved(uint256 indexed roundId, uint256 correctOption)',
  'event WinningsClaimed(address indexed winner, uint256 amount)'
]

// Network configurations
export const SUPPORTED_NETWORKS = {
  monadTestnet: {
    chainId: 41454,
    chainIdHex: '0xa1f6',
    name: 'Monad Testnet',
    rpcUrl: 'https://testnet-rpc.monad.xyz',
    blockExplorerUrl: 'https://testnet-explorer.monad.xyz',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    }
  },
  monadMainnet: {
    chainId: 41455,
    chainIdHex: '0xa1f7', 
    name: 'Monad Mainnet',
    rpcUrl: 'https://rpc.monad.xyz',
    blockExplorerUrl: 'https://explorer.monad.xyz',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH', 
      decimals: 18
    }
  }
}

// Default network
export const DEFAULT_NETWORK = SUPPORTED_NETWORKS.monadTestnet

// Contract interaction utilities
export const CONTRACT_METHODS = {
  // Read methods
  GET_ROUND_INFO: 'getRoundInfo',
  GET_OPTION_BETS: 'getOptionBets',
  GET_USER_BET: 'getUserBet',
  GET_ROUND_BETTORS: 'getRoundBettors',
  GET_OWNER: 'owner',
  GET_ROUND_COUNTER: 'roundCounter',
  
  // Write methods  
  PLACE_BET: 'placeBet',
  CREATE_ROUND: 'createRound',
  RESOLVE_ROUND: 'resolveRound',
  CLAIM_WINNINGS: 'claimWinnings',
  EMERGENCY_WITHDRAW: 'emergencyWithdraw',
  TRANSFER_OWNERSHIP: 'transferOwnership'
}

// Contract events
export const CONTRACT_EVENTS = {
  ROUND_CREATED: 'RoundCreated',
  BET_PLACED: 'BetPlaced', 
  ROUND_RESOLVED: 'RoundResolved',
  WINNINGS_CLAIMED: 'WinningsClaimed'
}

// Gas limit configurations
export const GAS_LIMITS = {
  PLACE_BET: 150000,
  CREATE_ROUND: 200000,
  RESOLVE_ROUND: 100000,
  CLAIM_WINNINGS: 100000,
  EMERGENCY_WITHDRAW: 80000,
  TRANSFER_OWNERSHIP: 60000
}

// Minimum bet amounts
export const MIN_BET_AMOUNT = '0.001' // ETH

// Maximum number of options per round
export const MAX_OPTIONS_PER_ROUND = 10

// Contract state enums
export const ROUND_STATUS = {
  INACTIVE: 'inactive',
  ACTIVE: 'active',
  RESOLVED: 'resolved'
}

// Error codes
export const ERROR_CODES = {
  INVALID_ROUND: 'INVALID_ROUND',
  ROUND_NOT_ACTIVE: 'ROUND_NOT_ACTIVE',
  INVALID_OPTION: 'INVALID_OPTION',
  ALREADY_PLACED_BET: 'ALREADY_PLACED_BET',
  NO_BET_PLACED: 'NO_BET_PLACED',
  INCORRECT_PREDICTION: 'INCORRECT_PREDICTION',
  ALREADY_CLAIMED: 'ALREADY_CLAIMED',
  ROUND_NOT_RESOLVED: 'ROUND_NOT_RESOLVED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  UNAUTHORIZED: 'UNAUTHORIZED'
}

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_ROUND]: 'Invalid round ID',
  [ERROR_CODES.ROUND_NOT_ACTIVE]: 'This betting round is not active',
  [ERROR_CODES.INVALID_OPTION]: 'Invalid betting option selected',
  [ERROR_CODES.ALREADY_PLACED_BET]: 'You have already placed a bet on this round',
  [ERROR_CODES.NO_BET_PLACED]: 'No bet found for this round',
  [ERROR_CODES.INCORRECT_PREDICTION]: 'Your prediction was incorrect',
  [ERROR_CODES.ALREADY_CLAIMED]: 'Winnings already claimed',
  [ERROR_CODES.ROUND_NOT_RESOLVED]: 'Round has not been resolved yet',
  [ERROR_CODES.INSUFFICIENT_FUNDS]: 'Insufficient funds for transaction',
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action'
}

// Contract validation utilities
export const validateRoundId = (roundId) => {
  return roundId && Number.isInteger(Number(roundId)) && Number(roundId) > 0
}

export const validateOptionIndex = (optionIndex, totalOptions) => {
  return Number.isInteger(Number(optionIndex)) && 
         Number(optionIndex) >= 0 && 
         Number(optionIndex) < totalOptions
}

export const validateBetAmount = (amount) => {
  try {
    const numAmount = parseFloat(amount)
    return numAmount > 0 && numAmount >= parseFloat(MIN_BET_AMOUNT)
  } catch {
    return false
  }
}

export const validateAddress = (address) => {
  return address && address.length === 42 && address.startsWith('0x')
}

// Contract data formatters
export const formatRoundData = (rawRoundData) => {
  if (!rawRoundData) return null
  
  return {
    question: rawRoundData[0] || '',
    options: rawRoundData[1] || [],
    active: rawRoundData[2] || false,
    resolved: rawRoundData[3] || false,
    totalPot: rawRoundData[4] ? rawRoundData[4].toString() : '0',
    correctOption: rawRoundData[5] ? rawRoundData[5].toNumber() : 0
  }
}

export const formatUserBet = (rawUserBet) => {
  if (!rawUserBet) return null
  
  return {
    option: rawUserBet[0] ? rawUserBet[0].toNumber() : 0,
    amount: rawUserBet[1] ? rawUserBet[1].toString() : '0',
    claimed: rawUserBet[2] || false
  }
}

// Contract interaction helpers
export const buildContractCallData = (method, params = []) => {
  return {
    method,
    params,
    gasLimit: GAS_LIMITS[method.toUpperCase()] || 200000
  }
}

// Event parsing utilities  
export const parseContractEvent = (event) => {
  const { event: eventName, args, transactionHash, blockNumber } = event
  
  const baseEvent = {
    eventName,
    txHash: transactionHash,
    blockNumber: blockNumber,
    timestamp: Date.now() // Note: In production, get actual block timestamp
  }
  
  switch (eventName) {
    case CONTRACT_EVENTS.ROUND_CREATED:
      return {
        ...baseEvent,
        roundId: args.roundId.toNumber(),
        question: args.question
      }
      
    case CONTRACT_EVENTS.BET_PLACED:
      return {
        ...baseEvent,
        roundId: args.roundId.toNumber(),
        bettor: args.bettor,
        option: args.option.toNumber(),
        amount: args.amount.toString()
      }
      
    case CONTRACT_EVENTS.ROUND_RESOLVED:
      return {
        ...baseEvent,
        roundId: args.roundId.toNumber(),
        correctOption: args.correctOption.toNumber()
      }
      
    case CONTRACT_EVENTS.WINNINGS_CLAIMED:
      return {
        ...baseEvent,
        winner: args.winner,
        amount: args.amount.toString()
      }
      
    default:
      return baseEvent
  }
}

// Export contract configuration object
export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  networks: SUPPORTED_NETWORKS,
  defaultNetwork: DEFAULT_NETWORK,
  methods: CONTRACT_METHODS,
  events: CONTRACT_EVENTS,
  gasLimits: GAS_LIMITS,
  minBetAmount: MIN_BET_AMOUNT,
  maxOptionsPerRound: MAX_OPTIONS_PER_ROUND
}

export default CONTRACT_CONFIG
