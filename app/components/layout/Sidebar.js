'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, BarChart3, Trophy, User, Settings, HelpCircle, 
  ChevronRight, Zap, Shield, Coins 
} from 'lucide-react'
import { useState } from 'react'

export default function Sidebar({ isOpen, onClose, account, isOwner }) {
  const [activeItem, setActiveItem] = useState('dashboard')

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '#',
      badge: null
    },
    {
      id: 'markets',
      label: 'Live Markets',
      icon: BarChart3,
      href: '#markets',
      badge: '3'
    },
    {
      id: 'leaderboard',
      label: 'Leaderboard',
      icon: Trophy,
      href: '#leaderboard',
      badge: null
    },
    {
      id: 'portfolio',
      label: 'My Bets',
      icon: Coins,
      href: '#portfolio',
      badge: '2'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '#profile',
      badge: null
    }
  ]

  const adminItems = [
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      href: '#admin',
      badge: 'NEW'
    }
  ]

  const bottomItems = [
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '#settings',
      badge: null
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      href: '#help',
      badge: null
    }
  ]

  const handleItemClick = (itemId, href) => {
    setActiveItem(itemId)
    // Handle navigation here
    if (href && href !== '#') {
      // Add your navigation logic
      console.log('Navigate to:', href)
    }
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  const SidebarItem = ({ item, isActive, onClick }) => (
    <motion.button
      whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(item.id, item.href)}
      className={`
        w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-white' 
          : 'text-gray-300 hover:text-white hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
        <span className="font-medium">{item.label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {item.badge && (
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.badge === 'NEW' 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-blue-500/20 text-blue-300'
          }`}>
            {item.badge}
          </div>
        )}
        <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
      </div>
    </motion.button>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed left-0 top-0 h-full w-80 glass border-r border-white/20 z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">BlockBet Pro</h2>
                    <p className="text-sm text-gray-400">Navigation Menu</p>
                  </div>
                </div>
                
                {/* User info */}
                {account && (
                  <div className="mt-4 p-3 bg-white/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-white">
                          {account.slice(0,6)}...{account.slice(-4)}
                        </div>
                        {isOwner && (
                          <div className="text-xs text-yellow-300">👑 Admin Access</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {/* Main menu */}
                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      isActive={activeItem === item.id}
                      onClick={handleItemClick}
                    />
                  ))}
                </div>
                
                {/* Admin menu */}
                {isOwner && (
                  <>
                    <div className="my-4 border-t border-white/20" />
                    <div className="space-y-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Admin Tools
                      </div>
                      {adminItems.map((item) => (
                        <SidebarItem
                          key={item.id}
                          item={item}
                          isActive={activeItem === item.id}
                          onClick={handleItemClick}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Bottom menu */}
                <div className="mt-auto pt-4 border-t border-white/20">
                  <div className="space-y-2">
                    {bottomItems.map((item) => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        isActive={activeItem === item.id}
                        onClick={handleItemClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-white/20">
                <div className="text-xs text-gray-500 text-center">
                  <p>BlockBet Pro v1.0</p>
                  <p>Powered by Monad</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
