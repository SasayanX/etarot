/**
 * 占い結果コンポーネント
 * カードの結果と読みを表示
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RefreshCw, ExternalLink, AlertCircle } from "lucide-react"
import FortuneCard from "@/components/fortune-card"
import { useLanguage } from "@/contexts/language-context"
import { useSettings } from "@/contexts/settings-context"
import { useShop } from "@/contexts/shop-context"

interface FortuneCard {
  id: number
  name: string
  image: string
  isReversed: boolean
}

interface FortuneResultsProps {
  cards: FortuneCard[]
  fortuneType: string
  reading: string
  isComplete: boolean
  onRetry: () => void
  onNewFortune: () => void
  cardBackImage: string
  showAd?: () => void
}

export default function FortuneResults({
  cards,
  fortuneType,
  reading,
  isComplete,
  onRetry,
  onNewFortune,
  cardBackImage,
  showAd
}: FortuneResultsProps) {
  const { language, t } = useLanguage()
  const { speak, textToSpeechEnabled } = useSettings()
  const { addPoints } = useShop()
  const [showReading, setShowReading] = useState(false)
  const [allCardsFlipped, setAllCardsFlipped] = useState(false)

  // 全カードがめくられたかチェック
  useEffect(() => {
    if (isComplete && !allCardsFlipped) {
      setAllCardsFlipped(true)
      
      // ポイント追加
      addPoints(50)
      
      // 音声読み上げ
      if (textToSpeechEnabled) {
        speak(reading)
      }
      
      // 広告表示（daily占いの場合）
      if (fortuneType === "daily" && showAd) {
        setTimeout(() => showAd(), 1000)
      }
    }
  }, [isComplete, allCardsFlipped, reading, textToSpeechEnabled, speak, addPoints, fortuneType, showAd])

  const handleCardClick = (index: number) => {
    // カードクリックの処理は親コンポーネントで管理
  }

  const handleRetry = () => {
    setShowReading(false)
    setAllCardsFlipped(false)
    onRetry()
  }

  const handleNewFortune = () => {
    setShowReading(false)
    setAllCardsFlipped(false)
    onNewFortune()
  }

  if (!isComplete) return null

  return (
    <div className="space-y-6">
      {/* カード表示 */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div key={`result-${card.id}-${index}`} className="flex flex-col items-center">
              <FortuneCard
                card={card}
                isReversed={card.isReversed}
                initiallyFlipped={true}
                cardBackImage={cardBackImage}
              />
              <div className="mt-2 text-center">
                <p className="text-sm text-purple-300 font-medium">
                  {card.name}
                </p>
                {card.isReversed && (
                  <p className="text-xs text-amber-400">
                    {language === "en" ? "Reversed" : "逆位置"}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 結果表示 */}
      <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500">
        <CardHeader>
          <CardTitle className="text-center text-purple-300 text-xl">
            {language === "en" ? "Fortune Reading" : "占い結果"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {reading}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setShowReading(!showReading)}
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-600"
            >
              {showReading 
                ? (language === "en" ? "Hide Details" : "詳細を隠す")
                : (language === "en" ? "Show Details" : "詳細を見る")
              }
            </Button>
            
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-amber-500 text-amber-300 hover:bg-amber-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === "en" ? "Retry" : "再占い"}
            </Button>
            
            <Button
              onClick={handleNewFortune}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {language === "en" ? "New Fortune" : "新しい占い"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 詳細モーダル */}
      <Dialog open={showReading} onOpenChange={setShowReading}>
        <DialogContent className="max-w-2xl bg-gray-900 border-purple-500">
          <DialogHeader>
            <DialogTitle className="text-purple-300">
              {language === "en" ? "Detailed Reading" : "詳細な読み"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {language === "en" 
                ? "Learn more about your fortune and the cards drawn"
                : "あなたの運勢と引いたカードについて詳しく学びましょう"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-gray-300 leading-relaxed">
              {reading}
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                {language === "en" 
                  ? "This reading is based on traditional tarot interpretations and should be taken as guidance rather than absolute truth."
                  : "この読みは伝統的なタロット解釈に基づいており、絶対的な真実ではなく、ガイダンスとして受け取ってください。"
                }
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
