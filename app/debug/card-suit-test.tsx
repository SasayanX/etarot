"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { getCardBackImagePath } from "@/utils/card-image-utils"

export default function CardSuitTest() {
  const { toast } = useToast()
  const [selectedSuit, setSelectedSuit] = useState("default")
  const [cardBackImage, setCardBackImage] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [eventLogs, setEventLogs] = useState<string[]>([])

  // 利用可能なカードスーツのリスト
  const availableSuits = [
    { id: "default", name: "デフォルト" },
    { id: "moonlight", name: "ムーンライト" },
    { id: "golden", name: "ゴールデン" },
    { id: "crystal", name: "クリスタル" },
    { id: "mystic", name: "ミスティック" },
    { id: "royal", name: "ロイヤル" },
    { id: "dragon", name: "ドラゴン" },
    { id: "cosmic", name: "コズミック" },
    { id: "elemental", name: "エレメンタル" },
    { id: "sakura", name: "サクラ" },
    { id: "halloween", name: "ハロウィン" },
    { id: "winter", name: "ウィンター" },
  ]

  // カードスーツ変更イベントのリスナーを設定
  useEffect(() => {
    const handleCardSuitChanged = (event: CustomEvent) => {
      const { suitId, imageUrl, timestamp } = event.detail
      const logMessage = `[${new Date().toLocaleTimeString()}] カードスーツ変更: ${suitId}, URL: ${imageUrl}, タイムスタンプ: ${timestamp}`
      setEventLogs((prev) => [logMessage, ...prev])
    }

    const handleCardSuitRefresh = (event: CustomEvent) => {
      const { suitId, imageUrl, timestamp } = event.detail
      const logMessage = `[${new Date().toLocaleTimeString()}] リフレッシュイベント: ${suitId}, URL: ${imageUrl}, タイムスタンプ: ${timestamp}`
      setEventLogs((prev) => [logMessage, ...prev])
    }

    // イベントリスナーを追加
    window.addEventListener("cardSuitChanged", handleCardSuitChanged as EventListener)
    window.addEventListener("cardSuitRefresh", handleCardSuitRefresh as EventListener)

    // クリーンアップ
    return () => {
      window.removeEventListener("cardSuitChanged", handleCardSuitChanged as EventListener)
      window.removeEventListener("cardSuitRefresh", handleCardSuitRefresh as EventListener)
    }
  }, [])

  // 選択されたスーツが変更されたときに画像を更新
  useEffect(() => {
    const imagePath = getCardBackImagePath(selectedSuit)
    setCardBackImage(imagePath)
    setImageLoaded(false)
    setImageError(false)

    // ローカルストレージに保存
    localStorage.setItem("selectedSuit", selectedSuit)
    localStorage.setItem("selectedCardBack", imagePath)

    // カスタムイベントを発火
    const event = new CustomEvent("cardSuitChanged", {
      detail: {
        suitId: selectedSuit,
        imageUrl: imagePath,
        timestamp: Date.now(),
      },
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    const logMessage = `[${new Date().toLocaleTimeString()}] スーツ選択: ${selectedSuit}, パス: ${imagePath}`
    setEventLogs((prev) => [logMessage, ...prev])
  }, [selectedSuit])

  // 画像読み込み成功時
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
    toast({
      title: "画像読み込み成功",
      description: `${selectedSuit}の画像を正常に読み込みました`,
    })
  }

  // 画像読み込みエラー時
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageLoaded(false)
    setImageError(true)

    // エラーの詳細をログに記録
    const errorMessage = `画像読み込みエラー: ${e.currentTarget.src}`
    console.error(errorMessage)
    setEventLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${errorMessage}`, ...prev])

    toast({
      title: "画像読み込みエラー",
      description: `${selectedSuit}の画像の読み込みに失敗しました: ${e.currentTarget.src}`,
      variant: "destructive",
    })
  }

  // 手動でイベントを発火
  const triggerEvent = () => {
    const imagePath = getCardBackImagePath(selectedSuit)
    const event = new CustomEvent("cardSuitChanged", {
      detail: {
        suitId: selectedSuit,
        imageUrl: imagePath,
        timestamp: Date.now(),
      },
      bubbles: true,
      cancelable: true,
    })
    window.dispatchEvent(event)

    toast({
      title: "イベント発火",
      description: `カードスーツ変更イベントを手動で発火しました: ${selectedSuit}`,
    })

    const logMessage = `[${new Date().toLocaleTimeString()}] 手動イベント発火: ${selectedSuit}, パス: ${imagePath}`
    setEventLogs((prev) => [logMessage, ...prev])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Link href="/debug">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            デバッグメニューに戻る
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={triggerEvent}>
          <RefreshCw className="mr-2 h-4 w-4" />
          イベント再発火
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">カードスーツテスト</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>カードスーツ選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select value={selectedSuit} onValueChange={setSelectedSuit}>
                <SelectTrigger>
                  <SelectValue placeholder="カードスーツを選択" />
                </SelectTrigger>
                <SelectContent>
                  {availableSuits.map((suit) => (
                    <SelectItem key={suit.id} value={suit.id}>
                      {suit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm mb-2">現在選択中: {selectedSuit}</p>
                <p className="text-sm mb-2">画像パス: {cardBackImage}</p>
                <p className="text-sm mb-4">
                  ステータス:{" "}
                  {imageLoaded ? (
                    <span className="text-green-500">読み込み成功</span>
                  ) : imageError ? (
                    <span className="text-red-500">読み込みエラー</span>
                  ) : (
                    <span className="text-yellow-500">読み込み中...</span>
                  )}
                </p>

                <div className="aspect-[3/4] bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                  {cardBackImage && (
                    <img
                      src={cardBackImage || "/placeholder.svg"}
                      alt={`${selectedSuit} カードバック`}
                      className="max-h-full max-w-full object-contain"
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>イベントログ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-y-auto bg-gray-900 p-4 rounded-lg text-xs font-mono">
              {eventLogs.length > 0 ? (
                eventLogs.map((log, index) => (
                  <div key={index} className="mb-1 pb-1 border-b border-gray-800">
                    {log}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">イベントログはまだありません</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>ローカルストレージ情報</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>selectedSuit:</strong> {localStorage.getItem("selectedSuit") || "未設定"}
              </p>
              <p>
                <strong>selectedCardBack:</strong> {localStorage.getItem("selectedCardBack") || "未設定"}
              </p>
              <p>
                <strong>ownedSuits:</strong> {localStorage.getItem("ownedSuits") || "未設定"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
