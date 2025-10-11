"use client"

import { useState, useEffect } from "react"

/**
 * レビュー依頼のロジックを管理するカスタムフック
 * 
 * 表示条件:
 * - アプリを5回以上使用した後
 * - まだレビュー依頼を表示していない、または前回表示から7日以上経過
 * - 1日に1回まで表示
 */
export function useReviewPrompt() {
  const [showReviewPrompt, setShowReviewPrompt] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const checkReviewPrompt = () => {
      if (typeof window === "undefined") return

      try {
        // 使用回数をカウント（毎回インクリメント）
        const usageCountStr = localStorage.getItem("appUsageCount") || "0"
        const usageCount = parseInt(usageCountStr, 10)
        const newUsageCount = usageCount + 1
        localStorage.setItem("appUsageCount", newUsageCount.toString())

        // レビュー依頼を表示したかどうか
        const hasShownReview = localStorage.getItem("hasShownReviewPrompt") === "true"
        const lastReviewPromptDate = localStorage.getItem("lastReviewPromptDate")
        const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

        console.log("Usage count:", newUsageCount)
        console.log("Has shown review:", hasShownReview)
        console.log("Last review prompt date:", lastReviewPromptDate)

        // 表示条件:
        // 1. 5回以上使用している
        // 2. まだ一度も表示していない、または前回表示から7日以上経過
        // 3. 今日まだ表示していない
        if (newUsageCount >= 5) {
          console.log("✅ 使用回数が5回以上")
          
          // 初回の場合（まだ一度も表示していない）
          if (!hasShownReview && !lastReviewPromptDate) {
            console.log("✅ 初回表示条件を満たしています")
            setShowReviewPrompt(true)
          }
          // 再表示の場合（7日以上経過 && 今日はまだ表示していない）
          else if (!hasShownReview && lastReviewPromptDate) {
            const canShowAgain = isMoreThanDaysAgo(lastReviewPromptDate, 7) && lastReviewPromptDate !== today
            console.log("再表示チェック:", { canShowAgain, lastReviewPromptDate, today })
            if (canShowAgain) {
              console.log("✅ 再表示条件を満たしています")
              setShowReviewPrompt(true)
            }
          }
        } else {
          console.log("❌ 使用回数が5回未満:", newUsageCount)
        }

        setInitialized(true)
      } catch (error) {
        console.error("Error checking review prompt:", error)
        setInitialized(true)
      }
    }

    if (!initialized) {
      // 少し遅延させてチェック（UIが安定してから表示）
      const timer = setTimeout(() => {
        checkReviewPrompt()
      }, 3000) // ログインボーナスの後に表示

      return () => clearTimeout(timer)
    }
  }, [initialized])

  // レビュー依頼を閉じた後の処理
  const dismissReviewPrompt = () => {
    if (typeof window === "undefined") return

    try {
      const today = new Date().toISOString().split("T")[0]
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
      const today = new Date().toISOString().split("T")[0]
      localStorage.setItem("hasShownReviewPrompt", "true")
      localStorage.setItem("lastReviewPromptDate", today)
      setShowReviewPrompt(false)
    } catch (error) {
      console.error("Error marking review shown:", error)
      setShowReviewPrompt(false)
    }
  }

  return {
    showReviewPrompt,
    dismissReviewPrompt,
    markReviewShown,
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

