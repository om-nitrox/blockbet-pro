'use client'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = true,
  glass = true,
  gradient = false,
  padding = 'lg',
  ...props 
}, ref) => {
  const baseClasses = "rounded-3xl transition-all duration-300 border"
  
  const glassClasses = glass ? 'glass' : 'bg-gray-900/50'
  const borderClasses = glass ? 'border-white/20' : 'border-gray-700'
  const hoverClasses = hover ? 'card-hover cursor-pointer' : ''
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white/10 to-white/5' : ''
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const combinedClasses = `
    ${baseClasses} 
    ${glassClasses} 
    ${borderClasses} 
    ${hoverClasses} 
    ${gradientClasses}
    ${paddingClasses[padding]}
    ${className}
  `.trim()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={combinedClasses}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'

export default Card
