"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink, Smartphone, Monitor } from "lucide-react"

export default function DownloadAppPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [userAgent, setUserAgent] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // クライアントサイドでのみ実行
    setIsClient(true)

    const checkUserAgent = () => {
      if (typeof window === "undefined") return

      const ua = navigator.userAgent.toLowerCase()
      setUserAgent(ua)

      // v0プレビュー環境での表示を改善
      const isV0Preview =
        typeof window !== "undefined" &&
        (window.location.hostname.includes("v0.dev") || window.location.hostname.includes("vercel.app"))

      // モバイルデバイスの検出（v0プレビューでは強制的にモバイル扱い）
      const mobileCheck = isV0Preview || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)
      setIsMobile(mobileCheck)
    }

    checkUserAgent()
  }, [])

  const handleGooglePlayClick = () => {
    if (typeof window !== "undefined") {
      window.open("https://play.google.com/store/apps/details?id=com.ryuka.kanau_kiryu&pcampaignid=web_share", "_blank")
    }
  }

  // サーバーサイドレンダリング時のローディング表示
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-950 text-white p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-amber-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold">🌙</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">タロット大全</h1>
            <p className="text-xl text-purple-300">Tarot Encyclopedia</p>
          </div>
          <div className="text-lg text-gray-300">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-purple-950 text-white p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-amber-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold">🌙</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">タロット大全</h1>
          <p className="text-xl text-purple-300">Tarot Encyclopedia</p>
        </div>

        {isMobile ? (
          // モバイルユーザー向けの表示
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">モバイルデバイスを検出しました</span>
            </div>

            <div className="text-lg mb-6 space-y-2">
              <p>🎉 アプリが公開されました！</p>
              <p className="text-purple-300">The app is now available!</p>
              <p className="text-sm text-gray-300">下のボタンからGoogle Playでダウンロードできます</p>
            </div>

            <Button
              onClick={handleGooglePlayClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              size="lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              Google Play で入手
            </Button>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg text-sm text-gray-300">
              <p>📱 Android 5.0以上が必要です</p>
              <p>🆓 無料でダウンロード可能</p>
              <p>📊 10+ ダウンロード達成</p>
            </div>
          </div>
        ) : (
          // デスクトップユーザー向けの表示
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 text-blue-400 mb-4">
              <Monitor className="w-5 h-5" />
              <span className="text-sm">デスクトップブラウザを検出しました</span>
            </div>

            <div className="text-lg mb-6 space-y-2">
              <p>このアプリはモバイル専用です。</p>
              <p className="text-purple-300">This app is exclusively for mobile devices.</p>
              <p className="text-sm text-gray-300">スマートフォンまたはタブレットでアクセスしてください</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-amber-400">モバイルでアクセスする方法</h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>1. スマートフォンでこのページにアクセス</p>
                  <p>2. または下のリンクをモバイルに送信</p>
                  <p>3. Google Playからダウンロード</p>
                </div>
              </div>

              <Button
                onClick={handleGooglePlayClick}
                variant="outline"
                className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/50"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Google Play ページを開く
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 text-xs text-gray-400 space-y-1">
          <p>🔮 タロット占い・辞書・クイズ・ゲームが楽しめます</p>
          <p className="text-purple-400">Fortune telling, dictionary, quiz & games available</p>
          <p>開発者: 占い師・金間 麻耶 (カナマ キリュウ)</p>
        </div>

        {/* デバッグ情報（開発時またはv0プレビューで表示） */}
        {(process.env.NODE_ENV === "development" ||
          (typeof window !== "undefined" && window.location.hostname.includes("v0.dev"))) && (
          <div className="mt-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
            <p>User Agent: {userAgent.substring(0, 50)}...</p>
            <p>Is Mobile: {isMobile ? "Yes" : "No"}</p>
            <p>Hostname: {typeof window !== "undefined" ? window.location.hostname : "SSR"}</p>
          </div>
        )}
      </div>
    </div>
  )
}
