'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './hooks/useWallet'
import { toast } from 'react-hot-toast'
import { 
  Wallet, LogOut, Plus, Trophy, Zap, Target, Crown, Eye, Activity, 
  RefreshCw, BarChart3, Shield, CheckCircle, XCircle, TrendingUp,
  Users, Coins, Timer, Award, Star, Sparkles
} from 'lucide-react'

// Button Component
const Button = ({ children, onClick, disabled, loading, className = '', variant = 'primary' }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700', 
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    ghost: 'bg-gray-600 hover:bg-gray-700',
    admin: 'bg-orange-600 hover:bg-orange-700'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 text-white font-medium rounded-lg 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200 flex items-center gap-2 hover:transform hover:scale-105
        ${styles[variant]} ${className}
      `}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

// Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 border ${className}`}>
    {children}
  </div>
)

// Tab Navigation
const TabNavigation = ({ activeTab, setActiveTab, isOwner }) => (
  <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
    <div className="flex gap-3">
      <Button
        onClick={() => setActiveTab('betting')}
        variant={activeTab === 'betting' ? 'primary' : 'ghost'}
        className="flex items-center gap-2"
      >
        <BarChart3 className="w-5 h-5" />
        🎯 Live Betting
      </Button>
      
      {isOwner && (
        <Button
          onClick={() => setActiveTab('admin')}
          variant={activeTab === 'admin' ? 'admin' : 'ghost'}
          className="flex items-center gap-2"
        >
          <Crown className="w-5 h-5" />
          👑 Admin Control
        </Button>
      )}
    </div>
  </Card>
)

// Wallet Info Component
const WalletInfo = ({ account, balance, disconnect, isOwner }) => (
  <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
    <div className="flex justify-between items-center">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-gray-800 text-lg">
            {account?.slice(0, 8)}...{account?.slice(-6)}
          </span>
          {isOwner && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse">
              <Crown className="w-4 h-4" />
              ADMIN WALLET
            </span>
          )}
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
        <div className="text-sm text-gray-600">
          💰 Balance updates when you bet/win
        </div>
      </div>
      <Button 
        onClick={disconnect} 
        variant="danger" 
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Disconnect
      </Button>
    </div>
  </Card>
)

