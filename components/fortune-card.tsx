"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { memoWithPerformanceMonitoring } from "@/utils/memo-optimizer"
import LazyImage from "@/components/ui/lazy-image"
import { optimizeImageUrl } from "@/utils/image-optimization"

interface FortuneCardProps {
  card: any
  isReversed?: boolean
  initiallyFlipped?: boolean
  cardBackImage?: string
  onImageError?: (error: any) => void
}

const FortuneCard = memoWithPerformanceMonitoring(
  ({
    card,
    isReversed = false,
    initiallyFlipped = false,
    cardBackImage = "/default-tarot-card-back.jpg",
    onImageError,
  }: FortuneCardProps) => {
    const [isFlipped, setIsFlipped] = useState(initiallyFlipped)
    const [isLoaded, setIsLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)
    const [backImageLoaded, setBackImageLoaded] = useState(false)
    const [frontImageLoaded, setFrontImageLoaded] = useState(false)
    const [currentCardBack, setCurrentCardBack] = useState(cardBackImage)

    // 外部からのinitiallyFlippedの変更を検知して反映
    useEffect(() => {
      setIsFlipped(initiallyFlipped)
    }, [initiallyFlipped])

    // カードバック画像の更新を監視
    useEffect(() => {
      if (cardBackImage && cardBackImage !== currentCardBack) {
        setCurrentCardBack(cardBackImage)
        setBackImageLoaded(false)
      }
    }, [cardBackImage, currentCardBack])

    const optimizedImageLoad = useCallback((src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = reject
        img.src = src
      })
    }, [])

    // カードバック画像のプリロード
    useEffect(() => {
      optimizedImageLoad(currentCardBack || "/default-tarot-card-back.jpg")
        .then(() => setBackImageLoaded(true))
        .catch(() => {
          console.error("カードバック画像の読み込みに失敗しました:", currentCardBack)
          if (currentCardBack !== "/default-tarot-card-back.jpg") {
            setCurrentCardBack("/default-tarot-card-back.jpg")
          } else {
            setBackImageLoaded(true)
          }
        })
    }, [currentCardBack, optimizedImageLoad])

    // カード表面画像のプリロード
    useEffect(() => {
      if (card.image) {
        optimizedImageLoad(card.image)
          .then(() => {
            setFrontImageLoaded(true)
            setIsLoaded(true)
            setHasError(false)
          })
          .catch(() => {
            console.error(`Failed to load front image for card: ${card.name} (ID: ${card.id})`)
            setHasError(true)
            setFrontImageLoaded(true) // エラーでも読み込み完了とみなす
          })
      } else {
        setFrontImageLoaded(true)
        setIsLoaded(true)
      }
    }, [card.image, card.id, card.name, optimizedImageLoad])

    // 画像読み込み完了時の処理
    const handleImageLoad = useCallback(() => {
      setIsLoaded(true)
      setHasError(false)
      setFrontImageLoaded(true)
    }, [])

    // 画像エラーハンドリング
    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error(`Failed to load image for card: ${card.name} (ID: ${card.id})`)
        setHasError(true)
        setFrontImageLoaded(true)

        // フォールバック画像を設定
        e.currentTarget.src = `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(card.name || "タロットカード")}`

        if (onImageError) onImageError(e)
      },
      [card.name, card.id, onImageError],
    )

    // クリックハンドラ
    const handleClick = useCallback(() => {
      setIsFlipped(!isFlipped)
    }, [isFlipped])

    return (
      <div
        ref={cardRef}
        className="relative w-[140px] h-[200px] perspective-1000 cursor-pointer"
        data-testid={`fortune-card-${card.id}`}
        onClick={handleClick}
        style={{ contain: "layout style paint" }}
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 ${
            isFlipped ? "rotate-y-180" : ""
          } preserve-3d`}
        >
          {/* カード表面 */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg shadow-md overflow-hidden border-2 border-amber-600 rotate-y-180">
            <div className={cn("w-full h-full", { "transform rotate-180": isReversed })}>
              <LazyImage
                src={optimizeImageUrl(
                  card.image ||
                  `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(card.name || "タロットカード")}`,
                  {
                    quality: 85,
                    format: 'auto',
                    width: 300,
                    height: 450
                  }
                )}
                alt={card.name}
                className="w-full h-full object-cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
                priority={initiallyFlipped}
                fallback="/placeholder.svg?height=300&width=200&text=Error"
                placeholder="/placeholder.svg?height=300&width=200&text=Loading..."
              />
            </div>
          </div>

          {/* カード裏面 */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg shadow-md overflow-hidden border-2 border-amber-600 bg-purple-900">
            {backImageLoaded ? (
              <img
                src={currentCardBack || "/default-tarot-card-back.jpg"}
                alt="Card Back"
                className="w-full h-full object-cover card-back-image"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-900 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      </div>
    )
  },
  "FortuneCard"
)

export default FortuneCard
