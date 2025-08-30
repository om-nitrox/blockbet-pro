'use client'
import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { ethers } from 'ethers'

export function useBetting(contract, account) {
  const [isLoading, setIsLoading] = useState(false)
  const [bettingState, setBettingState] = useState({
    selectedRound: null,
    selectedOption: null,
    betAmount: '0.01',
    userBets: {}
  })

  // Place a bet
  const placeBet = useCallback(async (roundId, optionIndex, amount) => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first')
      return null
    }

    if (!roundId || optionIndex === null || !amount) {
      toast.error('Please provide all betting details')
      return null
    }

    try {
      setIsLoading(true)
      
      // Validate amount
      const betValue = parseFloat(amount)
      if (betValue <= 0) {
        toast.error('Bet amount must be greater than 0')
        return null
      }

      // Convert to wei
      const betAmountWei = ethers.utils.parseEther(amount.toString())
      
      // Estimate gas
      const gasEstimate = await contract.estimateGas.placeBet(roundId, optionIndex, {
        value: betAmountWei
      })
      
      // Add 20% buffer to gas estimate
      const gasLimit = gasEstimate.mul(120).div(100)
      
      // Execute transaction
      const tx = await contract.placeBet(roundId, optionIndex, {
        value: betAmountWei,
        gasLimit
      })
      
      toast.loading(`Placing bet... Transaction: ${tx.hash.slice(0, 8)}...`, { 
        id: tx.hash 
      })
      
      // Wait for confirmation
      const receipt = await tx.wait()
      
      if (receipt.status === 1) {
        toast.success('🎉 Bet placed successfully!', { id: tx.hash })
        
        // Update local state
        setBettingState(prev => ({
          ...prev,
          userBets: {
            ...prev.userBets,
            [roundId]: {
              option: optionIndex,
              amount: amount,
              txHash: tx.hash,
              blockNumber: receipt.blockNumber,
              claimed: false
            }
          }
        }))
        
        return {
          success: true,
          txHash: tx.hash,
          receipt
        }
      } else {
        throw new Error('Transaction failed')
      }
      
    } catch (error) {
      console.error('Place bet error:', error)
      
      let errorMessage = 'Failed to place bet'
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for transaction'
      } else if (error.code === 'USER_REJECTED') {
        errorMessage = 'Transaction rejected by user'
      } else if (error.message?.includes('Round not active')) {
        errorMessage = 'This betting round is not active'
      } else if (error.message?.includes('Invalid option')) {
        errorMessage = 'Invalid betting option selected'
      } else if (error.message?.includes('Already placed bet')) {
        errorMessage = 'You have already placed a bet on this round'
      }
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
      
    } finally {
      setIsLoading(false)
    }
  }, [contract, account])

  // Claim winnings
  const claimWinnings = useCallback(async (roundId) => {
    if (!contract || !account) {
      toast.error('Please connect your wallet first')
      return null
    }

    try {
      setIsLoading(true)
      
      // Check if user has winnings to claim
      const userBet = await contract.getUserBet(roundId, account)
      if (userBet.amount.isZero()) {
        toast.error('No bet found for this round')
        return null
      }
      
      if (userBet.claimed) {
        toast.error('Winnings already claimed')
        return null
      }
      
      // Estimate gas
      const gasEstimate = await contract.estimateGas.claimWinnings(roundId)
      const gasLimit = gasEstimate.mul(120).div(100)
      
      // Execute transaction
      const tx = await contract.claimWinnings(roundId, { gasLimit })
      
      toast.loading(`Claiming winnings... Transaction: ${tx.hash.slice(0, 8)}...`, { 
        id: tx.hash 
      })
      
      const receipt = await tx.wait()
      
      if (receipt.status === 1) {
        toast.success('💰 Winnings claimed successfully!', { id: tx.hash })
        
        // Update local state
        setBettingState(prev => ({
          ...prev,
          userBets: {
            ...prev.userBets,
            [roundId]: {
              ...prev.userBets[roundId],
              claimed: true,
              claimTxHash: tx.hash
            }
          }
        }))
        
        return {
          success: true,
          txHash: tx.hash,
          receipt
        }
      } else {
        throw new Error('Transaction failed')
      }
      
    } catch (error) {
      console.error('Claim winnings error:', error)
      
      let errorMessage = 'Failed to claim winnings'
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas fee'
      } else if (error.code === 'USER_REJECTED') {
        errorMessage = 'Transaction rejected by user'
      } else if (error.message?.includes('No bet placed')) {
        errorMessage = 'No bet found for this round'
      } else if (error.message?.includes('Incorrect prediction')) {
        errorMessage = 'Your prediction was incorrect'
      } else if (error.message?.includes('Already claimed')) {
        errorMessage = 'Winnings already claimed'
      }
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
      
    } finally {
      setIsLoading(false)
    }
  }, [contract, account])

  // Get user's bet history
  const getBetHistory = useCallback(async (fromBlock = 0) => {
    if (!contract || !account) return []

    try {
      // Get BetPlaced events for this user
      const filter = contract.filters.BetPlaced(null, account)
      const events = await contract.queryFilter(filter, fromBlock)
      
      const bets = await Promise.all(
        events.map(async (event) => {
          const { roundId, option, amount } = event.args
          
          // Get round info
          const roundInfo = await contract.getRoundInfo(roundId)
          
          // Get user bet details
          const userBet = await contract.getUserBet(roundId, account)
          
          return {
            roundId: roundId.toNumber(),
            option: option.toNumber(),
            amount: ethers.utils.formatEther(amount),
            txHash: event.transactionHash,
            blockNumber: event.blockNumber,
            claimed: userBet.claimed,
            question: roundInfo.question,
            options: roundInfo.options,
            resolved: roundInfo.resolved,
            correctOption: roundInfo.resolved ? roundInfo.correctOption : null,
            won: roundInfo.resolved ? option.toNumber() === roundInfo.correctOption : null
          }
        })
      )
      
      return bets.sort((a, b) => b.blockNumber - a.blockNumber)
      
    } catch (error) {
      console.error('Get bet history error:', error)
      return []
    }
  }, [contract, account])

  // Calculate potential winnings
  const calculatePotentialWinnings = useCallback(async (roundId, optionIndex, betAmount) => {
    if (!contract || !roundId || optionIndex === null || !betAmount) {
      return { potentialWinnings: '0', winningChance: 0 }
    }

    try {
      const roundInfo = await contract.getRoundInfo(roundId)
      const optionBets = await contract.getOptionBets(roundId, optionIndex)
      
      const totalPot = parseFloat(ethers.utils.formatEther(roundInfo.totalPot))
      const optionTotal = parseFloat(ethers.utils.formatEther(optionBets))
      const userBet = parseFloat(betAmount)
      
      // Calculate potential winnings if this option wins
      const newOptionTotal = optionTotal + userBet
      const newTotalPot = totalPot + userBet
      const potentialWinnings = newTotalPot * (userBet / newOptionTotal)
      
      // Calculate winning chance based on current bets (simplified)
      const winningChance = newOptionTotal / newTotalPot * 100
      
      return {
        potentialWinnings: potentialWinnings.toFixed(4),
        winningChance: winningChance.toFixed(1),
        multiplier: (potentialWinnings / userBet).toFixed(2)
      }
      
    } catch (error) {
      console.error('Calculate winnings error:', error)
      return { potentialWinnings: '0', winningChance: 0, multiplier: '0' }
    }
  }, [contract])

  // Update betting state
  const updateBettingState = useCallback((updates) => {
    setBettingState(prev => ({
      ...prev,
      ...updates
    }))
  }, [])

  return {
    // State
    isLoading,
    bettingState,
    
    // Actions
    placeBet,
    claimWinnings,
    getBetHistory,
    calculatePotentialWinnings,
    updateBettingState
  }
}
