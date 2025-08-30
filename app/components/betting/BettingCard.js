'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, Trophy } from 'lucide-react'
import { useContract } from '../../hooks/useContract'
import { formatEther } from '../../utils/formatters'
import { toast } from 'react-hot-toast'

export function BettingCard({ roundId, roundInfo, onUpdate }) {
  const { contract } = useContract()
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('0.01')
  const [isLoading, setIsLoading] = useState(false)

  if (!roundInfo) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-3xl p-8 text-center"
      >
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400">Loading round information...</p>
      </motion.div>
    )
  }

  const placeBet = async () => {
    if (!contract || selectedOption === null || !betAmount) {
      toast.error('Please select an option and enter bet amount')
      return
    }

    try {
      setIsLoading(true)
      const tx = await contract.placeBet(roundId, selectedOption, {
        value: ethers.utils.parseEther(betAmount)
      })
      
      toast.loading('Transaction submitted...', { id: tx.hash })
      await tx.wait()
      
      toast.success('Bet placed successfully!', { id: tx.hash })
      onUpdate()
      setSelectedOption(null)
    } catch (error) {
      toast.error('Failed to place bet: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const claimWinnings = async () => {
    if (!contract) return
    
    try {
      setIsLoading(true)
      const tx = await contract.claimWinnings(roundId)
      
      toast.loading('Claiming winnings...', { id: tx.hash })
      await tx.wait()
      
      toast.success('Winnings claimed successfully!', { id: tx.hash })
      onUpdate()
    } catch (error) {
      toast.error('Failed to claim winnings: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-3xl p-8 card-hover"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-yellow-400">
          {roundInfo.question}
        </h2>
        <div className="flex justify-center items-center space-x-8 text-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <span>💰 {roundInfo.totalPot} ETH</span>
          </div>
          <div className={`px-4 py-2 rounded-full font-medium ${
            roundInfo.active ? 'bg-green-500/20 text-green-300' :
            roundInfo.resolved ? 'bg-red-500/20 text-red-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            {roundInfo.active ? '🟢 Active' : roundInfo.resolved ? '🔴 Resolved' : '⏸️ Inactive'}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-8">
        {roundInfo.options.map((option, index) => {
          const isSelected = selectedOption === index
          const isWinner = roundInfo.resolved && index === roundInfo.correctOption

          return (
            <motion.div
              key={index}
              whileHover={roundInfo.active ? { scale: 1.02 } : {}}
              whileTap={roundInfo.active ? { scale: 0.98 } : {}}
              onClick={() => roundInfo.active && setSelectedOption(index)}
              className={`
                relative cursor-pointer rounded-2xl border-2 transition-all duration-300 overflow-hidden p-6
                ${isSelected ? 'border-purple-400 bg-purple-500/20' : 'border-white/20 hover:border-white/40'}
                ${isWinner ? 'border-green-400 bg-green-500/20' : ''}
                ${!roundInfo.active ? 'cursor-not-allowed opacity-75' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 ${
                    isSelected ? 'border-purple-400 bg-purple-400' : 'border-white/40'
                  }`} />
                  <span className="text-xl font-semibold">
                    {option}
                    {isWinner && <span className="ml-3 text-2xl">🏆</span>}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold">Select to Bet</div>
                  <div className="text-sm text-gray-400">Click here</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Betting Interface */}
      {roundInfo.active && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-xl font-bold mb-4 text-center">💸 Place Your Bet</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              placeholder="0.01"
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-center font-medium"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={placeBet}
              disabled={selectedOption === null || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 disabled:cursor-not-allowed btn-glow"
            >
              {isLoading ? '⏳ Betting...' : '🎯 Place Bet'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Claim Winnings */}
      {roundInfo.resolved && roundInfo.userCanClaim && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={claimWinnings}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 btn-glow"
          >
            {isLoading ? '⏳ Claiming...' : '🎉 Claim Your Winnings! 🎉'}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
