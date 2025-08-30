'use client'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎲</span>
              </div>
              <span className="text-xl font-bold gradient-text">BlockBet Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              The fastest prediction market platform built on Monad blockchain.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Markets</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">How it Works</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Leaderboard</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">API</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Support</a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="font-semibold mb-4">Platform Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Volume:</span>
                <span className="text-green-400">1,234 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Active Markets:</span>
                <span className="text-blue-400">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Users:</span>
                <span className="text-purple-400">1,567</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 BlockBet Pro. Built with ❤️ on Monad blockchain.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              🐦
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              💬
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              📧
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  )
}
