"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type DebugContextType = {
  debugMode: boolean
  toggleDebugMode: () => void
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export function DebugProvider({ children }: { children: ReactNode }) {
  // クローズドテスト中はデバッグモードを常に無効化
  const [debugMode, setDebugMode] = useState(false)

  const toggleDebugMode = () => {
    // クローズドテスト中は常にfalseを返す
    setDebugMode(false)
  }

  return <DebugContext.Provider value={{ debugMode, toggleDebugMode }}>{children}</DebugContext.Provider>
}

export function useDebug() {
  const context = useContext(DebugContext)
  if (context === undefined) {
    // コンテキストが提供されていない場合でもエラーを出さず、デフォルト値を返す
    return { debugMode: false, toggleDebugMode: () => {} }
  }
  return context
}
