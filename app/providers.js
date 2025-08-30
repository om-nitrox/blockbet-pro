// app/providers.js
"use client"
import { Web3Provider } from "./contexts/Web3context"

export default function Providers({ children }) {
  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  )
}
