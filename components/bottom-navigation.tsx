"use client"

import type React from "react"

import { Home, Book, Search, GamepadIcon, Settings, User, Palette, HelpCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { showAd } from "@/utils/ad-utils"
import { useState, useEffect } from "react"
import { isWebView } from "@/utils/ad-utils" // WebView検出関数をインポート
import { useLanguage } from "@/contexts/language-context"

const menuItems = [
  { name: "nav.home", href: "/", icon: Home, showAd: true },
  { name: "nav.fortune", href: "/fortune", icon: Search, showAd: true },
  { name: "nav.dictionary", href: "/dictionary", icon: Book, showAd: true },
  { name: "nav.quiz", href: "/quiz", icon: HelpCircle, showAd: true },
  { name: "nav.game", href: "/game", icon: GamepadIcon, showAd: true },
  { name: "nav.skins", href: "/skins", icon: Palette, showAd: true },
  { name: "nav.supervisor", href: "/supervisor", icon: User, showAd: false },
  { name: "nav.settings", href: "/settings", icon: Settings, showAd: false },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isInWebView, setIsInWebView] = useState(false)
  const { t } = useLanguage()

  // WebView検出を初期化時と定期的に実行
  useEffect(() => {
    // 初期化時にWebView検出
    const detectWebView = () => {
      const webViewDetected = isWebView()
      setIsInWebView(webViewDetected)
      console.log(`WebView検出結果: ${webViewDetected ? "WebView内" : "通常ブラウザ"}`)
    }

    // 初回実行
    detectWebView()

    // 5秒ごとに再検出（状態が変わる可能性があるため）
    const intervalId = setInterval(detectWebView, 5000)

    return () => clearInterval(intervalId)
  }, [])

  // ナビゲーション処理とAd表示を行う関数
  const handleNavigation = (href: string, shouldShowAd: boolean, e: React.MouseEvent) => {
    // 必ずデフォルトのナビゲーションを防止
    e.preventDefault()
    e.stopPropagation() // イベントの伝播も停止

    // 既に同じページにいる場合や、ナビゲーション中の場合は何もしない
    if (pathname === href || isNavigating) {
      console.log(
        `[NAVIGATION DEBUG] ナビゲーションをスキップ: ${pathname === href ? "同じページ" : "ナビゲーション中"}`,
      )
      return
    }

    console.log(
      `[NAVIGATION DEBUG] ナビゲーション開始: ${pathname} → ${href} (WebView: ${isInWebView ? "はい" : "いいえ"})`,
    )
    console.log(`[NAVIGATION DEBUG] 広告表示フラグ: ${shouldShowAd}`)

    // TP加算が発生していないかチェック
    const currentPoints = localStorage.getItem("tarotPoints")
    console.log(`[TP DEBUG] ナビゲーション前のTP: ${currentPoints}`)

    setIsNavigating(true)

    // WebView内での特別な処理
    if (isInWebView) {
      try {
        // WebView内でのカスタム処理
        console.log(`[NAVIGATION DEBUG] WebView内でのナビゲーション: ${href}`)

        // ReactNativeWebViewが利用可能な場合、メッセージを送信
        if (typeof window !== "undefined" && window.ReactNativeWebView) {
          // ネイティブ側に内部ナビゲーションであることを通知
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "internalNavigation",
              url: href,
            }),
          )
          console.log("[NAVIGATION DEBUG] ReactNativeWebViewにナビゲーションメッセージを送信しました")

          // WebView内では、Next.jsのルーターを使用せず、ネイティブ側に任せる
          setTimeout(() => {
            setIsNavigating(false)
          }, 300)
          return
        }
      } catch (error) {
        console.error("[NAVIGATION ERROR] WebView通信エラー:", error)
      }
    }

    // 広告表示フラグがtrueの場合、広告を表示（ポイント加算は削除済み）
    if (shouldShowAd) {
      console.log(`[AD DEBUG] 広告表示を試行: menu_${href.replace(/\//g, "")}`)
      // 広告表示を試みる（locationにはメニュー名を渡す）
      const adResult = showAd(`menu_${href.replace(/\//g, "")}`)
      console.log(`[AD DEBUG] 広告表示結果: ${adResult}`)
    } else {
      console.log(`[AD DEBUG] 広告表示スキップ: ${href}`)
    }

    // 少し遅延させてからナビゲーション（広告表示のため）
    setTimeout(() => {
      // ナビゲーション後のTP確認
      const pointsAfterAd = localStorage.getItem("tarotPoints")
      console.log(`[TP DEBUG] 広告表示後のTP: ${pointsAfterAd}`)

      router.push(href)
      setIsNavigating(false)

      // ナビゲーション完了後のTP確認
      setTimeout(() => {
        const pointsAfterNavigation = localStorage.getItem("tarotPoints")
        console.log(`[TP DEBUG] ナビゲーション完了後のTP: ${pointsAfterNavigation}`)

        // TP変化があった場合は警告
        if (currentPoints !== pointsAfterNavigation) {
          console.warn(`[TP WARNING] ナビゲーション中にTPが変化しました: ${currentPoints} → ${pointsAfterNavigation}`)
        }
      }, 100)
    }, 100)
  }

  // ナビゲーション状態をリセット（ページ遷移完了後）
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  // TPの変化を監視
  useEffect(() => {
    const handlePointsUpdate = (event: CustomEvent) => {
      console.log(`[TP DEBUG] カスタムイベントでTP更新: ${event.detail.points} (追加: ${event.detail.added})`)
    }

    window.addEventListener("tarotPointsUpdated", handlePointsUpdate as EventListener)

    return () => {
      window.removeEventListener("tarotPointsUpdated", handlePointsUpdate as EventListener)
    }
  }, [])

  // z-indexを上げて、他の要素より前面に表示されるようにします
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-md border-t border-purple-800 z-50">
      <div className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavigation(item.href, item.showAd, e)}
                // タッチイベントも明示的に処理
                onTouchStart={(e) => {
                  // タッチイベントでもバブリングを防止
                  e.stopPropagation()
                }}
                // データ属性を追加してWebView用のマーカーを設定
                data-internal-link="true"
                data-webview-safe="true"
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full",
                  isActive ? "text-amber-400" : "text-gray-400 hover:text-purple-300",
                  isNavigating ? "pointer-events-none" : "",
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{t(item.name)}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
