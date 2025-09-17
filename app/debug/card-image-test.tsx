"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const cardSuits = [
  { name: "デフォルト", path: "/default-tarot-back.png" },
  { name: "ゴールデン", path: "/golden-tarot-back.png" },
  { name: "ミスティック", path: "/mystic-tarot-back.png" },
  { name: "ロイヤル", path: "/royal-tarot-back.png" },
  { name: "コズミック", path: "/cosmic-tarot-back.png" },
  { name: "サクラ", path: "/sakura-tarot-back.png" },
  { name: "ハロウィン", path: "/halloween-tarot-back.png" },
  { name: "ウィンター", path: "/winter-tarot-back.png" },
  { name: "エレメンタル", path: "/elemental-tarot-back.png" },
]

export default function CardImageTest() {
  const [loadStatus, setLoadStatus] = useState<Record<string, boolean>>({})
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})

  const testImage = (path: string) => {
    const img = new Image()
    img.onload = () => {
      setLoadStatus((prev) => ({ ...prev, [path]: true }))
      setErrorMessages((prev) => ({ ...prev, [path]: "" }))
    }
    img.onerror = (e) => {
      setLoadStatus((prev) => ({ ...prev, [path]: false }))
      setErrorMessages((prev) => ({
        ...prev,
        [path]: `エラー: ${e instanceof Event ? "イベントオブジェクト" : e?.toString()}`,
      }))
    }
    img.src = path
  }

  const testAllImages = () => {
    cardSuits.forEach((suit) => testImage(suit.path))
  }

  useEffect(() => {
    // 初回レンダリング時に自動的にテスト実行
    testAllImages()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">カード画像テスト</h1>
      <Button onClick={testAllImages} className="mb-4">
        すべての画像をテスト
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardSuits.map((suit) => (
          <Card key={suit.name} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{suit.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[2/3] w-full bg-gray-100 rounded overflow-hidden">
                {loadStatus[suit.path] === undefined ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p>テスト中...</p>
                  </div>
                ) : loadStatus[suit.path] ? (
                  <img
                    src={suit.path || "/placeholder.svg"}
                    alt={`${suit.name}カードスーツ`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-red-500">
                    <p>読み込みエラー</p>
                    <p className="text-xs mt-2 text-center">{errorMessages[suit.path]}</p>
                  </div>
                )}
              </div>
              <div className="mt-2 text-center">
                <Button onClick={() => testImage(suit.path)} variant="outline" size="sm">
                  再テスト
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
