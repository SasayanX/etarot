"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { getCurrentCardBackUrl } from "@/utils/card-back-manager"

interface FortuneReadingProps {
  onClose: () => void
}

const FortuneReading: React.FC<FortuneReadingProps> = ({ onClose }) => {
  const [cardBackImage, setCardBackImage] = useState<string>("/card-backs/card-back-1.png") // デフォルトのカードバック画像

  useEffect(() => {
    // 現在選択されているカードバックを取得
    const currentCardBack = getCurrentCardBackUrl()
    setCardBackImage(currentCardBack)
    console.log("Fortune reading: Initial card back:", currentCardBack)

    // カードスーツ変更イベントのリスナーを追加
    const handleCardSuitChange = (event: Event) => {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail && customEvent.detail.imageUrl) {
          console.log("Fortune reading: Card suit changed event received:", customEvent.detail)
          setCardBackImage(customEvent.detail.imageUrl)
        }
      } catch (error) {
        console.error("Card suit change event error:", error)
      }
    }

    window.addEventListener("cardSuitChanged", handleCardSuitChange)
    window.addEventListener("cardSuitRefresh", handleCardSuitChange)

    // クリーンアップ関数
    return () => {
      window.removeEventListener("cardSuitChanged", handleCardSuitChange)
      window.removeEventListener("cardSuitRefresh", handleCardSuitChange)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-4">今日の運勢</h2>
        <p className="mb-4">カードを選んでください。</p>
        <div className="grid grid-cols-3 gap-4">
          {/* カードの表示 */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="relative">
              <Image
                src={cardBackImage || "/placeholder.svg"} // カードバックの画像パス
                alt={`Card ${index}`}
                width={100}
                height={150}
                className="cursor-pointer rounded-md"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xl font-bold rounded-md">
                {/* {index} */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FortuneReading
