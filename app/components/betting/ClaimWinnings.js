'use client'
import { motion } from 'framer-motion'
import { Trophy, Star, Coins } from 'lucide-react'
import Button from '../ui/button'
import Card from '../ui/card'

export default function ClaimWinnings({ 
  roundInfo, 
  userBet, 
  onClaim, 
  isLoading 
}) {
  if (!roundInfo?.resolved || !userBet) return null
  
  const isWinner = userBet.option === roundInfo.correctOption
  const canClaim = isWinner && !userBet.claimed
  
  if (!canClaim) return null

  // Calculate estimated winnings
  const userBetAmount = parseFloat(userBet.amount)
  const totalPot = parseFloat(roundInfo.totalPot)
  const winningOptionTotal = parseFloat(roundInfo.optionBets[roundInfo.correctOption] || '0')
  const estimatedWinnings = winningOptionTotal > 0 ? (userBetAmount * totalPot) / winningOptionTotal : 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      {/* Celebration Card */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-6 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-yellow-500/5 to-green-500/5 animate-pulse" />
        
        <div className="relative z-10 p-8">
          {/* Animated trophy */}
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          
          <h3 className="text-3xl font-bold text-green-300 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-400/80 mb-4">
            You predicted correctly and won the round!
          </p>
          
          {/* Winning details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-center items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white">
                Your bet: <span className="font-bold text-yellow-400">{userBet.amount} ETH</span>
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-white">
                Estimated winnings: <span className="font-bold text-green-400">{estimatedWinnings.toFixed(4)} ETH</span>
              </span>
            </div>
            <div className="text-sm text-gray-400">
              Won on: "{roundInfo.options[roundInfo.correctOption]}"
            </div>
          </div>
        </div>
      </Card>
      
      {/* Claim Button */}
      <Button
        onClick={onClaim}
        disabled={isLoading}
        loading={isLoading}
        variant="success"
        size="lg"
        icon={<Trophy className="w-6 h-6" />}
        className="pulse-glow text-xl py-6 px-10"
      >
        {isLoading ? 'Claiming Winnings...' : '🎉 Claim Your Winnings! 🎉'}
      </Button>
      
      {/* Additional info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-sm text-gray-400"
      >
        <p>🔒 Funds will be transferred to your wallet instantly</p>
        <p className="mt-1">⚡ No gas fees on Monad blockchain</p>
      </motion.div>
    </motion.div>
  )
}
