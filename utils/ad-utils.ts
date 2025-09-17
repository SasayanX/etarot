// WebViewかどうかを検出する関数
export function isWebView(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false
  }

  const ua = navigator.userAgent.toLowerCase()

  // Android WebViewの検出
  const isAndroidWebView = ua.indexOf("wv") > -1

  // iOS WebViewの検出
  const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua)

  // カスタムWebView検出 - アプリ固有のUserAgentを追加
  const isCustomWebView =
    ua.includes("tarotapp") ||
    (typeof window !== "undefined" &&
      (window.ReactNativeWebView !== undefined ||
        // @ts-ignore - Android WebViewの場合、windowにAndroidオブジェクトが追加されている
        window.Android !== undefined))

  // WebViewの特徴的な機能の欠如を検出
  const hasLimitedFeatures =
    typeof window !== "undefined" &&
    // WebViewでは一部の機能が制限されていることがある
    (window.navigator.standalone !== undefined || // iOS standalone mode
      !("share" in navigator) || // Web Share API
      document.documentElement.classList.contains("webview")) // カスタムクラス

  // ローカルストレージからWebView状態を取得（他の場所で設定されている可能性）
  const storedWebViewState = typeof window !== "undefined" && localStorage.getItem("isWebView") === "true"

  const result = isAndroidWebView || isIOSWebView || isCustomWebView || hasLimitedFeatures || storedWebViewState

  // 結果をローカルストレージに保存して他の場所でも使えるようにする
  if (typeof window !== "undefined") {
    localStorage.setItem("isWebView", result.toString())
  }

  console.log(`WebView検出: ${result} (UA: ${ua})`)
  return result
}

// 最後に広告を表示した時間を保存
let lastAdShownTime = 0
// 広告表示の最小間隔（ミリ秒）- デフォルトは60秒
let MIN_AD_INTERVAL = 60 * 1000

// 広告表示を呼び出す関数（ネイティブ側との競合を避けるため無効化）
export function showAd(location: string): boolean {
  console.log(`広告表示リクエスト (${location}): ネイティブ側との競合を避けるため無効化されています`)
  return false
}

// 広告表示間隔を設定する関数
export function setAdInterval(intervalSeconds: number): void {
  MIN_AD_INTERVAL = intervalSeconds * 1000
  console.log(`広告表示間隔を${intervalSeconds}秒に設定しました`)
}

// 最後の広告表示時間をリセットする関数
export function resetAdTimer(): void {
  lastAdShownTime = 0
  console.log("広告表示タイマーをリセットしました")
}

// デバッグ情報を取得する関数
export function getAdDebugInfo(): object {
  return {
    lastAdShownTime,
    timeSinceLastAd: Date.now() - lastAdShownTime,
    minInterval: MIN_AD_INTERVAL,
    isWebView: isWebView(),
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    hasAndroidInterface: typeof window !== "undefined" && typeof window.Android !== "undefined",
    hasReactNativeWebView: typeof window !== "undefined" && typeof window.ReactNativeWebView !== "undefined",
  }
}
