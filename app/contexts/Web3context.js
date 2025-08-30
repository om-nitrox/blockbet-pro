// app/contexts/Web3Context.js
'use client'
import { createContext, useContext } from 'react'
import { useWallet } from '../hooks/useWallet'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const walletData = useWallet()
  
  return (
    <Web3Context.Provider value={walletData}>
      {children}
    </Web3Context.Provider>
  )
}
