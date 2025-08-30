'use client'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Users, CheckCircle } from 'lucide-react'

export default function OptionsList({ 
  options, 
  optionBets, 
  totalPot, 
  selectedOption, 
  onSelectOption,
  isActive,
  resolvedOption = null,
  userBet = null 
}) {
  if (!options || options.length === 0) return null

  return (
    <div className="space-y-4">
      {options.map((option, index) => {
        const betAmount = parseFloat(optionBets[index] || '0')
        const percentage = parseFloat(totalPot) > 0 ? (betAmount / parseFloat(totalPot)) * 100 : 0
        const isSelected = selectedOption === index
        const isWinner = resolvedOption !== null && index === resolvedOption
        const isUserBet = userBet && userBet.option === index

        return (
          <motion.div
            key={index}
            whileHover={isActive ? { scale: 1.02, y: -2 } : {}}
            whileTap={isActive ? { scale: 0.98 } : {}}
            onClick={() => isActive && onSelectOption(index)}
            className={`
              relative cursor-pointer rounded-3xl border-2 transition-all duration-500 overflow-hidden p-6 lg:p-8
              ${isSelected 
                ? 'border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-500/25' 
                : 'border-white/20 hover:border-white/40 bg-gradient-to-r from-white/5 to-white/10'
              }
              ${isWinner 
                ? 'border-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/25' 
                : ''
              }
              ${isUserBet && !isWinner
                ? 'border-blue-400 bg-gradient-to-r from-blue-500/20 to-cyan-500/20'
                : ''
              }
              ${!isActive ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
            `}
          >
            {/* Progress bar background */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Selection glow effect */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 animate-pulse"
              />
            )}
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Selection indicator */}
                <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-3 transition-all duration-300 flex-shrink-0 ${
                  isSelected 
                    ? 'border-purple-400 bg-gradient-to-r from-purple-400 to-pink-400' 
                    : 'border-white/40'
                }`}>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center"
                    >
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </motion.div>
                  )}
                </div>
                
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl lg:text-2xl font-bold text-white">
                      {option}
                    </span>
                    
                    {/* Winner badge */}
                    {isWinner && (
                      <motion.span
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl lg:text-3xl"
                      >
                        🏆
                      </motion.span>
                    )}
                    
                    {/* User bet indicator */}
                    {isUserBet && (
                      <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                        Your Bet
                      </div>
                    )}
                  </div>
                  
                  <div className="text-gray-400 text-sm">
                    {isActive ? 'Click to select' : 'Betting closed'}
                  </div>
                </div>
              </div>
              
              {/* Stats section */}
              <div className="text-center">
                <div className="text-xl lg:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  {betAmount.toFixed(3)} ETH
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1 ${
                    percentage > 50 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {percentage > 50 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
      
      {/* Selection hint */}
      {isActive && selectedOption === null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-300 rounded-2xl border border-yellow-500/20">
            <span>👆</span>
            <span>Select an option to place your bet</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
