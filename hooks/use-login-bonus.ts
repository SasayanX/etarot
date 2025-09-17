"use client"

import { useState, useEffect } from "react"

export function useLoginBonus() {
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // ローカルストレージからデータを読み込む
    const checkLoginBonus = () => {
      if (typeof window === "undefined") return

      try {
        const lastLoginDate = localStorage.getItem("lastLoginBonusDate")
        const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD形式

        console.log("Last login bonus date:", lastLoginDate)
        console.log("Today:", today)

        // 初回ログインまたは日付が変わっている場合
        if (!lastLoginDate || lastLoginDate !== today) {
          console.log("Login bonus available!")
          setShowLoginBonus(true)
        } else {
          console.log("Login bonus already claimed today")
        }

        setInitialized(true)
      } catch (error) {
        console.error("Error checking login bonus:", error)
        // エラーが発生しても初期化完了とする
        setInitialized(true)
        setError(error instanceof Error ? error : new Error(String(error)))
      }
    }

    // コンポーネントのマウント時に一度だけチェック
    if (!initialized) {
      // 少し遅延させてチェックする（WebViewの初期化を待つため）
      const timer = setTimeout(() => {
        checkLoginBonus()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [initialized])

  // ログインボーナスを受け取った後の処理
  const claimLoginBonus = () => {
    if (typeof window === "undefined") return

    try {
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem("lastLoginBonusDate", today)
      setShowLoginBonus(false)
    } catch (error) {
      console.error("Error claiming login bonus:", error)
      // エラーが発生しても閉じる
      setShowLoginBonus(false)
      setError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // エラーをリセットする関数
  const resetError = () => {
    setError(null)
  }

  return {
    showLoginBonus,
    claimLoginBonus,
    error,
    resetError,
    initialized,
  }
}
