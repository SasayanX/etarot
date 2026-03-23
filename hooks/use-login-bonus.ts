"use client"

import { useState, useEffect } from "react"
import { addSuitToOwned, getOwnedSuits } from "@/utils/card-back-manager"
import { formatDateKey } from "@/utils/date-key"

const STREAK_STORAGE_KEY = "loginStreak"
const LAST_LOGIN_KEY = "lastLoginDate"
const LONGEST_STREAK_KEY = "longestLoginStreak"
const LOGIN_DAYS_KEY = "loginDays"

interface StreakReward {
  days: number
  suitId: string
}

const STREAK_REWARDS: StreakReward[] = [
  { days: 30, suitId: "lydia-back-30" },
  { days: 60, suitId: "lydia-back-60" },
]

const parseDateKey = (dateKey: string) => {
  const parts = dateKey.split("-").map((value) => Number.parseInt(value, 10))
  const year = parts[0] || new Date().getFullYear()
  const month = parts[1] || 1
  const day = parts[2] || 1
  return new Date(year, month - 1, day)
}

const getDayDifference = (currentKey: string, previousKey: string) => {
  const current = parseDateKey(currentKey)
  const previous = parseDateKey(previousKey)
  const diffMs = current.getTime() - previous.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

const updateLoginStreakAndUnlocks = () => {
  if (typeof window === "undefined") {
    return { streak: 0, unlocked: [] as string[] }
  }

  try {
    const todayKey = formatDateKey(new Date())
    const lastLoginDate = localStorage.getItem(LAST_LOGIN_KEY)
    let streak = Number.parseInt(localStorage.getItem(STREAK_STORAGE_KEY) || "0", 10) || 0

    if (!lastLoginDate) {
      streak = 1
    } else if (lastLoginDate === todayKey) {
      // streak already counted for today
    } else {
      const diffDays = getDayDifference(todayKey, lastLoginDate)
      streak = diffDays === 1 ? streak + 1 : 1
    }

    localStorage.setItem(LAST_LOGIN_KEY, todayKey)
    localStorage.setItem(STREAK_STORAGE_KEY, streak.toString())
    localStorage.setItem("lastLoginBonusDate", todayKey)

    const previousBest = Number.parseInt(localStorage.getItem(LONGEST_STREAK_KEY) || "0", 10) || 0
    if (streak > previousBest) {
      localStorage.setItem(LONGEST_STREAK_KEY, streak.toString())
    }

    // Record login days for other seasonal checks
    try {
      const loginDaysRaw = localStorage.getItem(LOGIN_DAYS_KEY)
      const loginDays = loginDaysRaw ? JSON.parse(loginDaysRaw) : []
      if (Array.isArray(loginDays) && !loginDays.includes(todayKey)) {
        loginDays.push(todayKey)
        localStorage.setItem(LOGIN_DAYS_KEY, JSON.stringify(loginDays))
      } else if (!loginDaysRaw) {
        localStorage.setItem(LOGIN_DAYS_KEY, JSON.stringify([todayKey]))
      }
    } catch (error) {
      console.warn("Failed to update loginDays:", error)
      localStorage.setItem(LOGIN_DAYS_KEY, JSON.stringify([todayKey]))
    }

    const ownedSuits = getOwnedSuits()
    const unlocked: string[] = []

    STREAK_REWARDS.forEach(({ days, suitId }) => {
      const unlockFlagKey = `streakUnlocked:${suitId}`
      const alreadyUnlocked = localStorage.getItem(unlockFlagKey) === "true"
      const hasSuit = ownedSuits.includes(suitId)

      if (streak >= days && (!alreadyUnlocked || !hasSuit)) {
        const added = addSuitToOwned(suitId)
        localStorage.setItem(unlockFlagKey, "true")
        if (added || !hasSuit) {
          unlocked.push(suitId)
        }
      }
    })

    if (unlocked.length > 0) {
      const event = new CustomEvent("loginStreakRewardUnlocked", {
        detail: {
          streak,
          unlocked,
          timestamp: Date.now(),
        },
      })
      window.dispatchEvent(event)
    }

    return { streak, unlocked }
  } catch (error) {
    console.error("Error updating login streak:", error)
    return { streak: 0, unlocked: [] as string[] }
  }
}

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
        const today = formatDateKey(new Date()) // ローカルタイムゾーンを使用

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

    return undefined
  }, [initialized])

  // ログインボーナスを受け取った後の処理
  const claimLoginBonus = () => {
    if (typeof window === "undefined") return

    try {
      updateLoginStreakAndUnlocks()
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
