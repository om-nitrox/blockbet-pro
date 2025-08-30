'use client'
import { motion } from 'framer-motion'

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  text = null,
  className = '' 
}) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colors = {
    primary: 'border-purple-500',
    secondary: 'border-blue-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    danger: 'border-red-500',
    white: 'border-white'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`
          ${sizes[size]} 
          border-2 border-transparent border-t-current rounded-full
          ${colors[color]}
        `}
      />
      
      {/* Loading text */}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-3 text-gray-400 ${textSizes[size]}`}
        >
          {text}
        </motion.p>
      )}
    </div>
  )
}

// Alternative pulse spinner
export function PulseSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizes[size]} bg-gradient-to-r from-purple-500 to-pink-500 rounded-full`}
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
        className={`absolute inset-0 ${sizes[size]} bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full`}
      />
    </div>
  )
}

// Dots loading spinner
export function DotsSpinner({ className = '' }) {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
          className="w-2 h-2 bg-purple-500 rounded-full"
        />
      ))}
    </div>
  )
}
