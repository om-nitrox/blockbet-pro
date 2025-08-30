'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

// Mock data for testing frontend
const mockRounds = {
  1: {
    question: "Will Bitcoin hit $100k by end of 2025?",
    options: ["Yes", "No"],
    active: true,
    resolved: false,
    totalPot: "2.456",
    correctOption: 0,
    optionBets: ["1.234", "1.222"],
    userBet: null
  },
  2: {
    question: "Will India win the World Cup 2025?",
    options: ["Yes", "No", "Draw"],
    active: false,
    resolved: true,
    totalPot: "5.789",
    correctOption: 0,
    optionBets: ["3.456", "1.333", "1.000"],
    userBet: { option: 0, amount: "0.5", claimed: false }
  },
  3: {
    question: "Will Ethereum reach $10k in 2025?",
    options: ["Yes", "No"],
    active: true,
    resolved: false,
    totalPot: "0.123",
    correctOption: 0,
    optionBets: ["0.023", "0.100"],
    userBet: null
  }
}

export function useMockContract() {
  const [isOwner, setIsOwner] = useState(true) // Mock as admin for testing
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isLoading, setIsLoading] = useState(false)

  // Mock wallet connection
  const connectWallet = async () => {
    setIsLoading(true)
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAccount('0x1234...6fA5')
    setBalance('10.456')
    toast.success('Mock wallet connected!')
    setIsLoading(false)
  }

  // Mock disconnect
  const disconnect = () => {
    setAccount(null)
    setBalance('0')
    toast.success('Wallet disconnected!')
  }

  // Mock load round
  const loadRoundInfo = async (roundId) => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const round = mockRounds[roundId]
    
    if (!round) {
      toast.error(`Round ${roundId} doesn't exist`)
      setIsLoading(false)
      return null
    }
    
    toast.success('Round loaded!')
    setIsLoading(false)
    return round
  }

  // Mock place bet
  const placeBet = async (roundId, selectedOption, betAmount) => {
    setIsLoading(true)
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update mock data
    if (mockRounds[roundId]) {
      mockRounds[roundId].optionBets[selectedOption] = 
        (parseFloat(mockRounds[roundId].optionBets[selectedOption]) + parseFloat(betAmount)).toString()
      
      mockRounds[roundId].totalPot = 
        (parseFloat(mockRounds[roundId].totalPot) + parseFloat(betAmount)).toString()
      
      mockRounds[roundId].userBet = {
        option: selectedOption,
        amount: betAmount,
        claimed: false
      }
    }
    
    toast.success('🎉 Bet placed successfully!')
    setIsLoading(false)
    return { hash: '0xmock123' }
  }

  // Mock create round
  const createRound = async (question, options) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    const newRoundId = Object.keys(mockRounds).length + 1
    mockRounds[newRoundId] = {
      question,
      options,
      active: true,
      resolved: false,
      totalPot: "0",
      correctOption: 0,
      optionBets: options.map(() => "0"),
      userBet: null
    }
    
    toast.success('🚀 Round created successfully!')
    setIsLoading(false)
    return { hash: '0xmockcreate' }
  }

  // Mock resolve round
  const resolveRound = async (roundId, correctOption) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (mockRounds[roundId]) {
      mockRounds[roundId].active = false
      mockRounds[roundId].resolved = true
      mockRounds[roundId].correctOption = correctOption
    }
    
    toast.success('✅ Round resolved!')
    setIsLoading(false)
    return { hash: '0xmockresolve' }
  }

  // Mock claim winnings
  const claimWinnings = async (roundId) => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (mockRounds[roundId] && mockRounds[roundId].userBet) {
      mockRounds[roundId].userBet.claimed = true
    }
    
    toast.success('💰 Winnings claimed!')
    setIsLoading(false)
    return { hash: '0xmockclaim' }
  }

  return {
    account,
    balance,
    isOwner,
    isLoading,
    connectWallet,
    disconnect,
    loadRoundInfo,
    placeBet,
    createRound,
    resolveRound,
    claimWinnings
  }
}
