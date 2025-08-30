import { ethers } from 'ethers';

// Your ABI (paste this exactly)
const contractAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AlreadyFinalized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidOption",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidParams",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoClaim",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotActive",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotStarted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "RoundNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TransferFailed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "Unauthorized",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "bettor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "option",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      }
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "question",
        "type": "string"
      }
    ],
    "name": "RoundCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "correctOption",
        "type": "uint8"
      }
    ],
    "name": "RoundResolved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "claimWinnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "options",
        "type": "string[]"
      },
      {
        "internalType": "uint64",
        "name": "startTime",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "endTime",
        "type": "uint64"
      }
    ],
    "name": "createRound",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deleteAllRounds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "deleteRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "getOptions",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "option",
        "type": "uint8"
      }
    ],
    "name": "getOptionTotals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "getRoundInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "startTime",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "endTime",
        "type": "uint64"
      },
      {
        "internalType": "bool",
        "name": "active",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "resolved",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "deleted",
        "type": "bool"
      },
      {
        "internalType": "uint8",
        "name": "correctOption",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      }
    ],
    "name": "getRoundStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalPot",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "getUserBet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "option",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "minBet",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextRoundId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "option",
        "type": "uint8"
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "roundId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "correctOption",
        "type": "uint8"
      }
    ],
    "name": "resolveRound",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "roundsCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_minBet",
        "type": "uint256"
      }
    ],
    "name": "setMinBet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_treasury",
        "type": "address"
      }
    ],
    "name": "setTreasury",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address from environment
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

let provider;
let signer;
let contract;

// Initialize contract with wallet provider
export async function initContract(ethereumProvider) {
  if (!ethereumProvider) {
    throw new Error('Ethereum provider not found');
  }
  
  provider = new ethers.providers.Web3Provider(ethereumProvider);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, signer);
  
  return contract;
}

// Get initialized contract instance
export function getContract() {
  if (!contract) {
    throw new Error('Contract not initialized. Call initContract first.');
  }
  return contract;
}

// Get contract with just provider (read-only)
export function getReadOnlyContract() {
  if (!provider) {
    throw new Error('Provider not initialized');
  }
  return new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
}

// ====== ADMIN FUNCTIONS ======

export async function createRound(question, options, startTime, endTime) {
  const contract = getContract();
  const tx = await contract.createRound(question, options, startTime, endTime);
  await tx.wait();
  return tx;
}

export async function resolveRound(roundId, correctOption) {
  const contract = getContract();
  const tx = await contract.resolveRound(roundId, correctOption);
  await tx.wait();
  return tx;
}

export async function deleteRound(roundId) {
  const contract = getContract();
  const tx = await contract.deleteRound(roundId);
  await tx.wait();
  return tx;
}

export async function deleteAllRounds() {
  const contract = getContract();
  const tx = await contract.deleteAllRounds();
  await tx.wait();
  return tx;
}

export async function setMinBet(minBetAmount) {
  const contract = getContract();
  const tx = await contract.setMinBet(minBetAmount);
  await tx.wait();
  return tx;
}

export async function setTreasury(treasuryAddress) {
  const contract = getContract();
  const tx = await contract.setTreasury(treasuryAddress);
  await tx.wait();
  return tx;
}

export async function withdrawFees() {
  const contract = getContract();
  const tx = await contract.withdrawFees();
  await tx.wait();
  return tx;
}

// ====== USER FUNCTIONS ======

export async function placeBet(roundId, option, ethAmount) {
  const contract = getContract();
  const tx = await contract.placeBet(roundId, option, {
    value: ethAmount,
    gasLimit: 200000
  });
  await tx.wait();
  return tx;
}

export async function claimWinnings(roundId) {
  const contract = getContract();
  const tx = await contract.claimWinnings(roundId);
  await tx.wait();
  return tx;
}

// ====== VIEW FUNCTIONS ======

export async function getRoundInfo(roundId) {
  const contract = getReadOnlyContract();
  return await contract.getRoundInfo(roundId);
}

export async function getRoundStats(roundId) {
  const contract = getReadOnlyContract();
  const result = await contract.getRoundStats(roundId);
  return {
    totalPot: result
  };
}

export async function getOptions(roundId) {
  const contract = getReadOnlyContract();
  return await contract.getOptions(roundId);
}

export async function getUserBet(roundId, userAddress) {
  const contract = getReadOnlyContract();
  return await contract.getUserBet(roundId, userAddress);
}

export async function getOptionTotals(roundId, option) {
  const contract = getReadOnlyContract();
  return await contract.getOptionTotals(roundId, option);
}

export async function roundsCount() {
  const contract = getReadOnlyContract();
  const count = await contract.roundsCount();
  return count.toNumber();
}

export async function owner() {
  const contract = getReadOnlyContract();
  return await contract.owner();
}

export async function treasury() {
  const contract = getReadOnlyContract();
  return await contract.treasury();
}

export async function minBet() {
  const contract = getReadOnlyContract();
  return await contract.minBet();
}

export async function nextRoundId() {
  const contract = getReadOnlyContract();
  const id = await contract.nextRoundId();
  return id.toNumber();
}

// ====== HELPER FUNCTIONS ======

// Get account balance
export async function getBalance(address) {
  if (!provider) throw new Error('Provider not initialized');
  const balance = await provider.getBalance(address);
  return balance;
}

// Get current connected account
export async function getCurrentAccount() {
  if (!signer) throw new Error('Signer not initialized');
  return await signer.getAddress();
}

// Listen to contract events
export function listenToEvents(eventName, callback) {
  const contract = getContract();
  contract.on(eventName, callback);
}

// Stop listening to events
export function stopListening(eventName, callback) {
  const contract = getContract();
  contract.off(eventName, callback);
}

// Default export with all functions
export default {
  // Initialization
  initContract,
  getContract,
  getReadOnlyContract,
  
  // Admin functions
  createRound,
  resolveRound,
  deleteRound,
  deleteAllRounds,
  setMinBet,
  setTreasury,
  withdrawFees,
  
  // User functions
  placeBet,
  claimWinnings,
  
  // View functions
  getRoundInfo,
  getRoundStats,
  getOptions,
  getUserBet,
  getOptionTotals,
  roundsCount,
  owner,
  treasury,
  minBet,
  nextRoundId,
  
  // Helper functions
  getBalance,
  getCurrentAccount,
  listenToEvents,
  stopListening
};
