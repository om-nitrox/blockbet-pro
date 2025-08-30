// app/hooks/useWallet.js
'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract'

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask!')
    }

    setIsConnecting(true)
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Check if connected to correct network - FIXED CHAIN ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0x279f') { // 10143 in hex (CORRECT FOR MONAD TESTNET)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x279f' }], // CORRECTED
          })
        } catch (switchError) {
          // Network not added, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x279f', // CORRECTED
                chainName: 'Monad Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://testnet-rpc.monad.xyz'],
                blockExplorerUrls: ['https://testnet.monadexplorer.com']
              }],
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

      // Create contract instance with YOUR deployed contract
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS, // Your contract: 0x04257401736295c7a73491092a278a7e08b2288a
        CONTRACT_ABI,
        web3Signer
      )
      setContract(contractInstance)
      
      setIsConnected(true)
      
      return { provider: web3Provider, signer: web3Signer, account: address, contract: contractInstance }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setBalance('0')
    setProvider(null)
    setSigner(null)
    setContract(null)
    setIsConnected(false)
  }

  const updateBalance = async () => {
    if (provider && account) {
      const bal = await provider.getBalance(account)
      setBalance(ethers.utils.formatEther(bal))
    }
  }

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Auto-connect if previously connected
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
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
    if (typeof window !== 'undefined' && window.ethereum) {
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
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  return {
    account,
    balance,
    provider,
    signer,
    contract, // Added contract instance
    isConnecting,
    isConnected, // Added connection status
    connect,
    disconnect,
    updateBalance,
    formatAddress // Added address formatter
  }
}
