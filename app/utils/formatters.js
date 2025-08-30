import { ethers } from 'ethers'

// Format ETH amounts
export const formatEther = (value, decimals = 4) => {
  if (!value) return '0'
  try {
    const formatted = ethers.utils.formatEther(value)
    return parseFloat(formatted).toFixed(decimals)
  } catch (error) {
    return '0'
  }
}

// Format wallet addresses
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return ''
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

// Format large numbers
export const formatNumber = (num, decimals = 2) => {
  if (!num) return '0'
  
  const number = parseFloat(num)
  
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(decimals)}M`
  } else if (number >= 1000) {
    return `${(number / 1000).toFixed(decimals)}K`
  }
  
  return number.toFixed(decimals)
}

// Format percentages
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === '0' || !value) return '0.0'
  
  const percentage = (parseFloat(value) / parseFloat(total)) * 100
  return percentage.toFixed(decimals)
}

// Format time remaining
export const formatTimeRemaining = (timestamp) => {
  if (!timestamp) return 'No deadline'
  
  const now = Date.now()
  const end = timestamp * 1000
  const diff = end - now
  
  if (diff <= 0) return 'Expired'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  
  return `${minutes}m`
}

// Format transaction hash for display
export const formatTxHash = (hash, chars = 8) => {
  if (!hash) return ''
  return `${hash.slice(0, chars)}...`
}

// Format date
export const formatDate = (timestamp) => {
  if (!timestamp) return ''
  
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
