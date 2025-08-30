'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { MONAD_TESTNET } from '../lib/contract'

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!')
    }

    setIsConnecting(true)
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Check if connected to correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0xa1f6') { // 41454 in hex
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa1f6' }],
          })
        } catch (switchError) {
          // Network not added, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [MONAD_TESTNET],
            })
          }
        }
      }
      
      // Create provider and signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(web3Provider)
      
      const web3Signer = web3Provider.getSigner()
      setSigner(web3Signer)
      
      // Get account
      const address = await web3Signer.getAddress()
      setAccount(address)
      
      // Get balance
      const bal = await web3Provider.getBalance(address)
      setBalance(ethers.utils.formatEther(bal))
      
      return { provider: web3Provider, signer: web3Signer, account: address }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setBalance('0')
    setProvider(null)
    setSigner(null)
  }

  const updateBalance = async () => {
    if (provider && account) {
      const bal = await provider.getBalance(account)
      setBalance(ethers.utils.formatEther(bal))
    }
  }

  // Auto-connect if previously connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            connect().catch(console.error)
          }
        })
        .catch(console.error)
    }
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnect()
        } else {
          connect().catch(console.error)
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  return {
    account,
    balance,
    provider,
    signer,
    isConnecting,
    connect,
    disconnect,
    updateBalance
  }
}
