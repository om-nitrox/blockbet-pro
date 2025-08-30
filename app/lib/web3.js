import { ethers } from 'ethers'

// Network configurations
export const NETWORKS = {
  MONAD_TESTNET: {
    chainId: '0xa1f6', // 41454 in hex
    chainName: 'Monad Testnet',
    rpcUrls: ['https://testnet-rpc.monad.xyz'],
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://testnet-explorer.monad.xyz'],
  },
  MONAD_MAINNET: {
    chainId: '0xa1f7', // 41455 in hex  
    chainName: 'Monad Mainnet',
    rpcUrls: ['https://rpc.monad.xyz'],
    nativeCurrency: {
      name: 'ETH', 
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.monad.xyz'],
  }
}

// Web3 utilities class
export class Web3Utils {
  constructor() {
    this.provider = null
    this.signer = null
    this.currentNetwork = null
  }

  // Initialize provider
  async initializeProvider() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await this.provider.getNetwork()
      this.currentNetwork = network
      
      return this.provider
    } catch (error) {
      console.error('Failed to initialize provider:', error)
      throw error
    }
  }

  // Get signer
  async getSigner() {
    if (!this.provider) {
      await this.initializeProvider()
    }

    try {
      this.signer = this.provider.getSigner()
      return this.signer
    } catch (error) {
      console.error('Failed to get signer:', error)
      throw error
    }
  }

  // Connect wallet
  async connectWallet() {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask')
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Initialize provider and signer
      await this.initializeProvider()
      await this.getSigner()
      
      // Get account address
      const address = await this.signer.getAddress()
      
      // Get balance
      const balance = await this.provider.getBalance(address)
      
      return {
        address,
        balance: ethers.utils.formatEther(balance),
        network: this.currentNetwork
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Switch network
  async switchNetwork(networkConfig) {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkConfig.chainId }],
      })
    } catch (switchError) {
      // Network doesn't exist, try to add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkConfig],
          })
        } catch (addError) {
          console.error('Failed to add network:', addError)
          throw addError
        }
      } else {
        console.error('Failed to switch network:', switchError)
        throw switchError
      }
    }
  }

  // Add token to wallet
  async addTokenToWallet(tokenConfig) {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed')
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: tokenConfig,
        },
      })
    } catch (error) {
      console.error('Failed to add token:', error)
      throw error
    }
  }

  // Format address
  static formatAddress(address, startChars = 6, endChars = 4) {
    if (!address) return ''
    return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
  }

  // Format ETH amount
  static formatEther(amount, decimals = 4) {
    if (!amount) return '0'
    try {
      const formatted = ethers.utils.formatEther(amount)
      return parseFloat(formatted).toFixed(decimals)
    } catch (error) {
      return '0'
    }
  }

  // Parse ETH amount
  static parseEther(amount) {
    try {
      return ethers.utils.parseEther(amount.toString())
    } catch (error) {
      throw new Error('Invalid amount format')
    }
  }

  // Validate address
  static isValidAddress(address) {
    return ethers.utils.isAddress(address)
  }

  // Get transaction receipt
  async getTransactionReceipt(txHash) {
    if (!this.provider) {
      await this.initializeProvider()
    }

    try {
      return await this.provider.getTransactionReceipt(txHash)
    } catch (error) {
      console.error('Failed to get transaction receipt:', error)
      throw error
    }
  }

  // Wait for transaction
  async waitForTransaction(txHash, confirmations = 1) {
    if (!this.provider) {
      await this.initializeProvider()
    }

    try {
      return await this.provider.waitForTransaction(txHash, confirmations)
    } catch (error) {
      console.error('Failed to wait for transaction:', error)
      throw error
    }
  }

  // Get gas price
  async getGasPrice() {
    if (!this.provider) {
      await this.initializeProvider()
    }

    try {
      return await this.provider.getGasPrice()
    } catch (error) {
      console.error('Failed to get gas price:', error)
      throw error
    }
  }

  // Estimate gas
  async estimateGas(contract, method, params = [], overrides = {}) {
    try {
      return await contract.estimateGas[method](...params, overrides)
    } catch (error) {
      console.error('Failed to estimate gas:', error)
      throw error
    }
  }
}

// Create global instance
export const web3Utils = new Web3Utils()

// Contract interaction helpers
export class ContractHelper {
  constructor(address, abi, provider) {
    this.address = address
    this.abi = abi
    this.provider = provider
    this.contract = null
  }

  // Initialize contract
  async init() {
    if (!this.provider) {
      throw new Error('Provider not initialized')
    }

    const signer = this.provider.getSigner()
    this.contract = new ethers.Contract(this.address, this.abi, signer)
    
    return this.contract
  }

  // Call read-only method
  async call(method, params = []) {
    if (!this.contract) {
      await this.init()
    }

    try {
      return await this.contract[method](...params)
    } catch (error) {
      console.error(`Failed to call ${method}:`, error)
      throw error
    }
  }

  // Send transaction
  async send(method, params = [], overrides = {}) {
    if (!this.contract) {
      await this.init()
    }

    try {
      const tx = await this.contract[method](...params, overrides)
      return tx
    } catch (error) {
      console.error(`Failed to send ${method}:`, error)
      throw error
    }
  }

  // Listen to events
  on(eventName, callback) {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    this.contract.on(eventName, callback)
  }

  // Remove event listener
  off(eventName, callback) {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    this.contract.off(eventName, callback)
  }

  // Get past events
  async getPastEvents(eventName, fromBlock = 0, toBlock = 'latest') {
    if (!this.contract) {
      await this.init()
    }

    try {
      const filter = this.contract.filters[eventName]()
      return await this.contract.queryFilter(filter, fromBlock, toBlock)
    } catch (error) {
      console.error(`Failed to get ${eventName} events:`, error)
      throw error
    }
  }
}

// Error handling utilities
export const handleWeb3Error = (error) => {
  console.error('Web3 Error:', error)

  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'Insufficient funds for transaction and gas'
  } else if (error.code === 'USER_REJECTED') {
    return 'Transaction rejected by user'
  } else if (error.code === 'NETWORK_ERROR') {
    return 'Network connection error'
  } else if (error.code === 'TIMEOUT') {
    return 'Transaction timed out'
  } else if (error.message?.includes('execution reverted')) {
    return 'Transaction failed: ' + error.reason || 'Unknown error'
  } else if (error.message?.includes('gas')) {
    return 'Transaction failed due to gas issues'
  } else {
    return error.message || 'Unknown error occurred'
  }
}

// Export default instance
export default web3Utils