// Enhanced Admin Panel with ALL Features
const AdminPanel = ({ contract, onRefresh, roundData, currentRoundId, totalRounds }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '']) // Start with 2 empty options
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)

  // CRITICAL: Add option function
  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ''])
      toast.success(`Option ${options.length + 1} added!`)
    } else {
      toast.error('Maximum 10 options allowed')
    }
  }

  // CRITICAL: Remove option function - THIS WAS MISSING
  const removeOption = (indexToRemove) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, index) => index !== indexToRemove)
      setOptions(newOptions)
      toast.success('Option removed!')
    } else {
      toast.error('Minimum 2 options required')
    }
  }

  // Update option function
  const updateOption = (index, value) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  // Create round function
  const handleCreateRound = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question')
      return
    }

    const validOptions = options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      toast.error('Please enter at least 2 valid options')
      return
    }

    try {
      setLoading(true)
      console.log('🚀 Creating round:', { question, validOptions })
      
      const now = Math.floor(Date.now() / 1000)
      const tx = await contract.createRound(
        question,
        validOptions,
        now,
        now + 86400, // 24 hours
        500, // 5% fee
        100, // 1% bonus
        ethers.constants.AddressZero,
        { gasLimit: 400000 }
      )
      
      toast.promise(tx.wait(), {
        loading: 'Creating betting round... 🚀',
        success: '🎉 Round created! Users can now place bets!',
        error: 'Failed to create round'
      })
      
      await tx.wait()
      console.log('✅ Round created successfully!')
      
      // Reset form
      setQuestion('')
      setOptions(['', ''])
      onRefresh()
    } catch (error) {
      console.error('❌ Create round failed:', error)
      toast.error('Failed to create round: ' + (error.reason || error.message))
    } finally {
      setLoading(false)
    }
  }

  // CRITICAL: Resolve round function - ANNOUNCE CORRECT ANSWER
  const handleResolveRound = async (correctOption) => {
    if (!contract || !roundData) {
      toast.error('Contract or round data not available')
      return
    }

    try {
      setResolving(true)
      console.log('⚖️ Resolving round:', { 
        roundId: currentRoundId, 
        correctOption, 
        optionText: roundData.options[correctOption] 
      })
      
      const tx = await contract.resolveRound(currentRoundId, correctOption, {
        gasLimit: 300000
      })
      
      toast.promise(tx.wait(), {
        loading: `Announcing "${roundData.options[correctOption]}" as the correct answer... ⚖️`,
        success: `✅ Round resolved! "${roundData.options[correctOption]}" was correct! Winners can claim rewards!`,
        error: 'Failed to resolve round'
      })

      await tx.wait()
      console.log('✅ Round resolved successfully!')
      
      // Refresh after resolution
      setTimeout(() => {
        onRefresh()
        toast.success('🏆 Round closed! Winners can now claim their ETH!', { duration: 6000 })
      }, 2000)
      
    } catch (error) {
      console.error('❌ Resolve failed:', error)
      toast.error('Failed to resolve: ' + (error.reason || error.message))
    } finally {
      setResolving(false)
    }
  }

  // Quick templates
  const templates = [
    { question: "Will Bitcoin reach $100,000 by end of 2025?", options: ["Yes", "No"] },
    { question: "Which team will win the next World Cup?", options: ["Brazil", "Argentina", "France", "Other"] },
    { question: "Will Ethereum reach $10,000 in 2025?", options: ["Yes", "No"] },
    { question: "Will it rain tomorrow?", options: ["Yes", "No"] },
    { question: "Which crypto will perform better this month?", options: ["Bitcoin", "Ethereum", "Solana", "Other"] }
  ]

  return (
    <div className="space-y-8">
      {/* Admin Dashboard Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-4 border-orange-300">
        <div className="text-center mb-6">
          <Crown className="w-20 h-20 text-orange-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-4xl font-bold text-orange-800 mb-2">👑 ADMIN DASHBOARD</h2>
          <p className="text-orange-600 text-xl font-medium">
            Admin Wallet: 0xD41D...03DC
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-xl">
            <BarChart3 className="w-10 h-10 mx-auto mb-3" />
            <div className="text-4xl font-bold">{totalRounds}</div>
            <div className="text-sm opacity-90">Total Rounds</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-xl">
            <Coins className="w-10 h-10 mx-auto mb-3" />
            <div className="text-4xl font-bold">
              {roundData ? ethers.utils.formatEther(roundData.stats.totalPot || '0') : '0'}
            </div>
            <div className="text-sm opacity-90">Pool (ETH)</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-xl">
            <Activity className="w-10 h-10 mx-auto mb-3" />
            <div className="text-4xl font-bold">
              {roundData?.info.active ? 'LIVE' : roundData?.info.resolved ? 'ENDED' : 'READY'}
            </div>
            <div className="text-sm opacity-90">Status</div>
          </div>
        </div>
      </Card>

      {/* CRITICAL: ANNOUNCE CORRECT ANSWER SECTION */}
      {roundData && !roundData.info.resolved && !roundData.info.active && (
        <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-4 border-red-400 shadow-2xl">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-4xl font-bold text-red-800 mb-4">
              🎯 ANNOUNCE THE CORRECT ANSWER!
            </h3>
            <div className="bg-red-100 p-6 rounded-xl mb-6 border-2 border-red-300">
              <p className="text-red-700 text-2xl font-bold mb-2">
                Question: {roundData.info.question}
              </p>
              <p className="text-red-800 font-bold text-3xl">
                💰 Total Pool: {ethers.utils.formatEther(roundData.stats.totalPot)} ETH
              </p>
              <p className="text-red-600 text-lg mt-2">
                This will be distributed to winners!
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-center text-red-800 font-bold text-2xl mb-8">
              👇 CLICK THE CORRECT ANSWER:
            </h4>
            
            <div className="grid gap-6">
              {roundData.options.map((option, index) => {
                const optionTotal = ethers.utils.formatEther(roundData.optionTotals[index] || '0')
                const totalPot = ethers.utils.formatEther(roundData.stats.totalPot || '1')
                const percentage = (parseFloat(optionTotal) / parseFloat(totalPot)) * 100

                return (
                  <div key={index} className="bg-white rounded-2xl border-4 border-red-200 shadow-2xl overflow-hidden hover:shadow-3xl transition-all transform hover:scale-102">
                    <div className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="text-3xl font-bold text-gray-800 mb-4">{option}</h5>
                          <div className="grid grid-cols-2 gap-6 text-gray-600">
                            <div>
                              <span className="text-sm text-gray-500">Total Bets:</span>
                              <div className="font-bold text-xl">{optionTotal} ETH</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Share:</span>
                              <div className="font-bold text-xl">{percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-10">
                          <Button
                            onClick={() => handleResolveRound(index)}
                            disabled={resolving}
                            loading={resolving}
                            variant="success"
                            className="px-10 py-8 text-2xl font-bold transform hover:scale-110 shadow-xl"
                          >
                            <Trophy className="w-10 h-10" />
                            THIS IS CORRECT! ✅
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="bg-yellow-100 border-4 border-yellow-400 p-6 rounded-xl">
              <p className="text-yellow-800 font-bold text-center text-xl">
                ⚠️ <strong>WARNING:</strong> Once you announce the winner, it cannot be changed! 
                Winners will immediately be able to claim their ETH.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Already Resolved Display */}
      {roundData?.info.resolved && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400">
          <div className="text-center py-8">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <h3 className="text-4xl font-bold text-green-800 mb-6">✅ Round Successfully Resolved!</h3>
            <div className="bg-green-100 p-8 rounded-xl mb-6">
              <p className="text-green-800 font-bold text-2xl mb-4">
                Question: {roundData.info.question}
              </p>
              <p className="text-green-700 text-3xl font-bold">
                🏆 Winner: "{roundData.options[roundData.info.correctOption]}"
              </p>
            </div>
            <p className="text-green-600 font-bold text-xl">
              Winners can now claim their ETH rewards! 💰
            </p>
          </div>
        </Card>
      )}

      {/* Quick Templates */}
      <Card className="bg-green-50 border-2 border-green-300">
        <h3 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          🚀 Quick Question Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <button
              key={index}
              onClick={() => {
                setQuestion(template.question)
                setOptions([...template.options])
                toast.success('Template loaded! 📝')
              }}
              className="p-6 bg-green-100 hover:bg-green-200 rounded-xl text-left transition-all border-2 border-green-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="font-bold text-green-800 mb-3">
                {template.question}
              </div>
              <div className="text-sm text-green-600">
                Options: {template.options.join(', ')}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Create New Round - WITH DELETE BUTTONS */}
      <Card className="bg-yellow-50 border-4 border-yellow-400">
        <div className="text-center mb-8">
          <Plus className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">🎲 Create New Betting Round</h2>
        </div>
        
        <div className="space-y-8">
          {/* Question Input */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-3">
              📝 Betting Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your betting question..."
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-500 text-xl"
            />
          </div>

          {/* Options with DELETE buttons */}
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-3">
              🎯 Answer Options
            </label>
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
                    />
                  </div>
                  
                  {/* CRITICAL: DELETE BUTTON - This was missing/not working */}
                  {options.length > 2 && (
                    <Button 
                      onClick={() => removeOption(index)}
                      variant="danger"
                      className="px-4 py-3 text-lg"
                      title={`Delete Option ${index + 1}`}
                    >
                      <XCircle className="w-5 h-5" />
                      Delete
                    </Button>
                  )}
                  
                  <div className="text-gray-500 text-sm font-medium">
                    Option {index + 1}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Option Button */}
            {options.length < 10 && (
              <Button 
                onClick={addOption} 
                variant="ghost" 
                className="mt-4 text-lg"
              >
                <Plus className="w-5 h-5" /> 
                Add Another Option
              </Button>
            )}
            
            <div className="text-sm text-gray-500 mt-2">
              You can have between 2-10 options. Currently: {options.length}
            </div>
          </div>

          {/* Create Button */}
          <Button 
            onClick={handleCreateRound} 
            loading={loading}
            variant="warning" 
            className="w-full py-6 text-2xl font-bold"
            disabled={!question.trim() || options.filter(o => o.trim()).length < 2}
          >
            <Plus className="w-8 h-8" />
            🚀 Create Round & Start Betting!
          </Button>
        </div>
      </Card>

      {/* Admin Instructions */}
      <Card className="bg-blue-50 border-2 border-blue-300">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6" />
          📋 Admin Instructions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-blue-700 mb-2">Creating Rounds:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Enter a clear question</li>
              <li>• Add 2-10 answer options</li>
              <li>• Use delete buttons to remove options</li>
              <li>• Click create to start betting</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-blue-700 mb-2">Resolving Rounds:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Wait for betting period to end</li>
              <li>• Click correct answer to resolve</li>
              <li>• Winners can immediately claim ETH</li>
              <li>• Decision cannot be changed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Simplified Betting Component (for users)
const BettingRound = ({ roundId, roundData, contract, account, onRefresh, isOwner }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('0.01')
  const [loading, setLoading] = useState(false)

  if (!roundData) {
    return (
      <Card className="text-center py-16">
        <Eye className="w-20 h-20 mx-auto mb-6 text-gray-400" />
        <h3 className="text-2xl font-bold text-gray-600 mb-4">No Round Data</h3>
        <p className="text-gray-500">Round {roundId} not available</p>
      </Card>
    )
  }

  const handlePlaceBet = async () => {
    if (!contract || selectedOption === null || !betAmount) {
      toast.error('Please select an option and enter bet amount')
      return
    }

    try {
      setLoading(true)
      const tx = await contract.placeBet(roundId, selectedOption, {
        value: ethers.utils.parseEther(betAmount),
        gasLimit: 200000
      })
      
      toast.promise(tx.wait(), {
        loading: `Placing ${betAmount} ETH bet... 🎯`,
        success: `🎉 Bet placed on "${roundData.options[selectedOption]}"!`,
        error: 'Failed to place bet'
      })

      await tx.wait()
      setSelectedOption(null)
      setBetAmount('0.01')
      onRefresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to place bet: ' + (error.reason || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleClaimWinnings = async () => {
    try {
      setLoading(true)
      const tx = await contract.claimWinnings(roundId, { gasLimit: 150000 })
      
      toast.promise(tx.wait(), {
        loading: 'Claiming winnings... 💰',
        success: '🎉 Winnings claimed successfully!',
        error: 'Failed to claim'
      })

      await tx.wait()
      onRefresh()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to claim: ' + (error.reason || error.message))
    } finally {
      setLoading(false)
    }
  }

  const totalPot = ethers.utils.formatEther(roundData.stats.totalPot || '0')
  const userBet = roundData.userBet
  const canClaim = roundData.info.resolved && 
    userBet?.exists && 
    userBet.option === roundData.info.correctOption && 
    !userBet.claimed

  const isLoser = roundData.info.resolved && 
    userBet?.exists && 
    userBet.option !== roundData.info.correctOption

  return (
    <Card>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {roundData.info.question}
      </h2>
      
      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center">
          <Coins className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{totalPot}</div>
          <div className="text-sm opacity-80">Total Pool (ETH)</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-center">
          <Users className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{roundData.options.length}</div>
          <div className="text-sm opacity-80">Options</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {roundData.optionTotals.filter(t => parseFloat(ethers.utils.formatEther(t || '0')) > 0).length}
          </div>
          <div className="text-sm opacity-80">Active Bets</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 rounded-xl text-center">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {roundData.info.active ? 'LIVE' : roundData.info.resolved ? 'ENDED' : 'CLOSED'}
          </div>
          <div className="text-sm opacity-80">Status</div>
        </div>
      </div>

      {/* Betting Options */}
      <div className="space-y-4 mb-8">
        {roundData.options.map((option, index) => {
          const optionTotal = ethers.utils.formatEther(roundData.optionTotals[index] || '0')
          const percentage = parseFloat(totalPot) > 0 ? 
            (parseFloat(optionTotal) / parseFloat(totalPot) * 100) : 0
          const isWinner = roundData.info.resolved && index === roundData.info.correctOption
          const isSelected = selectedOption === index

          return (
            <div
              key={index}
              onClick={() => roundData.info.active && !isOwner && setSelectedOption(index)}
              className={`
                p-6 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden
                ${isSelected 
                  ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg transform scale-105' 
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                }
                ${isWinner ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-lg' : ''}
                ${!roundData.info.active || isOwner ? 'cursor-not-allowed opacity-75' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-white rounded-full m-auto mt-0.5"></div>}
                  </div>
                  <span className="text-xl font-bold flex items-center gap-2">
                    {option}
                    {isWinner && (
                      <span className="flex items-center gap-1 text-green-600">
                        <Trophy className="w-6 h-6" />
                        WINNER!
                      </span>
                    )}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold">{optionTotal} ETH</div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* User Bet Status */}
      {userBet?.exists && parseFloat(ethers.utils.formatEther(userBet.amount)) > 0 && (
        <Card className={`mb-6 ${
          canClaim ? 'bg-green-50 border-4 border-green-400' : 
          isLoser ? 'bg-red-50 border-4 border-red-400' : 
          'bg-blue-50 border-4 border-blue-400'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`font-bold text-2xl flex items-center gap-3 ${
                canClaim ? 'text-green-700' : 
                isLoser ? 'text-red-700' : 
                'text-blue-700'
              }`}>
                {canClaim ? (
                  <>
                    <Trophy className="w-8 h-8" />
                    🎉 YOU WON!
                  </>
                ) : isLoser ? (
                  <>
                    <XCircle className="w-8 h-8" />
                    😔 You Lost
                  </>
                ) : (
                  <>
                    <Target className="w-8 h-8" />
                    Your Active Bet
                  </>
                )}
              </div>
              <div className="text-lg mt-2">
                {ethers.utils.formatEther(userBet.amount)} ETH on "{roundData.options[userBet.option]}"
              </div>
            </div>
            {canClaim && (
              <Button 
                onClick={handleClaimWinnings}
                loading={loading}
                variant="success"
                className="animate-pulse text-xl px-8 py-4"
              >
                <Trophy className="w-6 h-6" />
                Claim Winnings! 💰
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Betting Interface */}
      {roundData.info.active && account && !userBet?.exists && !isOwner && (
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-4 border-purple-300">
          <h3 className="font-bold text-2xl mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-purple-600" />
            Place Your Bet - Win Real ETH!
          </h3>
          
          <div className="flex gap-6 items-end mb-6">
            <div className="flex-1">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                💰 Bet Amount (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-xl font-bold"
                placeholder="0.001"
              />
            </div>
            
            <Button
              onClick={handlePlaceBet}
              disabled={selectedOption === null || loading}
              loading={loading}
              className="px-8 py-4 text-xl"
            >
              <Zap className="w-6 h-6" />
              Bet {betAmount} ETH 🚀
            </Button>
          </div>
          
          {selectedOption === null ? (
            <p className="text-center text-gray-600 text-lg flex items-center justify-center gap-2">
              <Target className="w-6 h-6" />
              👆 Select an option above to place your bet
            </p>
          ) : (
            <div className="p-6 bg-blue-100 rounded-xl border-2 border-blue-300">
              <p className="text-blue-800 font-bold text-center text-xl">
                🎯 Ready to bet {betAmount} ETH on "{roundData.options[selectedOption]}"
              </p>
            </div>
          )}
        </Card>
      )}

      {isOwner && roundData.info.active && (
        <Card className="bg-yellow-50 border-4 border-yellow-300">
          <div className="text-center py-6">
            <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Admin Notice</h3>
            <p className="text-yellow-700 text-lg">
              As admin, you cannot place bets. Use Admin Control to manage rounds.
            </p>
          </div>
        </Card>
      )}

      {!account && (
        <Card className="text-center py-12 bg-gray-50">
          <Wallet className="w-16 h-16 mx-auto mb-6 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-600 mb-4">Connect Your Wallet</h3>
          <p className="text-gray-500 text-lg">Connect to place bets and win real ETH!</p>
        </Card>
      )}
    </Card>
  )
}

// Main App Component
export default function BlockBetApp() {
  const {
    account,
    balance,
    connect,
    disconnect,
    isConnecting,
    contract
  } = useWallet()

  const [currentRoundId, setCurrentRoundId] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [roundData, setRoundData] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('betting')

  // FORCE ADMIN RIGHTS for your specific wallet
  const ADMIN_WALLET = '0xD41D2C8D846b547dF833Ba7978c20bC85BeB03DC'

  // Wallet change detection
  useEffect(() => {
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        disconnect()
        toast.info('Wallet disconnected')
      } else {
        toast.success('Wallet changed - updating...')
        setTimeout(() => window.location.reload(), 1500)
      }
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [disconnect])

  // CRITICAL: Admin detection - FORCE for your wallet
  useEffect(() => {
    const checkOwnership = async () => {
      if (account) {
        console.log('🔍 Checking admin status for:', account)
        console.log('🎯 Admin wallet:', ADMIN_WALLET)
        
        // Force admin rights for your specific wallet
        if (account.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
          console.log('👑 ADMIN WALLET DETECTED!')
          setIsOwner(true)
          toast.success('👑 ADMIN ACCESS GRANTED! You can create and resolve rounds!')
          return
        }

        // Check contract owner as backup
        if (contract) {
          try {
            const ownerAddress = await contract.owner()
            console.log('📄 Contract owner:', ownerAddress)
            
            const isContractOwner = ownerAddress.toLowerCase() === account.toLowerCase()
            setIsOwner(isContractOwner)
            
            if (isContractOwner) {
              toast.success('👑 Contract owner detected! Admin access granted!')
            }
          } catch (error) {
            console.error('❌ Error checking contract owner:', error)
            setIsOwner(false)
          }
        }
      } else {
        setIsOwner(false)
      }
    }

    checkOwnership()
  }, [contract, account, ADMIN_WALLET])

  // Load round data
  const loadRoundData = async (roundId) => {
    if (!contract || roundId >= totalRounds) return null

    try {
      setLoading(true)
      
      const [info, stats, options] = await Promise.all([
        contract.getRoundInfo(roundId),
        contract.getRoundStats(roundId),
        contract.getOptions(roundId)
      ])

      const optionTotals = await Promise.all(
        options.map((_, index) => contract.getOptionTotals(roundId, index))
      )

      let userBet = null
      if (account) {
        userBet = await contract.getUserBet(roundId, account)
      }

      return { info, stats, options, optionTotals, userBet }
    } catch (error) {
      console.error('Error loading round:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!contract) return

      try {
        const roundsCount = await contract.roundsCount()
        setTotalRounds(roundsCount.toNumber())

        if (roundsCount.toNumber() > 0) {
          const latestRoundId = roundsCount.toNumber() - 1
          setCurrentRoundId(latestRoundId)
          const data = await loadRoundData(latestRoundId)
          setRoundData(data)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }

    loadInitialData()
  }, [contract, account])

  // Auto-refresh every 15 seconds
  useEffect(() => {
    if (!contract || totalRounds === 0) return

    const interval = setInterval(async () => {
      const data = await loadRoundData(currentRoundId)
      setRoundData(data)
      
      try {
        const roundsCount = await contract.roundsCount()
        const newTotal = roundsCount.toNumber()
        if (newTotal !== totalRounds) {
          setTotalRounds(newTotal)
          if (newTotal > totalRounds) {
            setCurrentRoundId(newTotal - 1)
          }
        }
      } catch (error) {
        console.error('Error updating rounds:', error)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [contract, currentRoundId, totalRounds])

  // Refresh function
  const refreshData = async () => {
    if (contract) {
      const data = await loadRoundData(currentRoundId)
      setRoundData(data)
      
      try {
        const roundsCount = await contract.roundsCount()
        setTotalRounds(roundsCount.toNumber())
      } catch (error) {
        console.error('Error updating rounds count:', error)
      }
    }
  }

  const handleRoundChange = async (newRoundId) => {
    if (newRoundId !== currentRoundId && newRoundId < totalRounds) {
      setCurrentRoundId(newRoundId)
      const data = await loadRoundData(newRoundId)
      setRoundData(data)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold mb-3 flex items-center gap-4">
                🎯 BlockBet Pro
                <span className="text-lg font-normal bg-white/20 px-4 py-2 rounded-full">
                  v3.0
                </span>
              </h1>
              <p className="text-blue-100 text-xl">
                Real Money Prediction Markets • Instant Payouts • Zero Fees*
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200">Smart Contract:</div>
              <div className="font-mono text-white text-lg">
                {formatAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)}
              </div>
              <div className="text-sm text-blue-200 mt-1">Monad Testnet</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {!account ? (
          // Welcome Screen
          <Card className="text-center py-20">
            <Sparkles className="w-24 h-24 mx-auto mb-8 text-blue-500" />
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              🚀 Welcome to BlockBet Pro!
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              The ultimate prediction market platform where you can bet real ETH 
              and win big! Lightning fast, secure, and completely decentralized.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <div className="p-8 bg-blue-50 rounded-2xl border-2 border-blue-200">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-bold text-xl text-gray-800 mb-3">Lightning Fast</h3>
                <p className="text-gray-600">Instant settlements on Monad blockchain</p>
              </div>
              <div className="p-8 bg-green-50 rounded-2xl border-2 border-green-200">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-bold text-xl text-gray-800 mb-3">100% Secure</h3>
                <p className="text-gray-600">Smart contract guaranteed fairness</p>
              </div>
              <div className="p-8 bg-purple-50 rounded-2xl border-2 border-purple-200">
                <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-xl text-gray-800 mb-3">Real Rewards</h3>
                <p className="text-gray-600">Win real ETH instantly</p>
              </div>
            </div>
            
            <Button 
              onClick={connect}
              disabled={isConnecting}
              loading={isConnecting}
              className="px-16 py-6 text-2xl font-bold shadow-2xl"
            >
              <Wallet className="w-8 h-8" />
              Connect Wallet & Start Betting! 🎰
            </Button>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Wallet Info */}
            <WalletInfo 
              account={account}
              balance={balance}
              disconnect={disconnect}
              isOwner={isOwner}
            />

            {/* Tab Navigation */}
            <TabNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              isOwner={isOwner} 
            />

            {/* Main Content */}
            {activeTab === 'betting' ? (
              <div className="space-y-8">
                {/* Round Selector */}
                {totalRounds > 0 && (
                  <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-4 border-indigo-300">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Eye className="w-8 h-8 text-indigo-600" />
                        Select Betting Round
                      </h2>
                      <div className="flex items-center gap-4">
                        <select
                          value={currentRoundId}
                          onChange={(e) => handleRoundChange(Number(e.target.value))}
                          className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 font-bold text-lg"
                        >
                          {Array.from({ length: totalRounds }, (_, i) => (
                            <option key={i} value={i}>
                              🎯 Round {i + 1}
                            </option>
                          ))}
                        </select>
                        <Button onClick={refreshData} loading={loading} variant="ghost" className="text-lg">
                          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Live Betting Interface */}
                {totalRounds > 0 ? (
                  <BettingRound
                    roundId={currentRoundId}
                    roundData={roundData}
                    contract={contract}
                    account={account}
                    onRefresh={refreshData}
                    isOwner={isOwner}
                  />
                ) : (
                  <Card className="text-center py-20">
                    <Eye className="w-24 h-24 text-gray-400 mx-auto mb-8" />
                    <h3 className="text-3xl font-bold text-gray-600 mb-6">
                      No Betting Rounds Available Yet
                    </h3>
                    <p className="text-xl text-gray-500 mb-10">
                      {isOwner 
                        ? "🎉 You're the admin! Create the first betting round to get started." 
                        : "🚀 Exciting prediction markets are coming soon!"
                      }
                    </p>
                    {isOwner && (
                      <Button
                        onClick={() => setActiveTab('admin')}
                        variant="admin"
                        className="px-10 py-5 text-xl"
                      >
                        <Crown className="w-8 h-8" />
                        Create First Round
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            ) : (
              // Admin Panel
              <AdminPanel 
                contract={contract}
                onRefresh={refreshData}
                roundData={roundData}
                currentRoundId={currentRoundId}
                totalRounds={totalRounds}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
