"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DictionaryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // エラーをログに記録
    console.error("Dictionary page error:", error)
  }, [error])

  const handleReset = () => {
    try {
      if (typeof reset === "function") {
        reset()
      } else {
        // reset関数が利用できない場合は、ページをリロード
        window.location.reload()
      }
    } catch (e) {
      console.error("Reset failed:", e)
      // フォールバック: ページをリロード
      window.location.reload()
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
        <h2 className="text-2xl font-bold mb-4 text-red-500">エラーが発生しました</h2>
        <p className="text-gray-600 mb-6">申し訳ありませんが、辞典の読み込み中にエラーが発生しました。</p>
        {error.message && (
          <p className="text-sm text-gray-500 mb-6 max-w-md text-center">エラー詳細: {error.message}</p>
        )}
        <div className="flex gap-4">
          <Button onClick={handleReset}>再試行</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  )
}
