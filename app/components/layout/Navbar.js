'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Wallet, LogOut, Settings, User, BarChart3 } from 'lucide-react'
import Button from '../ui/button'
import Card from '../ui/card'

export default function Navbar({ account, balance, onConnect, onDisconnect, isConnecting, isOwner }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navItems = [
    { href: '#markets', label: 'Markets', icon: BarChart3 },
    { href: '#leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '#analytics', label: 'Analytics', icon: '📊' },
    { href: '#help', label: 'Help', icon: '❓' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/10">
        <div className="container-custom">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-4 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="text-2xl"
                >
                  🎲
                </motion.span>
              </div>
              <div className="hidden sm:block">
                <h1 className="heading-lg gradient-text">BlockBet Pro</h1>
                <p className="text-sm text-gray-400 -mt-1">Powered by Monad</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                >
                  {typeof item.icon === 'string' ? (
                    <span>{item.icon}</span>
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Wallet & User Menu */}
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="relative">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 glass-strong rounded-2xl px-4 py-2 cursor-pointer hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-sm font-medium text-white">
                          {account.slice(0,6)}...{account.slice(-4)}
                        </div>
                        <div className="text-xs text-green-400 font-bold">
                          {parseFloat(balance).toFixed(3)} ETH
                        </div>
                      </div>
                    </div>
                    {isOwner && (
                      <div className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs font-bold">
                        👑 ADMIN
                      </div>
                    )}
                  </motion.div>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-64"
                      >
                        <Card className="p-4 border border-white/30">
                          <div className="space-y-3">
                            <div className="pb-3 border-b border-white/20">
                              <div className="font-medium text-white">Account Details</div>
                              <div className="text-sm text-gray-400 font-mono">{account}</div>
                              <div className="text-sm text-green-400 font-bold mt-1">
                                Balance: {balance} ETH
                              </div>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              className="w-full flex items-center space-x-2 p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              <span>Settings</span>
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              onClick={() => {
                                onDisconnect()
                                setIsUserMenuOpen(false)
                              }}
                              className="w-full flex items-center space-x-2 p-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Disconnect</span>
                            </motion.button>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button 
                  onClick={onConnect}
                  disabled={isConnecting}
                  loading={isConnecting}
                  icon={<Wallet className="w-5 h-5" />}
                  size="lg"
                  className="shadow-xl"
                >
                  Connect Wallet
                </Button>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/10"
          >
            <div className="container-custom py-4 space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {typeof item.icon === 'string' ? (
                    <span className="text-xl">{item.icon}</span>
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.a>
              ))}
              
              {/* Mobile account info */}
              {account && (
                <div className="pt-3 border-t border-white/20 mt-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-white">{account.slice(0,6)}...{account.slice(-4)}</div>
                      <div className="text-sm text-green-400">{parseFloat(balance).toFixed(3)} ETH</div>
                    </div>
                    <Button
                      onClick={() => {
                        onDisconnect()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </nav>
  )
}
