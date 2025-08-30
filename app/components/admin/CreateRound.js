'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useContract } from '../../hooks/useContract'
import { toast } from 'react-hot-toast'

export function CreateRound({ onRoundCreated }) {
  const { contract } = useContract()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [isLoading, setIsLoading] = useState(false)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const createRound = async () => {
    const validOptions = options.filter(opt => opt.trim())
    
    if (!question.trim() || validOptions.length < 2) {
      toast.error('Please provide a question and at least 2 options')
      return
    }

    try {
      setIsLoading(true)
      const tx = await contract.createRound(question.trim(), validOptions)
      
      toast.loading('Creating round...', { id: tx.hash })
      await tx.wait()
      
      toast.success('Round created successfully!', { id: tx.hash })
      
      // Reset form
      setQuestion('')
      setOptions(['', ''])
      
      if (onRoundCreated) onRoundCreated()
    } catch (error) {
      toast.error('Failed to create round: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-center">🚀 Create New Prediction Round</h3>
      
      <div className="space-y-6">
        {/* Question Input */}
        <div>
          <label className="block text-lg font-semibold mb-3">
            📝 Question
          </label>
          <input
            type="text"
            placeholder="e.g., Will Bitcoin hit $100,000 by end of 2025?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-lg font-semibold mb-3">
            ⚖️ Betting Options
          </label>
          <div className="space-y-3">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1} (e.g., ${index === 0 ? 'Yes' : 'No'})`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                {options.length > 2 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeOption(index)}
                    className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 rounded-xl flex items-center justify-center text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Add Option Button */}
          {options.length < 6 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addOption}
              className="mt-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Option</span>
            </motion.button>
          )}
        </div>

        {/* Create Button */}
        <div className="text-center pt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createRound}
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 disabled:cursor-not-allowed btn-glow"
          >
            {isLoading ? '⏳ Creating Round...' : '🚀 Create Round'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
