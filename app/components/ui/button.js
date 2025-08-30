'use client'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Button = forwardRef(({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  size = 'md', 
  icon,
  loading = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = "relative font-semibold rounded-2xl transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:cursor-not-allowed flex items-center justify-center gap-2"
  
  const variants = {
    primary: `
      bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 
      hover:from-purple-700 hover:via-pink-700 hover:to-red-600
      text-white shadow-lg hover:shadow-xl
      disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600
      focus:ring-purple-500
    `,
    secondary: `
      bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 
      hover:from-blue-700 hover:via-cyan-700 hover:to-teal-600
      text-white shadow-lg hover:shadow-xl
      disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600
      focus:ring-blue-500
    `,
    success: `
      bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 
      hover:from-green-700 hover:via-emerald-700 hover:to-teal-600
      text-white shadow-lg hover:shadow-xl
      disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600
      focus:ring-green-500
    `,
    warning: `
      bg-gradient-to-r from-yellow-600 via-orange-600 to-red-500 
      hover:from-yellow-700 hover:via-orange-700 hover:to-red-600
      text-white shadow-lg hover:shadow-xl
      disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600
      focus:ring-yellow-500
    `,
    ghost: `
      bg-white/10 hover:bg-white/20 
      border border-white/30 hover:border-white/50
      text-white backdrop-blur-sm
      disabled:bg-gray-600/20 disabled:border-gray-600/30 disabled:text-gray-400
      focus:ring-white/50
    `,
    outline: `
      border-2 border-purple-500 hover:border-purple-400
      text-purple-400 hover:text-purple-300
      hover:bg-purple-500/10
      disabled:border-gray-600 disabled:text-gray-400
      focus:ring-purple-500
    `
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm h-9',
    md: 'px-6 py-3 text-base h-11',
    lg: 'px-8 py-4 text-lg h-13'
  }

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <div className="spinner" />
        ) : (
          <>
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </div>
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
