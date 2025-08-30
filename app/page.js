'use client'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useWallet } from './hooks/useWallet'
import { toast, Toaster } from 'react-hot-toast'
import { 
  Wallet, LogOut, Plus, Trophy, XCircle, Crown, 
  RefreshCw, Eye, CheckCircle, Target, Zap, Users, 
  Coins, Activity, Star, Gift, Lock
} from 'lucide-react'

// Simple Button Component
const Button = ({ children, onClick, disabled, loading, className = '', variant = 'primary' }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    admin: 'bg-orange-600 hover:bg-orange-700'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 text-white font-medium rounded-lg 
        disabled:opacity-50 transition-colors duration-200 
        flex items-center gap-2 ${styles[variant]} ${className}
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

// Simple Card Component
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 border ${className}`}>
    {children}
  </div>
)

// USER BETTING INTERFACE
const UserBetting = ({ roundData, contract, account, onRefresh, roundId }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('0.01')
  const [loading, setLoading] = useState(false)

  if (!roundData) {
    return (
      <Card className="text-center py-8">
        <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-bold text-gray-600">No Active Rounds</h3>
        <p className="text-gray-500">All rounds have been deleted or no rounds created yet</p>
      </Card>
    )
  }

  // Place Bet Function
  const handlePlaceBet = async () => {
    if (!contract || selectedOption === null || !betAmount) {
      toast.error('Select an option and enter bet amount')
      return
    }

    try {
      setLoading(true)
      const tx = await contract.placeBet(roundId, selectedOption, {
        value: ethers.utils.parseEther(betAmount),
        gasLimit: 200000
      })
      
      toast.promise(tx.wait(), {
        loading: '🎯 Placing bet...',
        success: '🎉 Bet placed successfully!',
        error: 'Failed to place bet'
      })

      await tx.wait()
      setSelectedOption(null)
      setBetAmount('0.01')
      onRefresh()
    } catch (error) {
      console.error('Bet error:', error)
      if (error.message.includes('Unauthorized')) {
        toast.error('Not authorized')
      } else if (error.message.includes('InvalidParams')) {
        toast.error('Invalid parameters - check your bet amount')
      } else if (error.message.includes('NotActive')) {
        toast.error('Round not active or betting closed')
      } else if (error.message.includes('InvalidOption')) {
        toast.error('Invalid option selected')
      } else {
        toast.error('Bet failed: ' + (error.reason || error.message))
      }
    } finally {
      setLoading(false)
    }
  }

  // Claim Winnings Function
  const handleClaimWinnings = async () => {
    try {
      setLoading(true)
      const tx = await contract.claimWinnings(roundId, { gasLimit: 150000 })
      
      toast.promise(tx.wait(), {
        loading: '💰 Claiming winnings...',
        success: '🎉 Winnings claimed! Check your wallet!',
        error: 'Failed to claim'
      })

      await tx.wait()
      
      setTimeout(() => {
        toast.success('💸 ETH transferred to your wallet successfully!', { duration: 6000 })
      }, 2000)
      
      onRefresh()
    } catch (error) {
      console.error('Claim error:', error)
      if (error.message.includes('NoClaim')) {
        toast.error('No winnings to claim')
      } else if (error.message.includes('AlreadyFinalized')) {
        toast.error('Already claimed')
      } else {
        toast.error('Claim failed: ' + (error.reason || error.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const totalPot = ethers.utils.formatEther(roundData.stats?.totalPot || '0')
  const userBet = roundData.userBet
  const canClaim = roundData.info.resolved && 
    userBet?.exists && 
    userBet.option === roundData.info.correctOption && 
    !userBet.claimed

  return (
    <Card>
      {/* Question */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {roundData.info.question}
      </h2>

      {/* Round Status */}
      <div className="mb-6 p-3 bg-gray-100 rounded-lg flex justify-between">
        <span><strong>Total Pool:</strong> {totalPot} ETH</span>
        <span className={`font-bold ${
          roundData.info.active ? 'text-green-600' : 
          roundData.info.resolved ? 'text-blue-600' : 'text-red-600'
        }`}>
          {roundData.info.active ? '🟢 BETTING OPEN' : 
           roundData.info.resolved ? '🏆 RESULTS ANNOUNCED' : '🔴 BETTING CLOSED'}
        </span>
      </div>

      {/* Results Announced Banner */}
      {roundData.info.resolved && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-4 border-green-400">
          <div className="text-center py-4">
            <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-green-800 mb-2">🏆 Results Announced!</h3>
            <p className="text-green-700 text-lg">
              Winner: <strong>"{roundData.options[roundData.info.correctOption]}"</strong>
            </p>
            <p className="text-green-600 mt-2">
              Winners can now claim their ETH rewards below! 💰
            </p>
          </div>
        </Card>
      )}

      {/* Betting Closed Banner (when not resolved yet) */}
      {!roundData.info.active && !roundData.info.resolved && (
        <Card className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-4 border-red-400">
          <div className="text-center py-4">
            <Lock className="w-12 h-12 text-red-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-800 mb-2">🔴 Betting Closed!</h3>
            <p className="text-red-700 text-lg">
              No more bets accepted. Waiting for admin to announce results.
            </p>
          </div>
        </Card>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {roundData.options.map((option, index) => {
          const optionTotal = ethers.utils.formatEther(roundData.optionTotals[index] || '0')
          const percentage = parseFloat(totalPot) > 0 ? 
            (parseFloat(optionTotal) / parseFloat(totalPot) * 100) : 0
          const isWinner = roundData.info.resolved && index === roundData.info.correctOption
          const isSelected = selectedOption === index

          return (
            <div
              key={index}
              onClick={() => roundData.info.active && setSelectedOption(index)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${isWinner ? 'border-green-500 bg-green-50 shadow-lg' : ''}
                ${!roundData.info.active ? 'cursor-not-allowed opacity-75' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`} />
                  <span className="font-bold">
                    {option}
                    {isWinner && (
                      <span className="text-green-600 ml-2 flex items-center gap-1">
                        🏆 <Trophy className="w-4 h-4" /> WINNER!
                      </span>
                    )}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{optionTotal} ETH</div>
                  <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* User's Bet Status */}
      {userBet?.exists && parseFloat(ethers.utils.formatEther(userBet.amount)) > 0 && (
        <Card className={`mb-6 ${
          canClaim ? 'bg-green-50 border-green-400 border-4 shadow-xl' : 
          roundData.info.resolved && userBet.option !== roundData.info.correctOption ? 'bg-red-50 border-red-400' : 
          'bg-blue-50 border-blue-400'
        } border-2`}>
          <div className="flex justify-between items-center">
            <div>
              <div className={`font-bold text-xl flex items-center gap-3 ${
                canClaim ? 'text-green-700' : 
                roundData.info.resolved ? 'text-red-700' : 'text-blue-700'
              }`}>
                {canClaim ? (
                  <>
                    <Gift className="w-8 h-8" />
                    🎉 YOU WON! Claim Your Reward!
                  </>
                ) : roundData.info.resolved ? (
                  <>
                    <XCircle className="w-8 h-8" />
                    😔 You Lost This Round
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
              {canClaim && (
                <div className="text-green-600 font-medium mt-1 animate-pulse">
                  💰 Click below to transfer your winnings to your wallet!
                </div>
              )}
            </div>
            {canClaim && (
              <Button 
                onClick={handleClaimWinnings} 
                loading={loading} 
                variant="success" 
                className="animate-bounce text-xl px-8 py-4"
              >
                <Trophy className="w-6 h-6" />
                Claim Winnings! 💰
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Betting Interface */}
      {roundData.info.active && account && !userBet?.exists && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            Place Your Bet - Win Real ETH!
          </h3>
          
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block font-medium mb-2">Bet Amount (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.001"
              />
            </div>
            
            <Button
              onClick={handlePlaceBet}
              disabled={selectedOption === null || loading}
              loading={loading}
              className="px-6 py-2"
            >
              <Zap className="w-4 h-4" />
              Place Bet
            </Button>
          </div>
          
          {selectedOption === null ? (
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Select an option above to place your bet
            </p>
          ) : (
            <div className="mt-3 p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
              <p className="text-blue-800 font-medium">
                🎯 Ready to bet {betAmount} ETH on "{roundData.options[selectedOption]}"
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Betting Closed Message for Users */}
      {!roundData.info.active && account && !roundData.info.resolved && (
        <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-300">
          <Lock className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <p className="text-red-700 font-bold">Betting is now closed for this round</p>
          <p className="text-red-600">Waiting for results to be announced</p>
        </div>
      )}

      {!account && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <Wallet className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500">Connect your wallet to place bets</p>
        </div>
      )}
    </Card>
  )
}

// ENHANCED ADMIN INTERFACE
const AdminPanel = ({ contract, onRefresh, activeRounds, roundData, currentRoundId }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)

  // Add Option
  const addOption = () => {
    if (options.length < 8) {
      setOptions([...options, ''])
    }
  }

  // Remove Option
  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  // Update Option
  const updateOption = (index, value) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  // Create Round
  const handleCreateRound = async () => {
    if (!question.trim()) {
      toast.error('Enter a question')
      return
    }

    const validOptions = options.filter(opt => opt.trim())
    if (validOptions.length < 2) {
      toast.error('Need at least 2 options')
      return
    }

    try {
      setLoading(true)
      const now = Math.floor(Date.now() / 1000)
      const tx = await contract.createRound(
        question,
        validOptions,
        now,
        now + 86400 // 24 hours
      )
      
      toast.promise(tx.wait(), {
        loading: '🚀 Creating round...',
        success: '🎉 Round created! Users can now place bets!',
        error: 'Failed to create'
      })
      
      await tx.wait()
      setQuestion('')
      setOptions(['', ''])
      onRefresh()
    } catch (error) {
      console.error('Create error:', error)
      toast.error('Create failed: ' + (error.reason || error.message))
    } finally {
      setLoading(false)
    }
  }

  // Delete All Rounds
  const handleDeleteAllRounds = async () => {
    try {
      setLoading(true)
      const tx = await contract.deleteAllRounds()
      
      toast.promise(tx.wait(), {
        loading: '🗑️ Deleting all rounds...',
        success: '✅ All rounds deleted! They will no longer appear in the UI.',
        error: 'Failed to delete all'
      })
      
      await tx.wait()
      
      setTimeout(() => {
        toast.success('🧹 All rounds cleared! Create new rounds to start fresh.', { duration: 6000 })
      }, 2000)
      
      onRefresh()
    } catch (error) {
      console.error('Delete all error:', error)
      toast.error('Delete all failed: ' + (error.reason || error.message))
    } finally {
      setLoading(false)
    }
  }

  // ENHANCED: Announce Winner Function with Better Messaging
  const handleAnnounceWinner = async (correctOption) => {
    try {
      setResolving(true)
      
      const tx = await contract.resolveRound(currentRoundId, correctOption)
      
      toast.promise(tx.wait(), {
        loading: `🎯 Announcing "${roundData.options[correctOption]}" as winner and closing betting...`,
        success: `🎉 WINNER ANNOUNCED! "${roundData.options[correctOption]}" wins! Betting is now CLOSED!`,
        error: 'Failed to announce results'
      })

      await tx.wait()
      
      // Enhanced success message with clear instructions
      setTimeout(() => {
        toast.success(
          `💰 Round finalized! Betting closed! Winners who bet on "${roundData.options[correctOption]}" can now claim their ETH in "Live Betting" tab!`, 
          { duration: 12000 }
        )
      }, 2000)
      
      onRefresh()
    } catch (error) {
      console.error('Resolve error:', error)
      if (error.message.includes('AlreadyFinalized')) {
        toast.error('Results already announced!')
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Only admin can announce results')
      } else {
        toast.error('Failed to announce results: ' + (error.reason || error.message))
      }
    } finally {
      setResolving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-orange-50 border-2 border-orange-300">
        <div className="text-center">
          <Crown className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-orange-800">👑 Admin Panel</h2>
          <p className="text-orange-600">Active Rounds: {activeRounds.length}</p>
        </div>
      </Card>

      {/* Create Round */}
      <Card className="bg-yellow-50 border-2 border-yellow-300">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Create New Round
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter betting question..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          <div>
            <label className="block font-bold mb-2">Options</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {options.length > 2 && (
                  <Button onClick={() => removeOption(index)} variant="danger" className="px-3">
                    ×
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 8 && (
              <Button onClick={addOption} className="mt-2" variant="primary">
                <Plus className="w-4 h-4" /> Add Option
              </Button>
            )}
          </div>

          <Button 
            onClick={handleCreateRound} 
            loading={loading}
            variant="warning" 
            className="w-full py-3 text-lg"
          >
            <Plus className="w-5 h-5" /> Create Round
          </Button>
        </div>
      </Card>

      {/* Delete All Rounds */}
      <Card className="bg-red-50 border-2 border-red-300">
        <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center gap-2">
          <XCircle className="w-6 h-6" />
          Delete All Rounds
        </h3>
        <p className="text-red-700 mb-4">
          This will soft-delete all rounds. They'll disappear from the UI but remain on blockchain for transparency.
        </p>
        <Button 
          onClick={handleDeleteAllRounds}
          loading={loading}
          variant="danger"
          className="w-full py-3"
        >
          <XCircle className="w-5 h-5" /> Delete All Rounds
        </Button>
      </Card>

      {/* ENHANCED: Announce Winner Section with Betting Status */}
      {roundData && roundData.options && roundData.options.length > 0 && !roundData.info.resolved && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400 shadow-xl">
          <div className="text-center mb-6">
            <Trophy className="w-20 h-20 text-green-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold text-green-800 mb-2">🎯 Announce Winner & Close Betting!</h3>
            
            {/* ENHANCED: Betting Status Display */}
            <div className={`p-4 rounded-xl mb-4 ${
              roundData.info.active ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-red-100 border-2 border-red-400'
            }`}>
              <p className={`font-bold text-xl flex items-center justify-center gap-2 ${
                roundData.info.active ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {roundData.info.active ? (
                  <>
                    <Zap className="w-6 h-6" />
                    🟢 BETTING IS OPEN
                  </>
                ) : (
                  <>
                    <Lock className="w-6 h-6" />
                    🔴 BETTING IS CLOSED
                  </>
                )}
              </p>
              <p className="text-gray-600 mt-1">
                {roundData.info.active 
                  ? 'Users can still place bets. Click below to announce winner and close betting.' 
                  : 'No more bets accepted. Ready to announce winner.'
                }
              </p>
            </div>
            
            <p className="text-green-700 text-xl mb-4">
              <strong>Question:</strong> "{roundData.info.question}"
            </p>
            <div className="bg-green-100 p-4 rounded-xl mb-4">
              <p className="text-green-800 font-bold text-2xl">
                💰 Total Pool: {ethers.utils.formatEther(roundData.stats?.totalPot || '0')} ETH
              </p>
              <p className="text-green-600 mt-2">This will be distributed to winners!</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-center text-green-800 font-bold text-2xl mb-6">
              👇 Click the CORRECT answer to announce winner & close betting:
            </h4>
            
            {/* ENHANCED: Options with Better Visual Design */}
            {roundData.options.map((option, index) => (
              <div key={index} className="bg-white rounded-xl border-3 border-green-200 shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:border-green-400">
                <div className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="text-3xl font-bold text-gray-800 mb-3">
                        {option}
                      </h5>
                      <div className="text-gray-600 text-lg">
                        <span className="font-medium">Total bets on this option: </span>
                        <span className="font-bold text-blue-600">
                          {ethers.utils.formatEther(roundData.optionTotals[index] || '0')} ETH
                        </span>
                        <div className="text-sm text-gray-500 mt-1">
                          {roundData.optionTotals && roundData.stats?.totalPot && parseFloat(ethers.utils.formatEther(roundData.stats.totalPot)) > 0 
                            ? `${((parseFloat(ethers.utils.formatEther(roundData.optionTotals[index] || '0')) / parseFloat(ethers.utils.formatEther(roundData.stats.totalPot))) * 100).toFixed(1)}% of total pool`
                            : '0% of total pool'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="ml-8">
                      <Button
                        onClick={() => handleAnnounceWinner(index)}
                        disabled={resolving}
                        loading={resolving}
                        variant="success"
                        className="px-12 py-6 text-2xl font-bold transform hover:scale-105 shadow-2xl"
                      >
                        <Trophy className="w-8 h-8 mr-3" />
                        🏆 ANNOUNCE & CLOSE!
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* ENHANCED: Warning Message */}
            <div className="bg-yellow-100 border-4 border-yellow-400 p-6 rounded-xl">
              <p className="text-yellow-800 font-bold text-center text-xl">
                ⚠️ Once you click "ANNOUNCE & CLOSE!", betting stops immediately and winners can claim their ETH!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* No Round to Announce */}
      {roundData && (roundData.info.active || roundData.info.resolved) && (
        <Card className="bg-gray-100 border-2 border-gray-300">
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-gray-600 mb-4">
              {roundData.info.active ? 'Round Still Active' : 'Results Already Announced'}
            </h3>
            <p className="text-gray-500">
              {roundData.info.active 
                ? 'Wait for betting to close before announcing results'
                : `Winner: "${roundData.options[roundData.info.correctOption]}"`
              }
            </p>
          </div>
        </Card>
      )}

      {/* ENHANCED: Already Resolved Display */}
      {roundData?.info.resolved && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-4 border-green-400">
          <div className="text-center py-8">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-6" />
            <h3 className="text-4xl font-bold text-green-800 mb-6">✅ Results Already Announced!</h3>
            <div className="bg-green-100 p-8 rounded-xl mb-6">
              <p className="text-green-800 font-bold text-2xl mb-4">
                Question: {roundData.info.question}
              </p>
              <p className="text-green-700 text-3xl font-bold mb-4">
                🏆 Winner: "{roundData.options[roundData.info.correctOption]}"
              </p>
              <p className="text-green-600 font-bold text-xl">
                💰 Pool: {ethers.utils.formatEther(roundData.stats?.totalPot || '0')} ETH
              </p>
            </div>
            
            <div className="bg-blue-100 p-6 rounded-xl border-4 border-blue-300">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h4 className="text-blue-800 font-bold text-2xl mb-3">
                📢 For Winners:
              </h4>
              <p className="text-blue-700 text-xl mb-3">
                Switch to <strong>"Live Betting"</strong> tab and click <strong>"Claim Winnings"</strong>
              </p>
              <p className="text-blue-600 text-lg">
                ETH will be transferred directly to your wallet! 💰
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

// MAIN APP
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
  const [activeRounds, setActiveRounds] = useState([])
  const [roundData, setRoundData] = useState(null)
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('betting')

  // Admin wallet
  const ADMIN_WALLET = '0xD41D2C8D846b547dF833Ba7978c20bC85BeB03DC'

  // Auto wallet change detection
  useEffect(() => {
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        disconnect()
        toast('Wallet disconnected')
      } else {
        toast.success('Wallet changed')
        setTimeout(() => window.location.reload(), 1000)
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

  // Admin detection
  useEffect(() => {
    const checkAdmin = async () => {
      if (account) {
        if (account.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
          setIsOwner(true)
          toast.success('👑 Admin access granted!')
          return
        }

        if (contract) {
          try {
            const owner = await contract.owner()
            setIsOwner(owner.toLowerCase() === account.toLowerCase())
          } catch (error) {
            setIsOwner(false)
          }
        }
      } else {
        setIsOwner(false)
      }
    }

    checkAdmin()
  }, [contract, account, ADMIN_WALLET])

  // Load round data with deletion check
  const loadRoundData = async (roundId) => {
    if (!contract || !activeRounds.includes(roundId)) return null

    try {
      setLoading(true)
      
      const [info, stats, options] = await Promise.all([
        contract.getRoundInfo(roundId),
        contract.getRoundStats(roundId),
        contract.getOptions(roundId)
      ])

      // Skip deleted rounds
      if (info.deleted) {
        console.log(`Round ${roundId} is deleted, skipping...`)
        return null
      }

      const optionTotals = await Promise.all(
        options.map((_, index) => contract.getOptionTotals(roundId, index))
      )

      let userBet = null
      if (account) {
        userBet = await contract.getUserBet(roundId, account)
      }

      return { info, stats: { totalPot: stats }, options, optionTotals, userBet }
    } catch (error) {
      console.error('Error loading round:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Load and filter active rounds
  useEffect(() => {
    const loadActiveRounds = async () => {
      if (!contract) return

      try {
        const roundsCount = await contract.roundsCount()
        const totalRounds = roundsCount.toNumber()
        
        // Find all non-deleted rounds
        const activeRoundIds = []
        
        for (let i = 0; i < totalRounds; i++) {
          try {
            const roundInfo = await contract.getRoundInfo(i)
            if (!roundInfo.deleted) {
              activeRoundIds.push(i)
            }
          } catch (error) {
            console.log(`Error checking round ${i}:`, error)
          }
        }
        
        console.log(`Found ${activeRoundIds.length} active rounds out of ${totalRounds} total`)
        setActiveRounds(activeRoundIds)
        
        if (activeRoundIds.length > 0) {
          // Set to latest active round
          const latestActiveRoundId = activeRoundIds[activeRoundIds.length - 1]
          setCurrentRoundId(latestActiveRoundId)
          const data = await loadRoundData(latestActiveRoundId)
          setRoundData(data)
        } else {
          // No active rounds
          setRoundData(null)
          if (totalRounds > 0) {
            toast.info('All rounds have been deleted by admin')
          }
        }
      } catch (error) {
        console.error('Error loading active rounds:', error)
      }
    }

    loadActiveRounds()
  }, [contract, account])

  // Refresh data
  const refreshData = async () => {
    if (contract) {
      // Reload active rounds list
      const roundsCount = await contract.roundsCount()
      const totalRounds = roundsCount.toNumber()
      
      const activeRoundIds = []
      for (let i = 0; i < totalRounds; i++) {
        try {
          const roundInfo = await contract.getRoundInfo(i)
          if (!roundInfo.deleted) {
            activeRoundIds.push(i)
          }
        } catch (error) {
          console.log(`Error checking round ${i}:`, error)
        }
      }
      
      setActiveRounds(activeRoundIds)
      
      // Refresh current round data if it's still active
      if (activeRoundIds.includes(currentRoundId)) {
        const data = await loadRoundData(currentRoundId)
        setRoundData(data)
      } else if (activeRoundIds.length > 0) {
        // Switch to latest active round
        const latestActiveRoundId = activeRoundIds[activeRoundIds.length - 1]
        setCurrentRoundId(latestActiveRoundId)
        const data = await loadRoundData(latestActiveRoundId)
        setRoundData(data)
      } else {
        // No active rounds left
        setRoundData(null)
      }
    }
  }

  const handleRoundChange = async (newRoundId) => {
    if (newRoundId !== currentRoundId && activeRounds.includes(newRoundId)) {
      setCurrentRoundId(newRoundId)
      const data = await loadRoundData(newRoundId)
      setRoundData(data)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🎯 BlockBet Pro</h1>
            {account && (
              <div className="flex items-center gap-4">
                <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
                <span className="font-bold">{parseFloat(balance).toFixed(4)} ETH</span>
                {isOwner && <span className="bg-yellow-500 px-2 py-1 rounded text-xs font-bold">👑 ADMIN</span>}
                <Button onClick={disconnect} variant="danger" className="text-sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {!account ? (
          // Connect Wallet
          <Card className="text-center py-12">
            <Wallet className="w-16 h-16 mx-auto mb-6 text-blue-500" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Connect MetaMask to start betting with real ETH</p>
            <Button 
              onClick={connect}
              disabled={isConnecting}
              loading={isConnecting}
              className="px-8 py-3 text-lg"
            >
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Tabs */}
            <Card>
              <div className="flex gap-2">
                <Button
                  onClick={() => setActiveTab('betting')}
                  variant={activeTab === 'betting' ? 'primary' : 'primary'}
                  className={activeTab !== 'betting' ? 'opacity-50' : ''}
                >
                  <Eye className="w-4 h-4" />
                  Live Betting
                </Button>
                
                {isOwner && (
                  <Button
                    onClick={() => setActiveTab('admin')}
                    variant={activeTab === 'admin' ? 'admin' : 'admin'}
                    className={activeTab !== 'admin' ? 'opacity-50' : ''}
                  >
                    <Crown className="w-4 h-4" />
                    👑 Admin Control
                  </Button>
                )}
              </div>
            </Card>

            {/* Round Selector - Only show active rounds */}
            {activeRounds.length > 0 && activeTab === 'betting' && (
              <Card>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">
                    Select Round ({activeRounds.length} active)
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={currentRoundId}
                      onChange={(e) => handleRoundChange(Number(e.target.value))}
                      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {/* Only show non-deleted rounds */}
                      {activeRounds.map((roundId) => (
                        <option key={roundId} value={roundId}>
                          Round {roundId + 1}
                        </option>
                      ))}
                    </select>
                    <Button onClick={refreshData} loading={loading} className="text-sm">
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Content */}
            {activeTab === 'betting' ? (
              <UserBetting
                roundData={roundData}
                contract={contract}
                account={account}
                onRefresh={refreshData}
                roundId={currentRoundId}
              />
            ) : (
              <AdminPanel
                contract={contract}
                onRefresh={refreshData}
                activeRounds={activeRounds}
                roundData={roundData}
                currentRoundId={currentRoundId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
