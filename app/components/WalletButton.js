// app/components/WalletButton.js
'use client'
import { useWeb3 } from "../contexts/Web3context"

export default function WalletButton() {
  const { 
    isConnected, 
    account, 
    balance,
    isConnecting, 
    connect, 
    disconnect, 
    formatAddress 
  } = useWeb3()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Connection failed:', error)
      alert('Failed to connect: ' + error.message)
    }
  }

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-4 p-4 bg-green-100 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Connected:</p>
          <p className="font-mono">{formatAddress(account)}</p>
          <p className="text-xs text-gray-500">{parseFloat(balance).toFixed(4)} ETH</p>
        </div>
        <button 
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}
