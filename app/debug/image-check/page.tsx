"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Check, X, RefreshCw, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ImageCheck() {
  const { toast } = useToast()
  const [imageStatuses, setImageStatuses] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null)

  // チェックする画像のリスト
  const imagesToCheck = [
    { path: "/golden-tarot-back.png", name: "ゴールデン" },
    { path: "/mystic-tarot-back.png", name: "ミスティック" },
    { path: "/royal-tarot-card-back.png", name: "ロイヤル" },
    { path: "/elemental-tarot-back.png", name: "エレメンタル" },
    { path: "/cardback-elemental.png", name: "エレメンタル (代替パス)" },
    { path: "/cardback-sakura.png", name: "サクラ" },
    { path: "/cardback-halloween.png", name: "ハロウィン" },
    { path: "/cardback-winter.png", name: "ウィンター" },
  ]

  // 外部画像のリスト
  const externalImages = [
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back.jpg-rP7JTYXlZGFOKJEN36kRqoqcfzBiXp.png",
      name: "デフォルト",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/moon-TtddIf45eQo4wcxtbIHqhyj7Lor0RB.png",
      name: "ムーンライト",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crystal-tarot-back-puICtBkYOgd7xGlMtSoanT0qm4OZPW.png",
      name: "クリスタル",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dragon-tarot-back-62w6wpQ57g9BDqSCxvDz0Rkz9UopTS.png",
      name: "ドラゴン",
    },
    {
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cosmic-tarot-back-CDadMAr43AItk3TFbwDEsXfFrdc0E0.png",
      name: "コズミック",
    },
  ]

  // 画像の存在をチェックする関数
  const checkImages = async () => {
    setLoading(true)
    const statuses: Record<string, boolean> = {}

    // ローカル画像のチェック
    for (const image of imagesToCheck) {
      try {
        const response = await fetch(image.path, { method: "HEAD" })
        statuses[image.path] = response.ok
        console.log(`Image check for ${image.path}: ${response.ok ? "Success" : "Failed"}`)
      } catch (error) {
        console.error(`Error checking image ${image.path}:`, error)
        statuses[image.path] = false
      }
    }

    // 外部画像のチェック
    for (const image of externalImages) {
      try {
        const response = await fetch(image.url, { method: "HEAD" })
        statuses[image.url] = response.ok
        console.log(`Image check for ${image.url}: ${response.ok ? "Success" : "Failed"}`)
      } catch (error) {
        console.error(`Error checking image ${image.url}:`, error)
        statuses[image.url] = false
      }
    }

    setImageStatuses(statuses)
    setLoading(false)
    toast({
      title: "画像チェック完了",
      description: "すべての画像の存在チェックが完了しました",
    })
  }

  // コンポーネントマウント時に画像チェックを実行
  useEffect(() => {
    checkImages()
  }, [])

  // 画像を選択
  const selectImage = (path: string) => {
    setSelectedImage(path)
    setImageInfo(null)
  }

  // 画像読み込み成功時
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget
    setImageInfo({
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
  }

  // 画像を新しいタブで開く
  const openImageInNewTab = (path: string) => {
    // 相対パスの場合は絶対パスに変換
    if (path.startsWith("/")) {
      window.open(`${window.location.origin}${path}`, "_blank")
    } else {
      window.open(path, "_blank")
    }
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
        <Button variant="outline" size="sm" onClick={checkImages} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          再チェック
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">画像ファイル存在チェック</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ローカル画像ファイル</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-4">チェック中...</p>
              ) : (
                imagesToCheck.map((image) => (
                  <div
                    key={image.path}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      selectedImage === image.path ? "bg-purple-900/40" : "bg-gray-800"
                    } hover:bg-purple-900/20`}
                    onClick={() => selectImage(image.path)}
                  >
                    <div className="flex items-center">
                      {imageStatuses[image.path] ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>
                        {image.name} <span className="text-xs text-gray-400">({image.path})</span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openImageInNewTab(image.path)
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>外部画像ファイル</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-4">チェック中...</p>
              ) : (
                externalImages.map((image) => (
                  <div
                    key={image.url}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                      selectedImage === image.url ? "bg-purple-900/40" : "bg-gray-800"
                    } hover:bg-purple-900/20`}
                    onClick={() => selectImage(image.url)}
                  >
                    <div className="flex items-center">
                      {imageStatuses[image.url] ? (
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mr-2" />
                      )}
                      <span>
                        {image.name}{" "}
                        <span className="text-xs text-gray-400 hidden md:inline">
                          ({image.url.substring(0, 20)}...)
                        </span>
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openImageInNewTab(image.url)
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedImage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>画像プレビュー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-2 bg-gray-800 rounded-lg text-sm">
                <p>選択中: {selectedImage}</p>
                {imageInfo && (
                  <p className="mt-1">
                    サイズ: {imageInfo.width} x {imageInfo.height} px
                  </p>
                )}
              </div>

              <div className="bg-gray-900 p-4 rounded-lg flex items-center justify-center relative">
                {/* 背景にチェッカーパターンを追加して透明部分を可視化 */}
                <div
                  className="absolute inset-0 bg-opacity-30 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700"
                  style={{ backgroundSize: "20px 20px" }}
                ></div>

                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="選択された画像"
                  className="max-h-[400px] max-w-full object-contain relative z-10"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  onLoad={handleImageLoad}
                  onError={() => setImageInfo(null)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
