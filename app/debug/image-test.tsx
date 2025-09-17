"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { handleImageError } from "@/utils/image-utils"

export default function ImageTest() {
  const [showImages, setShowImages] = useState(true)

  const imagePaths = [
    { path: "/images/fortune-cards.png", title: "今日の運勢を占う", fallback: "/placeholder.svg?key=s11g4" },
    {
      path: "/images/tarot-dictionary-illustration.jpg",
      title: "タロット辞典",
      fallback: "/placeholder.svg?key=gml6h",
    },
    { path: "/images/tarot-quiz.png", title: "タロットクイズ", fallback: "/placeholder.svg?key=fb4p0" },
    { path: "/images/tarot-game.png", title: "タロットゲーム", fallback: "/placeholder.svg?key=60t7q" },
    // 問題のある画像に明示的なフォールバックを設定
    { path: "/images/card-skins.png", title: "カードスーツショップ", fallback: "/placeholder.svg?key=63exh" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>画像テスト</span>
          <Button variant="outline" onClick={() => setShowImages(!showImages)}>
            {showImages ? "画像を隠す" : "画像を表示"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showImages && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePaths.map((item, index) => (
              <div key={index} className="border rounded-md p-4 flex flex-col items-center">
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <div className="relative w-full h-40 bg-gray-100 rounded overflow-hidden">
                  <img
                    src={item.path || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      handleImageError(
                        e,
                        item.fallback || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(item.title)}`,
                      )
                    }
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 break-all">{item.path}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 text-sm">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${showImages ? "bg-green-500" : "bg-gray-300"}`}
          ></span>
          {showImages ? "表示中" : "非表示"}
        </div>
      </CardContent>
    </Card>
  )
}
