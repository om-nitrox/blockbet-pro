// Input validation utilities for BlockBet application

/**
 * Validate Ethereum addresses
 */
export const validateAddress = (address) => {
  if (!address) {
    return { isValid: false, error: 'Address is required' }
  }
  
  if (typeof address !== 'string') {
    return { isValid: false, error: 'Address must be a string' }
  }
  
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { isValid: false, error: 'Invalid Ethereum address format' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate betting amounts
 */
export const validateBetAmount = (amount, minAmount = '0.001', maxAmount = '1000') => {
  if (!amount) {
    return { isValid: false, error: 'Bet amount is required' }
  }
  
  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Bet amount must be a valid number' }
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: 'Bet amount must be greater than 0' }
  }
  
  const minNum = parseFloat(minAmount)
  if (numAmount < minNum) {
    return { isValid: false, error: `Minimum bet amount is ${minAmount} ETH` }
  }
  
  const maxNum = parseFloat(maxAmount)
  if (numAmount > maxNum) {
    return { isValid: false, error: `Maximum bet amount is ${maxAmount} ETH` }
  }
  
  // Check for reasonable decimal places (max 6)
  const decimalPlaces = (amount.toString().split('.')[1] || '').length
  if (decimalPlaces > 6) {
    return { isValid: false, error: 'Maximum 6 decimal places allowed' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate round questions
 */
export const validateRoundQuestion = (question, minLength = 10, maxLength = 200) => {
  if (!question) {
    return { isValid: false, error: 'Question is required' }
  }
  
  if (typeof question !== 'string') {
    return { isValid: false, error: 'Question must be a string' }
  }
  
  const trimmed = question.trim()
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Question must be at least ${minLength} characters` }
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Question cannot exceed ${maxLength} characters` }
  }
  
  // Check for valid question format (should end with ?)
  if (!trimmed.endsWith('?')) {
    return { isValid: false, error: 'Question should end with a question mark (?)' }
  }
  
  // Check for inappropriate content (basic check)
  const inappropriateWords = ['scam', 'fraud', 'hack', 'steal', 'illegal']
  const lowerQuestion = trimmed.toLowerCase()
  for (const word of inappropriateWords) {
    if (lowerQuestion.includes(word)) {
      return { isValid: false, error: 'Question contains inappropriate content' }
    }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate round options
 */
export const validateRoundOptions = (options, minOptions = 2, maxOptions = 10) => {
  if (!options || !Array.isArray(options)) {
    return { isValid: false, error: 'Options must be an array' }
  }
  
  const validOptions = options.filter(opt => opt && opt.trim())
  
  if (validOptions.length < minOptions) {
    return { isValid: false, error: `At least ${minOptions} options are required` }
  }
  
  if (validOptions.length > maxOptions) {
    return { isValid: false, error: `Maximum ${maxOptions} options allowed` }
  }
  
  // Check for duplicate options
  const uniqueOptions = [...new Set(validOptions.map(opt => opt.trim().toLowerCase()))]
  if (uniqueOptions.length !== validOptions.length) {
    return { isValid: false, error: 'Duplicate options are not allowed' }
  }
  
  // Validate individual options
  for (const option of validOptions) {
    const trimmed = option.trim()
    
    if (trimmed.length < 1) {
      return { isValid: false, error: 'All options must have content' }
    }
    
    if (trimmed.length > 50) {
      return { isValid: false, error: 'Option text cannot exceed 50 characters' }
    }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate round ID
 */
export const validateRoundId = (roundId) => {
  if (!roundId && roundId !== 0) {
    return { isValid: false, error: 'Round ID is required' }
  }
  
  const numRoundId = Number(roundId)
  
  if (!Number.isInteger(numRoundId)) {
    return { isValid: false, error: 'Round ID must be an integer' }
  }
  
  if (numRoundId < 1) {
    return { isValid: false, error: 'Round ID must be greater than 0' }
  }
  
  if (numRoundId > 999999) {
    return { isValid: false, error: 'Round ID is too large' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate option index
 */
export const validateOptionIndex = (optionIndex, totalOptions) => {
  if (!optionIndex && optionIndex !== 0) {
    return { isValid: false, error: 'Option selection is required' }
  }
  
  const numIndex = Number(optionIndex)
  
  if (!Number.isInteger(numIndex)) {
    return { isValid: false, error: 'Option index must be an integer' }
  }
  
  if (numIndex < 0) {
    return { isValid: false, error: 'Option index cannot be negative' }
  }
  
  if (totalOptions && numIndex >= totalOptions) {
    return { isValid: false, error: 'Invalid option selected' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate transaction hash
 */
export const validateTxHash = (txHash) => {
  if (!txHash) {
    return { isValid: false, error: 'Transaction hash is required' }
  }
  
  if (typeof txHash !== 'string') {
    return { isValid: false, error: 'Transaction hash must be a string' }
  }
  
  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
    return { isValid: false, error: 'Invalid transaction hash format' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate email addresses
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' }
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate URLs
 */
export const validateUrl = (url, requireHttps = false) => {
  if (!url) {
    return { isValid: false, error: 'URL is required' }
  }
  
  try {
    const urlObj = new URL(url)
    
    if (requireHttps && urlObj.protocol !== 'https:') {
      return { isValid: false, error: 'URL must use HTTPS protocol' }
    }
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' }
    }
    
    return { isValid: true, error: null }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}

/**
 * Validate username/display names
 */
export const validateUsername = (username, minLength = 3, maxLength = 20) => {
  if (!username) {
    return { isValid: false, error: 'Username is required' }
  }
  
  if (typeof username !== 'string') {
    return { isValid: false, error: 'Username must be a string' }
  }
  
  const trimmed = username.trim()
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Username must be at least ${minLength} characters` }
  }
  
  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Username cannot exceed ${maxLength} characters` }
  }
  
  // Only allow alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' }
  }
  
  // Cannot start or end with underscore or hyphen
  if (/^[_-]|[_-]$/.test(trimmed)) {
    return { isValid: false, error: 'Username cannot start or end with underscore or hyphen' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate date/time inputs
 */
export const validateDateTime = (dateTime, futureOnly = true) => {
  if (!dateTime) {
    return { isValid: false, error: 'Date/time is required' }
  }
  
  const date = new Date(dateTime)
  
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date/time format' }
  }
  
  if (futureOnly && date.getTime() <= Date.now()) {
    return { isValid: false, error: 'Date/time must be in the future' }
  }
  
  // Check if date is too far in the future (e.g., more than 10 years)
  const maxFutureDate = new Date()
  maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 10)
  
  if (date.getTime() > maxFutureDate.getTime()) {
    return { isValid: false, error: 'Date/time is too far in the future' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate password strength
 */
export const validatePassword = (password, minLength = 8) => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` }
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long' }
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' }
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' }
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validate JSON strings
 */
export const validateJson = (jsonString) => {
  if (!jsonString) {
    return { isValid: false, error: 'JSON string is required' }
  }
  
  try {
    JSON.parse(jsonString)
    return { isValid: true, error: null }
  } catch {
    return { isValid: false, error: 'Invalid JSON format' }
  }
}

/**
 * Multi-field validation helper
 */
export const validateFields = (fields, validators) => {
  const errors = {}
  let isValid = true
  
  for (const [fieldName, value] of Object.entries(fields)) {
    if (validators[fieldName]) {
      const result = validators[fieldName](value)
      if (!result.isValid) {
        errors[fieldName] = result.error
        isValid = false
      }
    }
  }
  
  return { isValid, errors }
}

/**
 * Sanitize user input
 */
export const sanitizeInput = (input, options = {}) => {
  if (!input || typeof input !== 'string') return ''
  
  let sanitized = input.trim()
  
  if (options.removeHtml) {
    sanitized = sanitized.replace(/<[^>]*>/g, '')
  }
  
  if (options.removeScripts) {
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }
  
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength)
  }
  
  return sanitized
}

// Export all validators
export default {
  validateAddress,
  validateBetAmount,
  validateRoundQuestion,
  validateRoundOptions,
  validateRoundId,
  validateOptionIndex,
  validateTxHash,
  validateEmail,
  validateUrl,
  validateUsername,
  validateDateTime,
  validatePassword,
  validateJson,
  validateFields,
  sanitizeInput
}
