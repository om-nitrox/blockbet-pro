'use client'
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './useWallet'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'

export function useContract() {
  const { signer, account } = useWallet()
  const [contract, setContract] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [roundInfo, setRoundInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize contract
  useEffect(() => {
    if (signer) {
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
      
      // Check if user is owner
      contractInstance.owner()
        .then(owner => {
          setIsOwner(account?.toLowerCase() === owner.toLowerCase())
        })
        .catch(console.error)
    }
  }, [signer, account])

  // Load round information
  const loadRoundInfo = useCallback(async (roundId) => {
    if (!contract) return

    setIsLoading(true)
    try {
      const info = await contract.getRoundInfo(roundId)
      
      const roundData = {
        question: info[0],
        options: info[1],
        active: info[2],
        resolved: info[3],
        totalPot: ethers.utils.formatEther(info[4]),
        correctOption: info[5].toNumber()
      }

      // Get additional info if user is connected
      if (account) {
        try {
          // Get user's bet
          const userBet = await contract.getUserBet(roundId, account)
          roundData.userBet = {
            option: userBet[0].toNumber(),
            amount: ethers.utils.formatEther(userBet[1]),
            claimed: userBet[2]
          }

          // Check if user can claim winnings
          roundData.userCanClaim = roundData.resolved && 
            roundData.userBet.amount !== '0.0' &&
            roundData.userBet.option === roundData.correctOption &&
            !roundData.userBet.claimed

          // Get option bets
          const optionBets = []
          for (let i = 0; i < roundData.options.length; i++) {
            const optionBet = await contract.getOptionBets(roundId, i)
            optionBets.push(ethers.utils.formatEther(optionBet))
          }
          roundData.optionBets = optionBets
        } catch (error) {
          console.error('Error loading user-specific data:', error)
        }
      }

      setRoundInfo(roundData)
    } catch (error) {
      console.error('Error loading round info:', error)
      setRoundInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [contract, account])

  // Generic contract call function
  const callContract = useCallback(async (method, args = [], options = {}) => {
    if (!contract) throw new Error('Contract not initialized')
    
    const tx = await contract[method](...args, options)
    if (tx.wait) {
      await tx.wait()
    }
    return tx
  }, [contract])

  // Read-only contract call
  const readContract = useCallback(async (method, args = []) => {
    if (!contract) return null
    
    try {
      return await contract[method](...args)
    } catch (error) {
      console.error(`Error calling ${method}:`, error)
      return null
    }
  }, [contract])

  return {
    contract,
    isOwner,
    roundInfo,
    isLoading,
    loadRoundInfo,
    callContract,
    readContract
  }
}
