'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Zap, Shield, Award, BarChart3, Users, RefreshCw, 
  TrendingUp, Play, CheckCircle, Pause, Star, Wallet, LogOut, 
  Sparkles 
} from 'lucide-react'
import { toast } from 'react-hot-toast'

// Mock hook for demo
const useMockContract = () => {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState('0')
  const [isOwner, setIsOwner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const mockRounds = {
    1: {
      question: "Will Bitcoin hit $100k by end of 2025?",
      options: ["Yes", "No"],
      active: true,
      resolved: false,
      totalPot: "2.456",
      correctOption: 0,
      optionBets: ["1.234", "1.222"],
      userBet: null
    },
    2: {
      question: "Will India win the World Cup 2025?",
      options: ["Yes", "No", "Draw"],
      active: false,
      resolved: true,
      totalPot: "5.789",
      correctOption: 0,
      optionBets: ["3.456", "1.333", "1.000"],
      userBet: { option: 0, amount: "0.5", claimed: false }
    },
    3: {
      question: "Will Ethereum reach $10k in 2025?",
      options: ["Yes", "No"],
      active: true,
      resolved: false,
      totalPot: "0.123",
      correctOption: 0,
      optionBets: ["0.023", "0.100"],
      userBet: null
    }
  }

  const connectWallet = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setAccount('0x1234...6fA5')
    setBalance('10.456')
    setIsOwner(true)
    setIsLoading(false)
    toast.success('🎉 Wallet Connected!')
  }

  const disconnect = () => {
    setAccount(null)
    setBalance('0')
    setIsOwner(false)
    toast.success('Wallet Disconnected!')
  }

  const loadRoundInfo = async (roundId) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsLoading(false)
    return mockRounds[roundId] || null
  }

  const placeBet = async (roundId, option, amount) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    toast.success('🎉 Bet placed successfully!')
    setIsLoading(false)
  }

  const createRound = async (question, options) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('🚀 Round created!')
    setIsLoading(false)
  }

  const resolveRound = async (roundId, option) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('✅ Round resolved!')
    setIsLoading(false)
  }

  const claimWinnings = async (roundId) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('💰 Winnings claimed!')
    setIsLoading(false)
  }

  return {
    account,
    balance,
    isOwner,
    isLoading,
    connectWallet,
    disconnect,
    loadRoundInfo,
    placeBet,
    createRound,
    resolveRound,
    claimWinnings
  }
}

// Button Component
const Button = ({ children, onClick, disabled, loading, variant = 'primary', size = 'md', icon, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600',
    secondary: 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-600',
    success: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-500 hover:from-green-700 hover:via-emerald-700 hover:to-teal-600',
    warning: 'bg-gradient-to-r from-yellow-600 via-orange-600 to-red-500 hover:from-yellow-700 hover:via-orange-700 hover:to-red-600',
    ghost: 'bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        disabled:opacity-50 disabled:cursor-not-allowed
        text-white font-bold rounded-2xl
        transition-all duration-300
        backdrop-blur-sm
        shadow-lg hover:shadow-2xl
        relative overflow-hidden
        group flex items-center justify-center gap-2
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </div>
    </motion.button>
  )
}

