'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreateRound } from './CreateRound'
import { ResolveRound } from './ResolveRound'

export function AdminPanel({ currentRoundId, onRoundCreated, onRoundResolved }) {
  const [activeTab, setActiveTab] = useState('create')

  const tabs = [
    { id: 'create', label: '➕ Create Round', icon: '🚀' },
    { id: 'resolve', label: '🏁 Resolve Round', icon: '✅' },
    { id: 'manage', label: '⚙️ Manage', icon: '🛠️' },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 backdrop-blur-lg rounded-3xl border border-yellow-500/30 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 p-6 border-b border-yellow-500/20">
        <h2 className="text-3xl font-bold text-center mb-6">
          👑 Admin Control Panel
        </h2>
        
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="glass rounded-2xl p-1 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'create' && (
          <CreateRound onRoundCreated={onRoundCreated} />
        )}
        
        {activeTab === 'resolve' && (
          <ResolveRound 
            currentRoundId={currentRoundId}
            onRoundResolved={onRoundResolved}
          />
        )}
        
        {activeTab === 'manage' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold mb-4">🛠️ Platform Management</h3>
            <p className="text-gray-300 mb-8">
              Advanced management features coming soon!
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h4 className="text-lg font-bold mb-4">📊 Platform Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Rounds:</span>
                    <span className="font-bold">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Volume:</span>
                    <span className="font-bold text-green-400">1,234 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-bold text-blue-400">567</span>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-6">
                <h4 className="text-lg font-bold mb-4">⚙️ Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl transition-colors">
                    📈 View Analytics
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-xl transition-colors">
                    👥 Manage Users
                  </button>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 p-3 rounded-xl transition-colors">
                    🔧 System Settings
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
