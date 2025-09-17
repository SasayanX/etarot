"use client"

import type React from "react"

import { useDebug } from "@/contexts/debug-context"

export function DebugInfo({ children }: { children: React.ReactNode }) {
  const { debugMode } = useDebug()

  // デバッグモードが無効の場合は何も表示しない
  if (!debugMode) return null

  return <div className="debug-info">{children}</div>
}
