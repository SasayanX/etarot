"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// 金南輝能デザインのURLを定数として定義
const GOLDEN_DRAGON_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back.jpg-Ia2c3zJsZeqVdxxR6LHEPkv3Tew4kv.jpeg"

interface TarotCardProps {
  id: number
  name: string
  image?: string
  isFlipped?: boolean
  onClick?: () => void
  className?: string
  isMatched?: boolean
  isSelected?: boolean
  isAnimating?: boolean
  isInteractive?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  cardBackImage?: string
  onLoad?: () => void
  onError?: () => void
}

export default function TarotCard({
  id,
  name,
  image,
  isFlipped = false,
  onClick,
  className = "",
  isMatched = false,
  isSelected = false,
  isAnimating = false,
  isInteractive = true,
  size = "md",
  cardBackImage,
  onLoad,
  onError,
}: TarotCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [localIsFlipped, setLocalIsFlipped] = useState(isFlipped)
  const [imageSrc, setImageSrc] = useState(image || "/placeholder.svg")
  const cardRef = useRef<HTMLDivElement>(null)

  // 常に金南輝能デザインを使用
  const actualCardBackImage = GOLDEN_DRAGON_URL

  // 外部からのisFlippedの変更を検知して反映
  useEffect(() => {
    setLocalIsFlipped(isFlipped)
  }, [isFlipped])

  // 外部からのimage変更を検知して反映
  useEffect(() => {
    if (image) {
      setImageSrc(image)
    }
  }, [image])

  // サイズに基づくスタイルを設定
  const sizeStyles = {
    sm: "w-16 h-24",
    md: "w-20 h-32",
    lg: "w-32 h-48",
    xl: "w-48 h-72",
  }

  // カードクリック時の処理
  const handleClick = () => {
    if (!isInteractive || isMatched) return
    if (onClick) onClick()
  }

  // 画像読み込み完了時の処理
  const handleImageLoad = () => {
    setIsLoaded(true)
    setHasError(false)
    if (onLoad) onLoad()
  }

  // カード表面の画像エラーハンドリングを強化
  const handleImageError = () => {
    console.error(`Failed to load image for card: ${name} (ID: ${id})`)
    setHasError(true)

    // フォールバック画像を設定
    const fallbackImage = `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(name)}`
    setImageSrc(fallbackImage)

    if (onError) onError()
  }

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative perspective-1000 cursor-pointer transition-transform",
        sizeStyles[size],
        {
          "cursor-default": !isInteractive || isMatched,
          "ring-2 ring-yellow-400": isSelected && !isMatched,
          "opacity-70": isMatched,
        },
        className,
      )}
      onClick={handleClick}
      data-testid={`tarot-card-${id}`}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        initial={false}
        animate={{
          rotateY: localIsFlipped ? 0 : 180,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* カード表面 */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden rounded-lg shadow-md overflow-hidden border-2",
            isMatched ? "border-green-500" : "border-purple-800",
          )}
          style={{ transform: "rotateY(0deg)" }}
        >
          {imageSrc ? (
            <img
              src={imageSrc || "/placeholder.svg"}
              alt={name}
              className={cn("w-full h-full object-cover", {
                "opacity-0": !isLoaded && !hasError,
                "filter brightness-50": isMatched,
              })}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-900 text-white p-2 text-center">
              <span className="text-xs">{name}</span>
            </div>
          )}
          {isMatched && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-lg font-bold bg-green-600 px-2 py-1 rounded-md">一致!</span>
            </div>
          )}
        </div>

        {/* カード裏面 */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg shadow-md overflow-hidden border-2 border-purple-800 bg-purple-900"
          style={{ transform: "rotateY(180deg)" }}
        >
          <img
            src={actualCardBackImage || "/placeholder.svg"}
            alt="Card Back"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Failed to load card back image")
              e.currentTarget.src = "/default-tarot-card-back.webp" // より確実なフォールバック
            }}
            crossOrigin="anonymous"
          />
        </div>
      </motion.div>

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
      `}</style>
    </div>
  )
}
