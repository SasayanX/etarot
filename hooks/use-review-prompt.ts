"use client"

import { useState, useEffect } from "react"
import { formatDateKey } from "@/utils/date-key"

/**
 * レビュー依頼のロジックを管理するカスタムフック
 * 
 * 表示条件:
 * - アプリを5回以上使用した後
 * - まだレビュー依頼を表示していない、または前回表示から7日以上経過
 * - 1日に1回まで表示
 */
export function useReviewPrompt({ autoCheck = true }: { autoCheck?: boolean } = {}) {
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const canShowReviewPrompt = () => {
    if (typeof window === "undefined") return false

    const hasShownReview = localStorage.getItem("hasShownReviewPrompt") === "true"
    const lastReviewPromptDate = localStorage.getItem("lastReviewPromptDate")
    const today = getTodayKey()

    if (hasShownReview || lastReviewPromptDate === today) {
      return false
    }

    return !lastReviewPromptDate || isMoreThanDaysAgo(lastReviewPromptDate, 7)
  }

  useEffect(() => {
    const checkReviewPrompt = () => {
      if (typeof window === "undefined") return

      try {
        // 使用回数をカウント（毎回インクリメント）
        const usageCountStr = localStorage.getItem("appUsageCount") || "0"
        const usageCount = parseInt(usageCountStr, 10)
        const newUsageCount = usageCount + 1
        localStorage.setItem("appUsageCount", newUsageCount.toString())

        console.log("Usage count:", newUsageCount)

        // 表示条件:
        // 1. 5回以上使用している
        // 2. まだ一度も表示していない、または前回表示から7日以上経過
        // 3. 今日まだ表示していない
        if (newUsageCount >= 5 && canShowReviewPrompt()) {
          console.log("✅ レビュー表示条件を満たしています")
          setShowReviewPrompt(true)
        } else {
          console.log("❌ レビュー表示条件を満たしていません:", newUsageCount)
        }

        setInitialized(true)
      } catch (error) {
        console.error("Error checking review prompt:", error)
        setInitialized(true)
      }
    }

    if (!autoCheck) {
      setInitialized(true)
      return undefined
    }

    if (!initialized) {
      // 少し遅延させてチェック（UIが安定してから表示）
      const timer = setTimeout(() => {
        checkReviewPrompt()
      }, 3000) // ログインボーナスの後に表示

      return () => clearTimeout(timer)
    }

    return undefined
  }, [autoCheck, initialized])

  // レビュー依頼を閉じた後の処理
  const dismissReviewPrompt = () => {
    if (typeof window === "undefined") return

    try {
      const today = getTodayKey()
      localStorage.setItem("lastReviewPromptDate", today)
      setShowReviewPrompt(false)
    } catch (error) {
      console.error("Error dismissing review prompt:", error)
      setShowReviewPrompt(false)
    }
  }

  // レビューを書くボタンを押した後の処理
  const markReviewShown = () => {
    if (typeof window === "undefined") return

    try {
      const today = getTodayKey()
      localStorage.setItem("hasShownReviewPrompt", "true")
      localStorage.setItem("lastReviewPromptDate", today)
      setShowReviewPrompt(false)
    } catch (error) {
      console.error("Error marking review shown:", error)
      setShowReviewPrompt(false)
    }
  }

  const requestReviewAfterPositiveMoment = () => {
    if (typeof window === "undefined") return

    try {
      const fortuneCompletions = Number.parseInt(localStorage.getItem("fortuneCompletionCount") || "0", 10) || 0
      if (fortuneCompletions >= 3 && canShowReviewPrompt()) {
        setShowReviewPrompt(true)
      }
    } catch (error) {
      console.error("Error requesting review after positive moment:", error)
    }
  }

  return {
    showReviewPrompt,
    dismissReviewPrompt,
    markReviewShown,
    requestReviewAfterPositiveMoment,
    initialized,
  }
}

/**
 * 指定した日付が現在からN日以上前かどうかを判定
 */
function isMoreThanDaysAgo(dateString: string, days: number): boolean {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)
    return diffDays >= days
  } catch {
    return false
  }
}

function getTodayKey(): string {
  return formatDateKey(new Date())
}
