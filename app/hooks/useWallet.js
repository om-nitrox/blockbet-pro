'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-hot-toast'
//import { initContract, getContract } from '../../lib/constants.js'
// ✅ Correct - import from contract.js
import { initContract, getContract } from '../lib/contract.js'

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isConnecting, setIsConnecting] = useState(false)
  const [contract, setContract] = useState(null)

  // Connect wallet function
  const connect = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!')
      return
    }

    try {
      setIsConnecting(true)
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAccount(account)

        // Initialize contract
        const contractInstance = await initContract(window.ethereum)
        setContract(contractInstance)

        // Get balance
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(account)
        setBalance(ethers.utils.formatEther(balance))

        toast.success('Wallet connected successfully!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null)
    setBalance('0')
    setContract(null)
    toast.info('Wallet disconnected')
  }

  // Update balance
  const updateBalance = async () => {
    if (account && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(account)
        setBalance(ethers.utils.formatEther(balance))
      } catch (error) {
        console.error('Error updating balance:', error)
      }
    }
  }

  // Auto-connect on page load
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          })

          if (accounts.length > 0) {
            const account = accounts[0]
            setAccount(account)

            // Initialize contract
            const contractInstance = await initContract(window.ethereum)
            setContract(contractInstance)

            // Get balance
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(account)
            setBalance(ethers.utils.formatEther(balance))
          }
        } catch (error) {
          console.error('Error auto-connecting:', error)
        }
      }
    }

    autoConnect()
  }, [])

  return {
    account,
    balance,
    isConnecting,
    contract,
    connect,
    disconnect,
    updateBalance
  }
}
