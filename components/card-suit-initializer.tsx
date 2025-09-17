"use client"

import { useEffect, useState, useRef } from "react"
import {
  initCardBackManager,
  dispatchCardBackChangeEvent,
  refreshCardBackState,
  getCurrentCardBackUrl,
} from "@/utils/card-back-manager"

export default function CardSuitInitializer() {
  const [initialized, setInitialized] = useState(false)
  const initAttempts = useRef(0)
  const maxAttempts = 5 // 試行回数を増やす
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastRefreshRef = useRef<number>(0)
  const originalPushStateRef = useRef<
    ((this: History, data: any, unused: string, url?: string | URL | null | undefined) => void) | undefined
  >(undefined)

  // 初期化を試みる関数
  const attemptInitialization = () => {
    try {
      console.log(
        `CardSuitInitializer: Initializing card back manager (attempt ${initAttempts.current + 1}/${maxAttempts})`,
      )

      // カードバックマネージャーを初期化
      initCardBackManager()

      // カードバック変更イベントを発火
      dispatchCardBackChangeEvent()

      setInitialized(true)
      console.log("CardSuitInitializer: Card back manager initialized successfully")

      // 初期化成功後、すぐに状態を更新
      setTimeout(refreshCardBackState, 100)

      // さらに遅延させて再度更新（確実に反映させるため）
      setTimeout(refreshCardBackState, 500)
      setTimeout(refreshCardBackState, 1000)
    } catch (error) {
      console.error("CardSuitInitializer: Failed to initialize card back manager", error)

      // 最大試行回数に達していない場合は再試行
      initAttempts.current += 1
      if (initAttempts.current < maxAttempts) {
        setTimeout(attemptInitialization, 1000) // 1秒後に再試行
      }
    }
  }

  // 状態を更新する関数（スロットリング付き）
  const refreshState = () => {
    const now = Date.now()
    // 前回の更新から500ms以上経過している場合のみ実行
    if (now - lastRefreshRef.current > 500) {
      refreshCardBackState()
      lastRefreshRef.current = now

      // 現在のカードバック情報をログ出力
      const currentUrl = getCurrentCardBackUrl()
      console.log(`CardSuitInitializer: Current card back URL: ${currentUrl}`)

      // グローバル変数に保存
      if (typeof window !== "undefined") {
        const suitId = localStorage.getItem("selectedSuit") || "default"
        ;(window as any).cardBackInfo = {
          suitId,
          imageUrl: currentUrl,
          timestamp: now,
        }
      }
    }
  }

  // useEffectを修正して、より頻繁に状態を更新するようにします
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized) {
      attemptInitialization()
    }

    // 定期的に状態を更新するタイマーを設定（より短い間隔に）
    refreshTimerRef.current = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshState()
      }
    }, 2000) // 2秒ごとに更新

    // ページ表示状態変更時のリスナー
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("CardSuitInitializer: Page became visible, refreshing card back state")
        refreshState()
        // 少し遅延させて再度更新
        setTimeout(refreshState, 500)
      }
    }

    // ページ遷移後の状態復元
    const handleRouteChange = () => {
      console.log("CardSuitInitializer: Route changed, refreshing card back state")
      // 複数回更新して確実に反映させる
      setTimeout(refreshState, 100)
      setTimeout(refreshState, 500)
      setTimeout(refreshState, 1000)
    }

    // ページ表示状態変更のリスナーを追加
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Next.jsのルーター変更イベントをシミュレート
    window.addEventListener("popstate", handleRouteChange)

    // pushStateをオーバーライドしてページ遷移を検知
    if (typeof window.history.pushState === "function") {
      const originalPushState = window.history.pushState
      originalPushStateRef.current = originalPushState
      window.history.pushState = function () {
        const result = originalPushState.apply(this, arguments as any)
        console.log("CardSuitInitializer: pushState detected, refreshing state")
        handleRouteChange()
        return result
      }
    }

    // フォーカス時にも状態を更新
    window.addEventListener("focus", refreshState)

    // クリックイベントでも状態を更新（ユーザーインタラクション後）
    document.addEventListener("click", () => {
      setTimeout(refreshState, 300)
    })

    // クリーンアップ関数
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("popstate", handleRouteChange)
      window.removeEventListener("focus", refreshState)

      // 元のpushStateに戻す
      if (typeof window.history.pushState === "function" && originalPushStateRef.current) {
        window.history.pushState = originalPushStateRef.current
      }
    }
  }, [initialized])

  // 実際のDOMは何も描画しない
  return null
}
