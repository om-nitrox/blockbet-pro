// General utility helper functions

/**
 * Format currency amounts
 */
export const formatCurrency = (amount, currency = 'ETH', decimals = 4) => {
  if (!amount || isNaN(amount)) return `0 ${currency}`
  
  const num = parseFloat(amount)
  if (num === 0) return `0 ${currency}`
  
  // Handle very small amounts
  if (num < 0.0001) {
    return `<0.0001 ${currency}`
  }
  
  // Handle large amounts with K/M notation
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M ${currency}`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K ${currency}`
  }
  
  return `${num.toFixed(decimals)} ${currency}`
}

/**
 * Format percentage with proper rounding
 */
export const formatPercentage = (value, total, decimals = 1) => {
  if (!total || total === 0 || !value) return '0%'
  
  const percentage = (parseFloat(value) / parseFloat(total)) * 100
  
  if (percentage < 0.1 && percentage > 0) {
    return '<0.1%'
  }
  
  return `${percentage.toFixed(decimals)}%`
}

/**
 * Format wallet addresses with different styles
 */
export const formatAddress = (address, style = 'short') => {
  if (!address) return ''
  
  switch (style) {
    case 'short':
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    case 'medium':
      return `${address.slice(0, 8)}...${address.slice(-6)}`
    case 'long':
      return `${address.slice(0, 12)}...${address.slice(-8)}`
    case 'full':
      return address
    default:
      return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
}

/**
 * Format transaction hashes
 */
export const formatTxHash = (hash, length = 8) => {
  if (!hash) return ''
  return `${hash.slice(0, length)}...`
}

/**
 * Format time differences (time ago)
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown'
  
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (seconds > 30) return `${seconds} seconds ago`
  
  return 'Just now'
}

/**
 * Format countdown timer
 */
export const formatCountdown = (endTime) => {
  if (!endTime) return 'No deadline'
  
  const now = Date.now()
  const end = typeof endTime === 'number' ? endTime * 1000 : new Date(endTime).getTime()
  const diff = end - now
  
  if (diff <= 0) return 'Expired'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  
  return `${seconds}s`
}

/**
 * Format dates in different styles
 */
export const formatDate = (timestamp, style = 'medium') => {
  if (!timestamp) return ''
  
  const date = new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp)
  
  const options = {
    short: {
      month: 'short',
      day: 'numeric'
    },
    medium: {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    full: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  }
  
  return date.toLocaleDateString('en-US', options[style] || options.medium)
}

/**
 * Calculate betting odds and multipliers
 */
export const calculateOdds = (optionAmount, totalPot) => {
  if (!optionAmount || !totalPot || totalPot === 0) {
    return { odds: '0.00', multiplier: '1.00' }
  }
  
  const option = parseFloat(optionAmount)
  const total = parseFloat(totalPot)
  
  if (option === 0) {
    return { odds: '∞', multiplier: '∞' }
  }
  
  const multiplier = total / option
  const odds = multiplier - 1
  
  return {
    odds: odds.toFixed(2),
    multiplier: multiplier.toFixed(2),
    percentage: ((option / total) * 100).toFixed(1)
  }
}

/**
 * Calculate potential winnings
 */
export const calculateWinnings = (betAmount, optionTotal, totalPot) => {
  if (!betAmount || !optionTotal || !totalPot) return '0'
  
  const bet = parseFloat(betAmount)
  const option = parseFloat(optionTotal)
  const total = parseFloat(totalPot)
  
  if (option === 0) return total.toFixed(4)
  
  const winnings = (bet * total) / option
  return winnings.toFixed(4)
}

/**
 * Generate random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Debounce function calls
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function calls
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clone objects
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  
  const cloned = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true
  if (Array.isArray(obj)) return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to URL slug
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Get emoji for status
 */
export const getStatusEmoji = (status) => {
  const statusEmojis = {
    active: '🟢',
    resolved: '🔴',
    pending: '🟡',
    upcoming: '🔵',
    cancelled: '⚫',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  
  return statusEmojis[status?.toLowerCase()] || '⚪'
}

/**
 * Get random item from array
 */
export const getRandomItem = (array) => {
  if (!array || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Chunk array into smaller arrays
 */
export const chunkArray = (array, size) => {
  if (!array || size <= 0) return []
  
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * Sort objects by key
 */
export const sortBy = (array, key, direction = 'asc') => {
  if (!array || !Array.isArray(array)) return []
  
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

/**
 * Group array by key
 */
export const groupBy = (array, key) => {
  if (!array || !Array.isArray(array)) return {}
  
  return array.reduce((groups, item) => {
    const group = item[key]
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(item)
    return groups
  }, {})
}

/**
 * Remove duplicates from array
 */
export const unique = (array, key = null) => {
  if (!array || !Array.isArray(array)) return []
  
  if (key) {
    const seen = new Set()
    return array.filter(item => {
      const value = item[key]
      if (seen.has(value)) return false
      seen.add(value)
      return true
    })
  }
  
  return [...new Set(array)]
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      if (typeof window === 'undefined') return defaultValue
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key) => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear: () => {
    try {
      if (typeof window === 'undefined') return false
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}

export default {
  formatCurrency,
  formatPercentage,
  formatAddress,
  formatTxHash,
  formatTimeAgo,
  formatCountdown,
  formatDate,
  calculateOdds,
  calculateWinnings,
  generateId,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  capitalize,
  slugify,
  getStatusEmoji,
  getRandomItem,
  chunkArray,
  sortBy,
  groupBy,
  unique,
  storage
}
