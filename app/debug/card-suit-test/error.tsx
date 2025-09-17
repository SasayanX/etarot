"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, RefreshCcw } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error("カードスーツテストでエラーが発生しました:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/debug">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            デバッグメニューに戻る
          </Button>
        </Link>
      </div>

      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-gray-400 mb-8">
          カードスーツテストの実行中に問題が発生しました。もう一度試すか、デバッグメニューに戻ってください。
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset} variant="default">
            <RefreshCcw className="mr-2 h-4 w-4" />
            もう一度試す
          </Button>
          <Button asChild variant="outline">
            <Link href="/debug">デバッグメニューに戻る</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">エラー詳細</h2>
        <p className="font-mono text-sm text-red-400">{error.message}</p>
        {error.digest && <p className="font-mono text-xs text-gray-500 mt-2">エラーID: {error.digest}</p>}
      </div>
    </div>
  )
}
