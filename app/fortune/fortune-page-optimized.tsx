/**
 * 最適化された占いページ
 * コンポーネント分割により保守性とパフォーマンスを向上
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { useShop } from "@/contexts/shop-context"
import { useLanguage } from "@/contexts/language-context"
import FortuneHeader from "@/components/fortune/fortune-header"
import CardShuffler from "@/components/fortune/card-shuffler"
import FortuneResults from "@/components/fortune/fortune-results"
import { getRandomSafeCards, getLuckyItems, getCurrentCardBackUrl } from "@/data/fortune-card-data"
import {
  getCardReading,
  getLoveReading,
  getCareerReading,
  getMoneyReading,
  getDecisionReading,
} from "@/data/fortune-readings-data"
import { fortuneTypes } from "@/data/fortune-messages-data"
import { memoWithPerformanceMonitoring } from "@/utils/memo-optimizer"
import "./fortune.css"

interface ShuffleCard {
  id: number
  rotation: number
  offsetX: number
  offsetY: number
  delay: number
  zIndex: number
  scale: number
  animationType: number
}

interface FortuneCard {
  id: number
  name: string
  image: string
  isReversed: boolean
}

const FortunePageOptimized = memoWithPerformanceMonitoring(() => {
  const { language, t } = useLanguage()
  const { playSound, speak, textToSpeechEnabled } = useSettings()
  const { addPoints } = useShop()

  // 占いタイプの定義
  const fortuneTypesList = [
    {
      id: "daily",
      name: language === "en" ? fortuneTypes.daily.name.en : fortuneTypes.daily.name.ja,
      cards: 1,
      description: language === "en" ? fortuneTypes.daily.description.en : fortuneTypes.daily.description.ja,
    },
    {
      id: "love",
      name: language === "en" ? fortuneTypes.love.name.en : fortuneTypes.love.name.ja,
      cards: 3,
      description: language === "en" ? fortuneTypes.love.description.en : fortuneTypes.love.description.ja,
    },
    {
      id: "career",
      name: language === "en" ? fortuneTypes.career.name.en : fortuneTypes.career.name.ja,
      cards: 3,
      description: language === "en" ? fortuneTypes.career.description.en : fortuneTypes.career.description.ja,
    },
    {
      id: "money",
      name: language === "en" ? fortuneTypes.money.name.en : fortuneTypes.money.name.ja,
      cards: 3,
      description: language === "en" ? fortuneTypes.money.description.en : fortuneTypes.money.description.ja,
    },
    {
      id: "decision",
      name: language === "en" ? fortuneTypes.decision.name.en : fortuneTypes.decision.name.ja,
      cards: 3,
      description: language === "en" ? fortuneTypes.decision.description.en : fortuneTypes.decision.description.ja,
    },
  ]

  // 状態管理
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [shuffleCards, setShuffleCards] = useState<ShuffleCard[]>([])
  const [fortuneCards, setFortuneCards] = useState<FortuneCard[]>([])
  const [reading, setReading] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [cardBackImage, setCardBackImage] = useState("/default-tarot-card-back.png")
  const [cardLoadError, setCardLoadError] = useState(false)

  // カードバック画像の更新
  useEffect(() => {
    const updateCardBack = () => {
      const currentCardBack = getCurrentCardBackUrl()
      setCardBackImage(currentCardBack)
    }

    updateCardBack()
    window.addEventListener("cardSuitChanged", updateCardBack)
    window.addEventListener("cardSuitRefresh", updateCardBack)

    return () => {
      window.removeEventListener("cardSuitChanged", updateCardBack)
      window.removeEventListener("cardSuitRefresh", updateCardBack)
    }
  }, [])

  // 占いタイプの選択
  const handleTypeSelect = useCallback((typeId: string) => {
    setSelectedType(typeId)
    setIsComplete(false)
    setReading("")
    setFortuneCards([])
    setCardLoadError(false)
  }, [])

  // シャッフル開始
  const startShuffle = useCallback(() => {
    if (!selectedType) return

    setIsShuffling(true)
    playSound("shuffle")

    // シャッフルカードの生成
    const shuffleCardsData: ShuffleCard[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      rotation: Math.random() * 360,
      offsetX: Math.random() * 200 - 100,
      offsetY: Math.random() * 100 - 50,
      delay: Math.random() * 1000,
      zIndex: i,
      scale: 0.8 + Math.random() * 0.4,
      animationType: Math.floor(Math.random() * 3) + 1,
    }))

    setShuffleCards(shuffleCardsData)
  }, [selectedType, playSound])

  // シャッフル完了
  const handleShuffleComplete = useCallback(() => {
    setIsShuffling(false)
    
    // 占いカードの生成
    const selectedFortuneType = fortuneTypesList.find(type => type.id === selectedType)
    if (!selectedFortuneType) return

    const cards = getRandomSafeCards(selectedFortuneType.cards)
    const fortuneCardsData: FortuneCard[] = cards.map(card => ({
      id: card.id,
      name: card.name,
      image: card.image,
      isReversed: Math.random() < 0.3, // 30%の確率で逆位置
    }))

    setFortuneCards(fortuneCardsData)
    setIsComplete(true)
  }, [selectedType, fortuneTypesList])

  // 読みの生成
  useEffect(() => {
    if (!isComplete || fortuneCards.length === 0) return

    const generateReading = () => {
      let generatedReading = ""

      switch (selectedType) {
        case "daily":
          generatedReading = getCardReading(fortuneCards[0], language)
          break
        case "love":
          generatedReading = getLoveReading(fortuneCards, language)
          break
        case "career":
          generatedReading = getCareerReading(fortuneCards, language)
          break
        case "money":
          generatedReading = getMoneyReading(fortuneCards, language)
          break
        case "decision":
          generatedReading = getDecisionReading(fortuneCards, language)
          break
        default:
          generatedReading = getCardReading(fortuneCards[0], language)
      }

      setReading(generatedReading)
    }

    generateReading()
  }, [isComplete, fortuneCards, selectedType, language])

  // 再占い
  const handleRetry = useCallback(() => {
    setFortuneCards([])
    setReading("")
    setIsComplete(false)
    startShuffle()
  }, [startShuffle])

  // 新しい占い
  const handleNewFortune = useCallback(() => {
    setSelectedType(null)
    setFortuneCards([])
    setReading("")
    setIsComplete(false)
    setCardLoadError(false)
  }, [])

  // 広告表示（daily占いの場合）
  const showAd = useCallback(() => {
    // 広告表示のロジック
    console.log("Showing ad for daily fortune")
  }, [])

  // エラー処理
  const handleCardLoadError = useCallback(() => {
    setCardLoadError(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {cardLoadError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-300">
              {language === "en" 
                ? "Some card images failed to load. Please try again."
                : "一部のカード画像の読み込みに失敗しました。再試行してください。"
              }
            </p>
            <Button
              onClick={handleNewFortune}
              variant="outline"
              size="sm"
              className="ml-auto border-red-500 text-red-300 hover:bg-red-600"
            >
              {language === "en" ? "Retry" : "再試行"}
            </Button>
          </div>
        )}

        {!isComplete ? (
          <div className="space-y-8">
            <FortuneHeader
              fortuneTypes={fortuneTypesList}
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
              disabled={isShuffling}
            />

            {selectedType && (
              <div className="text-center">
                <Button
                  onClick={startShuffle}
                  disabled={isShuffling}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
                >
                  {isShuffling 
                    ? (language === "en" ? "Shuffling..." : "シャッフル中...")
                    : (language === "en" ? "Start Fortune Telling" : "占いを開始")
                  }
                </Button>
              </div>
            )}
          </div>
        ) : (
          <FortuneResults
            cards={fortuneCards}
            fortuneType={selectedType || ""}
            reading={reading}
            isComplete={isComplete}
            onRetry={handleRetry}
            onNewFortune={handleNewFortune}
            cardBackImage={cardBackImage}
            showAd={selectedType === "daily" ? showAd : undefined}
          />
        )}

        <CardShuffler
          isShuffling={isShuffling}
          shuffleCards={shuffleCards}
          onShuffleComplete={handleShuffleComplete}
          cardBackImage={cardBackImage}
        />
      </div>
    </div>
  )
}, "FortunePageOptimized")

export default FortunePageOptimized
