'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useContract } from '../../hooks/useContract'
import { toast } from 'react-hot-toast'

export function ResolveRound({ currentRoundId, onRoundResolved }) {
  const { contract, roundInfo, loadRoundInfo } = useContract()
  const [isLoading, setIsLoading] = useState(false)

  const resolveRound = async (winningOption) => {
    if (!contract) return

    try {
      setIsLoading(true)
      const tx = await contract.resolveRound(currentRoundId, winningOption)
      
      toast.loading('Resolving round...', { id: tx.hash })
      await tx.wait()
      
      toast.success('Round resolved successfully!', { id: tx.hash })
      
      if (onRoundResolved) onRoundResolved()
    } catch (error) {
      toast.error('Failed to resolve round: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!roundInfo) {
    return (
      <div className="text-center py-8">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-gray-400">Loading round information...</p>
      </div>
    )
  }

  if (!roundInfo.active) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-bold mb-4">🏁 Round Resolution</h3>
        <p className="text-gray-400 text-lg mb-4">
          {roundInfo.resolved 
            ? `Round ${currentRoundId} has already been resolved.`
            : `Round ${currentRoundId} is not active.`
          }
        </p>
        {roundInfo.resolved && (
          <div className="glass rounded-2xl p-6 max-w-md mx-auto">
            <h4 className="font-bold mb-2">🏆 Winning Option:</h4>
            <p className="text-xl text-yellow-400">
              {roundInfo.options[roundInfo.correctOption]}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center">
        🏁 Resolve Round {currentRoundId}
      </h3>
      
      <div className="glass rounded-2xl p-6 mb-6">
        <h4 className="text-xl font-bold mb-4 text-yellow-400">
          {roundInfo.question}
        </h4>
        <div className="flex items-center justify-center space-x-6 text-lg">
          <span>💰 Total Pot: {roundInfo.totalPot} ETH</span>
          <span className="text-green-400">🟢 Active</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-center mb-4">
          Select the winning option:
        </h4>
        
        {roundInfo.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => resolveRound(index)}
            disabled={isLoading}
            className="w-full glass rounded-2xl p-6 border-2 border-white/20 hover:border-green-400 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-left"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold mb-2">{option}</div>
                <div className="text-sm text-gray-400">
                  Click to declare as winner
                </div>
              </div>
              <div className="text-2xl">
                {isLoading ? '⏳' : '🏆'}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
        <p className="text-sm text-yellow-300 text-center">
          ⚠️ <strong>Warning:</strong> Once a round is resolved, it cannot be changed. 
          Make sure to select the correct winning option.
        </p>
      </div>
    </motion.div>
  )
}