// Card Component
const Card = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 
        shadow-xl hover:shadow-2xl transition-all duration-300
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
          animate={{
            y: [0, -200, 0],
            x: [0, 100, 0],
            opacity: [0, 0.8, 0],
            scale: [0.1, 1, 0.1],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ icon, title, value, change, trend }) => {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-all duration-500 shadow-xl hover:shadow-2xl"
    >
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl">
            {icon}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className="text-sm text-gray-400">{title}</div>
          {change && (
            <div className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {change}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Premium Header Component
const PremiumHeader = ({ account, balance, onConnect, onDisconnect, isLoading, isOwner }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20">
      <div className="h-full bg-black/20 backdrop-blur-2xl border-b border-white/10">
        <div className="h-full max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                BlockBet Pro
              </h1>
              <p className="text-sm text-gray-400">Powered by Monad Blockchain</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            {account ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl px-6 py-3 border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{account}</div>
                    <div className="text-xs text-green-400 font-bold">{balance} ETH</div>
                  </div>
                </div>
                {isOwner && (
                  <div className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                    👑 ADMIN
                  </div>
                )}
                <Button
                  onClick={onDisconnect}
                  variant="ghost"
                  size="sm"
                  icon={<LogOut className="w-4 h-4" />}
                />
              </motion.div>
            ) : (
              <Button 
                onClick={onConnect}
                disabled={isLoading}
                loading={isLoading}
                size="lg"
                className="btn-glow"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Main HomePage Component
export default function HomePage() {
  const {
    account,
    balance,
    isOwner,
    isLoading,
    connectWallet,
    disconnect,
    loadRoundInfo,
    placeBet,
    createRound,
    resolveRound,
    claimWinnings
  } = useMockContract()

  const [currentRoundId, setCurrentRoundId] = useState(1)
  const [roundInfo, setRoundInfo] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [betAmount, setBetAmount] = useState('0.01')
  const [activeTab, setActiveTab] = useState('betting')

  // Admin state
  const [newQuestion, setNewQuestion] = useState('')
  const [newOptions, setNewOptions] = useState(['', ''])

  // Load round info effect
  useEffect(() => {
    const fetchRound = async () => {
      if (account) {
        try {
          const round = await loadRoundInfo(currentRoundId)
          setRoundInfo(round)
        } catch (error) {
          console.error('Error loading round:', error)
        }
      }
    }
    
    fetchRound()
  }, [currentRoundId, account])

  // Handlers
  const handlePlaceBet = async () => {
    if (selectedOption === null || !betAmount) return
    
    try {
      await placeBet(currentRoundId, selectedOption, betAmount)
      const updatedRound = await loadRoundInfo(currentRoundId)
      setRoundInfo(updatedRound)
      setSelectedOption(null)
      setBetAmount('0.01')
    } catch (error) {
      console.error('Error placing bet:', error)
    }
  }

  const handleClaimWinnings = async () => {
    try {
      await claimWinnings(currentRoundId)
      const updatedRound = await loadRoundInfo(currentRoundId)
      setRoundInfo(updatedRound)
    } catch (error) {
      console.error('Error claiming winnings:', error)
    }
  }

  const handleCreateRound = async () => {
    if (!newQuestion.trim() || newOptions.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      await createRound(newQuestion, newOptions.filter(opt => opt.trim()))
      setNewQuestion('')
      setNewOptions(['', ''])
      setCurrentRoundId(prev => prev + 1)
    } catch (error) {
      console.error('Error creating round:', error)
    }
  }

  const handleResolveRound = async (option) => {
    try {
      await resolveRound(currentRoundId, option)
      const updatedRound = await loadRoundInfo(currentRoundId)
      setRoundInfo(updatedRound)
    } catch (error) {
      console.error('Error resolving round:', error)
    }
  }

  const handleRefresh = async () => {
    try {
      const round = await loadRoundInfo(currentRoundId)
      setRoundInfo(round)
    } catch (error) {
      console.error('Error refreshing round:', error)
    }
  }

  const canUserClaim = roundInfo?.resolved && 
    roundInfo?.userBet && 
    roundInfo.userBet.option === roundInfo.correctOption && 
    !roundInfo.userBet.claimed

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <FloatingParticles />
      
      {/* Header */}
      <PremiumHeader 
        account={account}
        balance={balance}
        onConnect={connectWallet}
        onDisconnect={disconnect}
        isLoading={isLoading}
        isOwner={isOwner}
      />

      {/* Main Content */}
      <div className="w-screen h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-4 overflow-auto">
          <div className="w-full max-w-7xl mx-auto">
            
            {!account ? (
              // Welcome Section
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-6xl"
                >
                  <motion.h1 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
                  >
                    Welcome to BlockBet Pro
                  </motion.h1>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
                  >
                    Experience lightning-fast prediction markets on Monad blockchain with 
                    instant settlements and near-zero fees. Join the next generation of decentralized betting.
                  </motion.p>
                  
                  {/* Stats Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="w-full mb-12"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                      <StatsCard
                        icon={<Zap className="w-8 h-8 text-yellow-400" />}
                        title="Settlement Speed"
                        value="1 second"
                        change="+99%"
                        trend="up"
                      />
                      <StatsCard
                        icon={<Shield className="w-8 h-8 text-green-400" />}
                        title="Gas Fees"
                        value="~$0.001"
                        change="-98%"
                        trend="down"
                      />
                      <StatsCard
                        icon={<Trophy className="w-8 h-8 text-purple-400" />}
                        title="Win Rate"
                        value="94%"
                        change="+12%"
                        trend="up"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-16"
                  >
                    <Button 
                      onClick={connectWallet}
                      disabled={isLoading}
                      loading={isLoading}
                      size="lg"
                      icon={<Star className="w-6 h-6" />}
                      className="text-xl py-6 px-12 pulse-glow shadow-2xl"
                    >
                      Start Your Journey
                    </Button>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>100% Decentralized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Lightning Fast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" />
                      <span>Provably Fair</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ) : (
              // Main Application
              <div className="w-full h-full flex flex-col justify-center space-y-8">
                
                {/* Demo Notice */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full"
                >
                  <Card className="max-w-3xl mx-auto text-center bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 p-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 font-bold">Demo Mode Active</span>
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </div>
                    <p className="text-yellow-200/80">
                      Experience the full BlockBet Pro interface with simulated transactions
                    </p>
                  </Card>
                </motion.div>

                {/* Tab Navigation */}
                <div className="flex justify-center">
                  <Card className="p-2 flex gap-2">
                    <Button
                      onClick={() => setActiveTab('betting')}
                      variant={activeTab === 'betting' ? 'primary' : 'ghost'}
                      icon={<BarChart3 className="w-5 h-5" />}
                    >
                      Live Betting
                    </Button>
                    {isOwner && (
                      <Button
                        onClick={() => setActiveTab('admin')}
                        variant={activeTab === 'admin' ? 'warning' : 'ghost'}
                        icon={<Shield className="w-5 h-5" />}
                      >
                        Admin Control
                      </Button>
                    )}
                  </Card>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex justify-center">
                  <div className="w-full max-w-6xl">
                    
                    {activeTab === 'betting' ? (
                      <div className="space-y-8">
                        {/* Round Selector */}
                        <Card>
                          <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-4 mb-4">
                              <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl">
                                <Users className="w-8 h-8 text-cyan-400" />
                              </div>
                              <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-white">Market Selection</h2>
                                <p className="text-gray-400">Choose your prediction market</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
                            <select
                              value={currentRoundId}
                              onChange={(e) => setCurrentRoundId(Number(e.target.value))}
                              className="w-full max-w-md glass text-white p-4 rounded-2xl border border-white/20 focus:border-purple-400 focus:outline-none transition-colors bg-transparent"
                            >
                              <option value={1} className="bg-gray-800 text-white">🚀 Bitcoin $100k Prediction</option>
                              <option value={2} className="bg-gray-800 text-white">🏆 India World Cup 2025</option>
                              <option value={3} className="bg-gray-800 text-white">💎 Ethereum $10k Target</option>
                            </select>
                            <Button
                              onClick={handleRefresh}
                              disabled={isLoading}
                              variant="secondary"
                              icon={<RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />}
                            />
                          </div>
                        </Card>

                        {/* Betting Interface */}
                        {roundInfo && (
                          <Card className="w-full">
                            {/* Header */}
                            <div className="text-center mb-8">
                              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                                {roundInfo.question}
                              </h2>
                              
                              <div className="flex flex-wrap justify-center items-center gap-6">
                                <div className="flex items-center gap-3 glass rounded-2xl px-6 py-3 border border-green-500/30">
                                  <TrendingUp className="w-6 h-6 text-green-400" />
                                  <span className="font-bold text-white text-lg">{roundInfo.totalPot} ETH</span>
                                  <span className="text-green-400 text-sm">Total Pool</span>
                                </div>
                                
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl glass border font-bold ${
                                  roundInfo.active 
                                    ? 'border-green-500/30 text-green-300' 
                                    : roundInfo.resolved 
                                    ? 'border-red-500/30 text-red-300'
                                    : 'border-gray-500/30 text-gray-300'
                                }`}>
                                  {roundInfo.active ? <Play className="w-5 h-5" /> : roundInfo.resolved ? <CheckCircle className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                                  {roundInfo.active ? 'Live Betting' : roundInfo.resolved ? 'Results Final' : 'Market Closed'}
                                </div>
                              </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-6 mb-8">
                              {roundInfo.options.map((option, index) => {
                                const percentage = roundInfo.totalPot !== '0' ? 
                                  ((parseFloat(roundInfo.optionBets[index] || '0') / parseFloat(roundInfo.totalPot)) * 100) : 0
                                const isSelected = selectedOption === index
                                const isWinner = roundInfo.resolved && index === roundInfo.correctOption

                                return (
                                  <motion.div
                                    key={index}
                                    whileHover={roundInfo.active ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={roundInfo.active ? { scale: 0.98 } : {}}
                                    onClick={() => roundInfo.active && setSelectedOption(index)}
                                    className={`
                                      w-full relative cursor-pointer rounded-3xl border-2 transition-all duration-500 overflow-hidden p-8
                                      ${isSelected 
                                        ? 'border-purple-400 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-500/25' 
                                        : 'border-white/20 hover:border-white/40 bg-gradient-to-r from-white/5 to-white/10'
                                      }
                                      ${isWinner 
                                        ? 'border-green-400 bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/25' 
                                        : ''
                                      }
                                      ${!roundInfo.active ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                                    `}
                                  >
                                    {/* Progress bar */}
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"
                                      transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
                                      <div className="flex items-center gap-6">
                                        <div className={`w-8 h-8 rounded-full border-3 transition-all duration-300 ${
                                          isSelected 
                                            ? 'border-purple-400 bg-gradient-to-r from-purple-400 to-pink-400' 
                                            : 'border-white/40'
                                        }`} />
                                        <div className="text-center md:text-left">
                                          <span className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                                            {option}
                                            {isWinner && (
                                              <motion.span
                                                initial={{ scale: 0, rotate: 0 }}
                                                animate={{ scale: 1, rotate: 360 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-3xl"
                                              >
                                                🏆
                                              </motion.span>
                                            )}
                                          </span>
                                          <div className="text-gray-400 text-sm mt-1">
                                            {roundInfo.active ? 'Click to select' : 'Betting closed'}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="text-center">
                                        <div className="text-xl md:text-2xl font-bold text-white mb-1">
                                          {roundInfo.optionBets[index]} ETH
                                        </div>
                                        <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                                          percentage > 50 
                                            ? 'bg-green-500/20 text-green-300' 
                                            : 'bg-blue-500/20 text-blue-300'
                                        }`}>
                                          {percentage.toFixed(1)}% share
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>

                            {/* User's current bet */}
                            {roundInfo.userBet && roundInfo.userBet.amount !== '0' && (
                              <div className="w-full mb-8">
                                <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <div className="p-3 bg-blue-500/20 rounded-2xl">
                                        <BarChart3 className="w-6 h-6 text-blue-400" />
                                      </div>
                                      <div className="text-center md:text-left">
                                        <span className="text-blue-300 font-medium">Your Active Bet</span>
                                        <div className="text-sm text-blue-400/80">Position secured</div>
                                      </div>
                                    </div>
                                    <div className="text-center md:text-right">
                                      <div className="text-xl font-bold text-white">
                                        {roundInfo.userBet.amount} ETH
                                      </div>
                                      <div className="text-blue-300 text-sm">
                                        on "{roundInfo.options[roundInfo.userBet.option]}"
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            )}

                            {/* Betting interface */}
                            {roundInfo.active && (!roundInfo.userBet || roundInfo.userBet.amount === '0') && (
                              <div className="w-full">
                                <Card className="bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-cyan-600/10 border-purple-500/20">
                                  <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Place Your Prediction</h3>
                                    <p className="text-gray-400">Enter your bet amount and confirm your choice</p>
                                  </div>
                                  
                                  <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                                    <div className="relative">
                                      <input
                                        type="number"
                                        step="0.001"
                                        min="0.001"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(e.target.value)}
                                        placeholder="0.01"
                                        className="glass border border-white/20 focus:border-purple-400 rounded-2xl px-6 py-4 text-white placeholder-gray-400 text-center font-bold text-lg focus:outline-none transition-colors w-full md:w-48 bg-transparent"
                                      />
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                                        ETH
                                      </div>
                                    </div>
                                    
                                    <Button
                                      onClick={handlePlaceBet}
                                      disabled={selectedOption === null || isLoading}
                                      loading={isLoading}
                                      size="lg"
                                      icon={<Zap className="w-6 h-6" />}
                                      className="pulse-glow w-full md:w-auto"
                                    >
                                      Confirm Bet
                                    </Button>
                                  </div>
                                  
                                  {selectedOption === null && (
                                    <motion.p 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="text-center text-yellow-300 mt-4 flex items-center justify-center gap-2"
                                    >
                                      <span>👆</span>
                                      Select an option above to place your bet
                                    </motion.p>
                                  )}
                                </Card>
                              </div>
                            )}

                            {/* Claim winnings */}
                            {canUserClaim && (
                              <div className="w-full mt-8">
                                <div className="text-center">
                                  <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 mb-6">
                                    <motion.div
                                      animate={{ rotate: [0, 5, -5, 0] }}
                                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                      className="text-6xl mb-4"
                                    >
                                      🎉
                                    </motion.div>
                                    <h3 className="text-3xl font-bold text-green-300 mb-2">Congratulations!</h3>
                                    <p className="text-green-400/80">You predicted correctly and won the round!</p>
                                  </Card>
                                  
                                  <Button
                                    onClick={handleClaimWinnings}
                                    disabled={isLoading}
                                    loading={isLoading}
                                    variant="success"
                                    size="lg"
                                    icon={<Trophy className="w-6 h-6" />}
                                    className="pulse-glow text-xl py-6 px-10"
                                  >
                                    Claim Your Winnings
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        )}
                      </div>
                    ) : (
                      // Admin Panel
                      <Card className="bg-gradient-to-br from-yellow-600/10 to-red-600/10 border-yellow-500/20">
                        <div className="text-center mb-8">
                          <div className="flex items-center justify-center gap-4 mb-4">
                            <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl">
                              <Shield className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                              <h2 className="text-3xl font-bold text-white">Admin Control Center</h2>
                              <p className="text-gray-400">Manage prediction markets and resolve outcomes</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-8 w-full">
                          {/* Create Round Section */}
                          <Card className="bg-gradient-to-r from-white/5 to-white/10">
                            <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-3">
                              <div className="p-2 bg-green-500/20 rounded-xl">
                                <Star className="w-5 h-5 text-green-400" />
                              </div>
                              Create New Market
                            </h3>
                            <div className="space-y-4">
                              <input
                                type="text"
                                placeholder="Enter prediction question..."
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                className="w-full glass border border-white/20 focus:border-green-400 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors bg-transparent"
                              />
                              {newOptions.map((option, idx) => (
                                <input
                                  key={idx}
                                  type="text"
                                  placeholder={`Option ${idx + 1}...`}
                                  value={option}
                                  onChange={(e) => {
                                    const opts = [...newOptions]
                                    opts[idx] = e.target.value
                                    setNewOptions(opts)
                                  }}
                                  className="w-full glass border border-white/20 focus:border-green-400 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-colors bg-transparent"
                                />
                              ))}
                              <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                  onClick={() => setNewOptions([...newOptions, ''])}
                                  variant="ghost"
                                  size="sm"
                                  className="w-full sm:flex-1"
                                >
                                  + Add Option
                                </Button>
                                <Button
                                  onClick={handleCreateRound}
                                  disabled={isLoading}
                                  loading={isLoading}
                                  variant="success"
                                  icon={<Star className="w-5 h-5" />}
                                  className="w-full sm:flex-1"
                                >
                                  Create Market
                                </Button>
                              </div>
                            </div>
                          </Card>

                          {/* Resolve Round Section */}
                          <Card className="bg-gradient-to-r from-white/5 to-white/10">
                            <h3 className="text-xl font-semibold mb-6 flex items-center justify-center gap-3">
                              <div className="p-2 bg-red-500/20 rounded-xl">
                                <CheckCircle className="w-5 h-5 text-red-400" />
                              </div>
                              Resolve Market
                            </h3>
                            {roundInfo && roundInfo.active ? (
                              <div className="space-y-4">
                                <Card className="bg-gray-800/30 p-4">
                                  <p className="text-gray-300 text-sm mb-2">Current Market:</p>
                                  <p className="text-white font-medium">"{roundInfo.question}"</p>
                                </Card>
                                <div className="space-y-3">
                                  {roundInfo.options.map((option, idx) => (
                                    <Button
                                      key={idx}
                                      onClick={() => handleResolveRound(idx)}
                                      disabled={isLoading}
                                      loading={isLoading}
                                      variant="warning"
                                      icon={<Trophy className="w-5 h-5" />}
                                      className="w-full"
                                    >
                                      "{option}" Wins
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="text-6xl mb-4">⚪</div>
                                <p className="text-gray-400">
                                  {roundInfo?.resolved ? 'Current market already resolved' : 'No active market to resolve'}
                                </p>
                              </div>
                            )}
                          </Card>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
