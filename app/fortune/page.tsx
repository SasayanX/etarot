"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, ExternalLink, RefreshCw, AlertCircle, Share2, Star } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import FortuneCard from "@/components/fortune-card"
import { useShop } from "@/contexts/shop-context"
import { getCardImageUrl } from "./card-image-urls"
import { useLanguage } from "@/contexts/language-context"
import "./fortune.css"
import { LydiaMessage } from "@/components/fortune/lydia-message"
import { ReviewPromptDialog } from "@/components/review-prompt-dialog"
import { useReviewPrompt } from "@/hooks/use-review-prompt"
import { incrementGrowthCounter, trackGrowthEvent } from "@/utils/growth-events"

// データファイルからインポート
import { getRandomSafeCards, getLuckyItems, getCardBackImage, getCurrentCardBackUrl } from "@/data/fortune-card-data"

import {
  getCardReading,
  getLoveReading,
  getCareerReading,
  getMoneyReading,
  getDecisionReading,
} from "@/data/fortune-readings-data"

import { fortuneMessages, fortuneTypes, positions } from "@/data/fortune-messages-data"

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

export default function FortunePage() {
  const { language, t } = useLanguage()

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
      cards: 2,
      description: language === "en" ? fortuneTypes.decision.description.en : fortuneTypes.decision.description.ja,
    },
  ]

  const [selectedFortuneType, setSelectedFortuneType] = useState<string | null>(null)
  const [cards, setCards] = useState<any[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [isReading, setIsReading] = useState(false)
  const [readingResult, setReadingResult] = useState<any | null>(null)
  const [shuffleCards, setShuffleCards] = useState<ShuffleCard[]>([])
  const { playSound, speak, textToSpeechEnabled, stopSpeaking } = useSettings()
  const { addPoints } = useShop()
  const { showReviewPrompt, dismissReviewPrompt, markReviewShown, requestReviewAfterPositiveMoment } = useReviewPrompt({
    autoCheck: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [cardLoadError, setCardLoadError] = useState(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const shuffleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const initialIntentHandledRef = useRef(false)
  const [canSkipShuffle, setCanSkipShuffle] = useState(false)
  const currentFortuneTypeRef = useRef<string | null>(null)
  const entryIntentRef = useRef<string | null>(null)
  const [cardBackImage, setCardBackImage] = useState<string>(getCardBackImage())
  const [entryIntent, setEntryIntent] = useState<string | null>(null)

  useEffect(() => {
    trackGrowthEvent("fortune_view")
  }, [])

  useEffect(() => {
    if (initialIntentHandledRef.current || typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const type = params.get("type")
    const intent = params.get("intent")
    const validTypes = new Set(fortuneTypesList.map((item) => item.id))

    if (intent) {
      entryIntentRef.current = intent
      setEntryIntent(intent)
    }

    if (type && validTypes.has(type)) {
      initialIntentHandledRef.current = true
      selectFortuneType(type, intent || "direct_link")
    }
  }, [fortuneTypesList])

  const updateCardBackImage = useCallback(() => {
    const newCardBackImage = getCurrentCardBackUrl()
    if (newCardBackImage !== cardBackImage) {
      setCardBackImage(newCardBackImage)
    }
  }, [cardBackImage])

  useEffect(() => {
    updateCardBackImage()
    const handleCardSuitChange = (event: Event) => {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail && customEvent.detail.imageUrl) {
          setCardBackImage(customEvent.detail.imageUrl)
        }
      } catch (error) {
        console.error("Fortune page: Card suit change event error:", error)
      }
    }

    window.addEventListener("cardSuitChanged", handleCardSuitChange)
    return () => {
      window.removeEventListener("cardSuitChanged", handleCardSuitChange)
    }
  }, [updateCardBackImage])

  useEffect(() => {
    return () => {
      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current)
      }
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
      }
    }
  }, [])

  const skipShuffle = () => {
    if (shuffleTimeoutRef.current) {
      clearTimeout(shuffleTimeoutRef.current)
    }
    prepareCards()
  }

  const prepareCards = () => {
    try {
      setIsShuffling(false)
      const typeId = currentFortuneTypeRef.current

      if (!typeId) {
        throw new Error("占いタイプが選択されていません")
      }

      const fortuneType = fortuneTypesList.find((type) => type.id === typeId)
      if (!fortuneType) {
        throw new Error(`占いタイプ「${typeId}」が見つかりません`)
      }

      const selectedCards = getRandomSafeCards(fortuneType.cards, language)

      if (selectedCards.length === 0) {
        throw new Error("カードを選択できませんでした")
      }

      const cardsWithPosition = selectedCards.map((card, index) => ({
        ...card,
        position: getPositionName(typeId, index),
        isReversed: Math.random() > 0.5,
        isFlipped: false,
        image: getCardImageUrl(card.id),
      }))

      setCards(cardsWithPosition)
      setIsLoading(false)

      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
        recoveryTimeoutRef.current = null
      }
    } catch (error) {
      console.error("カード準備中にエラーが発生しました:", error)
      setErrorDetails(error instanceof Error ? error.message : "不明なエラー")
      setCardLoadError(true)
      setIsLoading(false)
    }
  }

  const selectFortuneType = (typeId: string, sourceIntent = entryIntent || "menu") => {
    entryIntentRef.current = sourceIntent
    trackGrowthEvent("fortune_start", { type: typeId, intent: sourceIntent })

    // 今日の運勢が選択された時にAndroid広告インターフェースを呼び出し
    if (typeId === "daily") {
      try {
        // AndroidのJavaScriptインターフェースが利用可能かチェック
        if (typeof window !== "undefined" && (window as any).Android) {
          const android = (window as any).Android
          // 広告削除済みでなく、まだ運勢広告を表示していない場合のみ
          if (!android.isAdsRemoved() && !android.isFortuneInterstitialShown()) {
            android.showFortuneInterstitial()
            console.log("今日の運勢広告を表示しました")
          }
        }
      } catch (error) {
        console.log("Android広告インターフェースエラー:", error)
      }
    }

    setSelectedFortuneType(typeId)
    currentFortuneTypeRef.current = typeId
    setCardLoadError(false)
    setErrorDetails(null)
    setIsLoading(true)

    const fortuneType = fortuneTypesList.find((type) => type.id === typeId)

    if (fortuneType) {
      const shuffleAnimationCards = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        rotation: Math.random() * 180 - 90,
        offsetX: Math.random() * 200 - 100,
        offsetY: Math.random() * 200 - 100,
        delay: Math.random() * 0.5,
        zIndex: Math.floor(Math.random() * 20),
        scale: 0.8 + Math.random() * 0.4,
        animationType: Math.floor(Math.random() * 3),
      }))

      setShuffleCards(shuffleAnimationCards)
      setIsShuffling(true)
      playSound("shuffle")
      setCanSkipShuffle(true)

      if (shuffleTimeoutRef.current) {
        clearTimeout(shuffleTimeoutRef.current)
      }

      shuffleTimeoutRef.current = setTimeout(() => {
        prepareCards()
      }, 2000)
    }
  }

  const getPositionName = (typeId: string, index: number): string => {
    switch (typeId) {
      case "daily":
        return language === "en" ? positions.daily.en : positions.daily.ja
      case "love":
        return [
          language === "en" ? positions.past.en : positions.past.ja,
          language === "en" ? positions.present.en : positions.present.ja,
          language === "en" ? positions.future.en : positions.future.ja,
        ][index] ?? ""
      case "career":
        return [
          language === "en" ? positions.current.en : positions.current.ja,
          language === "en" ? positions.challenge.en : positions.challenge.ja,
          language === "en" ? positions.advice.en : positions.advice.ja,
        ][index] ?? ""
      case "money":
        return [
          language === "en" ? positions.current.en : positions.current.ja,
          language === "en" ? positions.challenge.en : positions.challenge.ja,
          language === "en" ? positions.advice.en : positions.advice.ja,
        ][index] ?? ""
      case "decision":
        if (entryIntentRef.current === "reply") {
          return [
            language === "en" ? "If you message them" : "送る場合",
            language === "en" ? "If you wait" : "待つ場合",
          ][index] ?? ""
        }

        return [
          language === "en" ? positions.optionA.en : positions.optionA.ja,
          language === "en" ? positions.optionB.en : positions.optionB.ja,
        ][index] ?? ""
      default:
        return `${language === "en" ? "Position" : "ポジション"}${index + 1}`
    }
  }

  const flipCard = (index: number) => {
    const updatedFlippedCards = [...flippedCards]

    if (!updatedFlippedCards.includes(index)) {
      playSound("flip")

      const updatedCards = [...cards]
      updatedCards[index] = {
        ...updatedCards[index],
        isFlipped: true,
      }
      setCards(updatedCards)

      updatedFlippedCards.push(index)
      setFlippedCards(updatedFlippedCards)

      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current)
        recoveryTimeoutRef.current = null
      }

      if (updatedFlippedCards.length === cards.length) {
        setTimeout(() => {
          setIsReading(true)
          generateReading()
        }, 1000)
      }
    }
  }

  const resetFortune = () => {
    if (textToSpeechEnabled && typeof stopSpeaking === "function") {
      stopSpeaking()
    }

    setSelectedFortuneType(null)
    currentFortuneTypeRef.current = null
    setCards([])
    setFlippedCards([])
    setIsReading(false)
    setReadingResult(null)
    setCardLoadError(false)
    setErrorDetails(null)
    setIsLoading(false)
    setCanSkipShuffle(false)
  }

  const retryCardSelection = () => {
    if (selectedFortuneType) {
      setCardLoadError(false)
      setErrorDetails(null)
      selectFortuneType(selectedFortuneType)
    }
  }

  const generateReading = () => {
    try {
      if (stopSpeaking && typeof stopSpeaking === "function") {
        stopSpeaking()
      }

      const typeId = currentFortuneTypeRef.current
      if (!typeId) {
        throw new Error("占いタイプが選択されていません")
      }

      const fortuneType = fortuneTypesList.find((type) => type.id === typeId)
      if (!fortuneType) {
        throw new Error(`占いタイプ「${typeId}」が見つかりません`)
      }

      const overallReading = ""
      let luckyItem = ""

      const pickLuckyItem = (cardId: number) => {
        const items = getLuckyItems(cardId, language)
        return items[Math.floor(Math.random() * items.length)] ?? ""
      }

      const cardReadings = cards.map((card) => {
        let reading = ""
        switch (typeId) {
          case "daily":
            reading = getCardReading(card.id, card.isReversed, language)
            luckyItem = pickLuckyItem(card.id)
            break
          case "love":
            reading = getLoveReading(card.id, card.position, card.isReversed, language)
            luckyItem = pickLuckyItem(card.id)
            break
          case "career":
            reading = getCareerReading(card.id, card.position, card.isReversed, language)
            luckyItem = pickLuckyItem(card.id)
            break
          case "money":
            reading = getMoneyReading(card.id, card.position, card.isReversed, language)
            luckyItem = pickLuckyItem(card.id)
            break
          case "decision":
            reading = getDecisionReading(card.id, card.position, card.isReversed, language)
            luckyItem = pickLuckyItem(card.id)
            break
          default:
            reading = language === "en" ? "No reading available" : "占いの結果はありません"
        }
        return { ...card, reading }
      })

      setReadingResult({
        overall: overallReading,
        cards: cardReadings,
        luckyItem: luckyItem,
      })

      if (typeof window !== "undefined") {
        localStorage.setItem("hasCompletedFortune", "true")
        const completionCount = incrementGrowthCounter("fortuneCompletionCount")
        trackGrowthEvent("fortune_complete", {
          type: typeId,
          cards: cardReadings.length,
          completionCount,
        })
        setTimeout(() => requestReviewAfterPositiveMoment(), 1200)
      }

      // 読み上げ機能
      if (textToSpeechEnabled && speak) {
        const combinedText = cardReadings.map((card) => `${card.position}: ${card.reading}`).join(". ")
        speak(combinedText)
      }

      // ポイントを加算
      addPoints(1)
    } catch (error) {
      console.error("占い結果の生成中にエラーが発生しました:", error)
      setReadingResult({
        overall: language === "en" ? fortuneMessages.readingTitle.en : fortuneMessages.readingTitle.ja,
        cards: cards.map((card) => ({
          ...card,
          reading:
            language === "en"
              ? "Unable to read the message from the cards. Please try again."
              : "カードからのメッセージを読み取ることができませんでした。もう一度試してみてください。",
        })),
        luckyItem: language === "en" ? "Crystal" : "クリスタル",
      })
    }
  }

  const getShareText = () => {
    const firstCard = readingResult?.cards?.[0]
    const cardName = firstCard?.name ? `「${firstCard.name}」` : "タロットカード"
    const reading = firstCard?.reading ? String(firstCard.reading).slice(0, 80) : "今日の運勢を占いました。"

    if (language === "en") {
      return `My tarot card today is ${firstCard?.name || "a tarot card"}.\n${reading}\nTry your reading too.`
    }

    return `今日のタロットは${cardName}でした。\n${reading}...\nあなたも今日の恋と運勢を占ってみて。`
  }

  const shareReading = async () => {
    if (!readingResult) return

    const shareData = {
      title: language === "en" ? "My tarot reading" : "今日のタロット占い",
      text: getShareText(),
      url: "https://play.google.com/store/apps/details?id=com.ryuka.kanau_kiryu",
    }

    trackGrowthEvent("share_click", {
      type: currentFortuneTypeRef.current,
      supportsNativeShare: typeof navigator !== "undefined" && "share" in navigator,
    })

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData)
        trackGrowthEvent("share_success", { type: currentFortuneTypeRef.current })
        return
      }

      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      trackGrowthEvent("share_copy_success", { type: currentFortuneTypeRef.current })
      alert(language === "en" ? "Reading copied to clipboard." : "占い結果をコピーしました。")
    } catch (error) {
      console.warn("Share failed:", error)
      trackGrowthEvent("share_failed", { type: currentFortuneTypeRef.current })
    }
  }

  return (
    <div className="py-8 space-y-8">
      {showReviewPrompt && (
        <ReviewPromptDialog
          isOpen={showReviewPrompt}
          onReview={() => {
            trackGrowthEvent("review_click", { source: "fortune_result" })
            // 「開いただけ」だとレビュー完了扱いにしない
            // ただし本日は再表示されないようにする
            dismissReviewPrompt()
          }}
          onDismiss={() => {
            trackGrowthEvent("review_dismiss", { source: "fortune_result" })
            dismissReviewPrompt()
          }}
          onAlreadyReviewed={markReviewShown}
        />
      )}

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-400">{getIntentTitle(entryIntent) || t("fortune.title")}</h1>
        <p className="text-xl text-purple-300">{getIntentDescription(entryIntent) || t("fortune.subtitle")}</p>
      </div>

      {!selectedFortuneType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {fortuneTypesList.map((type) => (
            <Card
              key={type.id}
              className="border-purple-700 bg-gray-900/60 backdrop-blur-sm hover:border-amber-500 transition-all cursor-pointer"
              onClick={() => selectFortuneType(type.id)}
            >
              <CardHeader>
                <CardTitle className="text-amber-400">{type.name}</CardTitle>
                <CardDescription className="text-purple-300">{type.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  {language === "en"
                    ? fortuneMessages.cardsCount.en.replace("{count}", type.cards.toString())
                    : fortuneMessages.cardsCount.ja.replace("{count}", type.cards.toString())}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-700 hover:bg-purple-600">
                  {language === "en" ? fortuneMessages.selectButton.en : fortuneMessages.selectButton.ja}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : isShuffling ? (
        <div className="relative h-80 w-full max-w-md mx-auto shuffle-container">
          {shuffleCards.map((card) => (
            <div
              key={card.id}
              className="absolute w-[140px] h-[200px] bg-purple-900 rounded-lg border-2 border-purple-700 shuffle-card"
              style={
                {
                  "--rotation": `${card.rotation}deg`,
                  "--offsetX": `${card.offsetX}`,
                  "--offsetY": `${card.offsetY}`,
                  "--delay": card.delay,
                  "--scale": card.scale,
                  zIndex: card.zIndex,
                  left: "calc(50% - 70px)",
                  top: "calc(50% - 100px)",
                } as any
              }
            >
              <img
                src={cardBackImage || "/placeholder.svg"}
                alt="Card back"
                className="w-full h-full object-fill rounded-lg"
                style={{ objectFit: "fill" }}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=300&width=200&text=Card+Back"
                }}
              />
            </div>
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="bg-gray-900/80 px-6 py-3 rounded-full">
              <p className="text-amber-400 font-bold">
                {language === "en" ? fortuneMessages.shuffling.en : fortuneMessages.shuffling.ja}
              </p>
            </div>
            {canSkipShuffle && (
              <Button
                variant="outline"
                className="bg-gray-900/80 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black"
                onClick={skipShuffle}
              >
                {language === "en" ? fortuneMessages.skip.en : fortuneMessages.skip.ja}
              </Button>
            )}
          </div>
        </div>
      ) : cardLoadError ? (
        <div className="text-center space-y-6 p-8 bg-gray-900/60 backdrop-blur-sm rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-center text-red-400 mb-2">
            <AlertCircle className="h-6 w-6 mr-2" />
            <h2 className="text-xl">
              {language === "en" ? fortuneMessages.error.title.en : fortuneMessages.error.title.ja}
            </h2>
          </div>
          <p className="text-gray-300">
            {language === "en" ? fortuneMessages.error.description.en : fortuneMessages.error.description.ja}
          </p>
          {errorDetails && (
            <div className="bg-gray-800/60 p-3 rounded text-sm text-gray-300 text-left">
              <p className="font-semibold text-red-300">
                {language === "en" ? fortuneMessages.error.details.en : fortuneMessages.error.details.ja}
              </p>
              <p>{errorDetails}</p>
            </div>
          )}
          <div className="flex justify-center gap-4">
            <Button className="bg-purple-700 hover:bg-purple-600" onClick={retryCardSelection}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {language === "en" ? fortuneMessages.error.retry.en : fortuneMessages.error.retry.ja}
            </Button>
            <Button variant="outline" onClick={resetFortune}>
              {language === "en" ? fortuneMessages.error.back.en : fortuneMessages.error.back.ja}
            </Button>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-purple-300">
            {language === "en" ? fortuneMessages.preparing.en : fortuneMessages.preparing.ja}
          </p>
        </div>
      ) : !isReading && cards.length > 0 ? (
        <div className="space-y-8">
          <div className="flex justify-center flex-wrap gap-8">
            {cards.map((card, index) => (
              <div key={index} className="text-center w-[140px]">
                <p className="text-purple-300 mb-2">{card.position}</p>
                <div
                  className="cursor-pointer transform transition-transform hover:scale-105 mx-auto"
                  onClick={() => flipCard(index)}
                >
                  <FortuneCard
                    card={card}
                    isReversed={card.isReversed}
                    initiallyFlipped={card.isFlipped || flippedCards.includes(index)}
                    cardBackImage={cardBackImage}
                    onImageError={(err) => console.error("カード画像エラー:", err)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-400">
              {language === "en" ? fortuneMessages.clickInstruction.en : fortuneMessages.clickInstruction.ja}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 md:p-6 border border-purple-700 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-6">
              {language === "en" ? fortuneMessages.readingTitle.en : fortuneMessages.readingTitle.ja}
            </h2>

            <div className="space-y-6 mb-8">
              {readingResult?.cards.map((card: any, index: number) => (
                <div key={index} className="bg-gray-800/60 p-3 md:p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                    <div className="w-full md:w-1/4">
                      <div className="relative mx-auto" style={{ maxWidth: "200px" }}>
                        <div className="pb-[150%] relative">
                          <img
                            src={card.image || getCardImageUrl(card.id) || "/placeholder.svg"}
                            alt={card.name}
                            className={`absolute inset-0 w-full h-full object-contain rounded-lg border-2 border-amber-600
              ${card.isReversed ? "transform rotate-180" : ""}`}
                            onError={(e) => {
                              const fallbackUrl = `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(
                                card.name || "タロットカード",
                              )}`
                              e.currentTarget.src = fallbackUrl
                              e.currentTarget.onerror = null
                            }}
                          />
                        </div>
                        <p className="text-center text-amber-400">{card.name}</p>
                        <p className="text-center text-xs text-gray-400">
                          {card.isReversed
                            ? language === "en"
                              ? positions.reversed.en
                              : positions.reversed.ja
                            : language === "en"
                              ? positions.upright.en
                              : positions.upright.ja}
                        </p>
                      </div>
                    </div>
                    <div className="w-full md:w-3/4">
                      <h3 className="text-xl font-bold text-purple-300 mb-2">{card.position}</h3>
                      <p className="text-white">{card.reading}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ラッキーアイテム */}
            {readingResult?.luckyItem && (
              <div className="bg-gray-800/60 p-4 rounded-lg border border-amber-500">
                <h3 className="text-xl font-bold text-amber-400 mb-2">
                  {language === "en" ? fortuneMessages.luckyItem.en : fortuneMessages.luckyItem.ja}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg">{readingResult.luckyItem}</p>
                  <Button
                    variant="outline"
                    className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black bg-transparent"
                    onClick={() => {
                      // Language-aware Amazon affiliate links
                      const searchQuery = encodeURIComponent(readingResult.luckyItem)
                      let amazonUrl = ""

                      if (language === "ja") {
                        // Japanese Amazon with Japanese affiliate ID
                        const affiliateId = "sc0a-22"
                        amazonUrl = `https://www.amazon.co.jp/s?k=${searchQuery}&tag=${affiliateId}`
                      } else {
                        // US Amazon with US affiliate ID
                        const affiliateId = "sc0a-20"
                        amazonUrl = `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateId}`
                      }

                      trackGrowthEvent("lucky_item_click", { item: readingResult.luckyItem })
                      window.open(amazonUrl, "_blank")
                    }}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {language === "en" ? fortuneMessages.amazonButton.en : fortuneMessages.amazonButton.ja}
                  </Button>
                </div>
              </div>
            )}

            <LydiaMessage className="mt-6" />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold"
                onClick={shareReading}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {language === "en" ? "Share this reading" : "結果をシェア"}
              </Button>
              <Button
                variant="outline"
                className="border-purple-500 text-purple-200 hover:bg-purple-900/50"
                onClick={() => {
                  trackGrowthEvent("review_manual_open", { source: "fortune_result" })
                    // 「開いただけ」ではレビュー完了扱いにしない
                    dismissReviewPrompt()
                  const packageName = "com.ryuka.kanau_kiryu"
                  window.location.href = `market://details?id=${packageName}`
                }}
              >
                <Star className="mr-2 h-4 w-4" />
                {language === "en" ? "Review the app" : "応援レビューを書く"}
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="bg-purple-700 hover:bg-purple-600" onClick={resetFortune}>
              {language === "en" ? fortuneMessages.newReading.en : fortuneMessages.newReading.ja}
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isReading && !readingResult} onOpenChange={(open) => !open && setIsReading(false)}>
        <DialogContent className="bg-gray-900 border-purple-700">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {language === "en" ? fortuneMessages.readingTitle.en : fortuneMessages.readingTitle.ja}
            </DialogTitle>
            <DialogDescription className="text-purple-300">
              {language === "en" ? fortuneMessages.readingDescription.en : fortuneMessages.readingDescription.ja}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getIntentTitle(intent: string | null) {
  switch (intent) {
    case "reply":
      return "好きな人から返信が来ない"
    case "feelings":
      return "彼の気持ちを知りたい"
    case "today":
      return "今日の運勢"
    default:
      return ""
  }
}

function getIntentDescription(intent: string | null) {
  switch (intent) {
    case "reply":
      return "送る場合と待つ場合、2枚のカードで次の動き方を読みます。"
    case "feelings":
      return "過去・現在・未来の流れから、相手との関係を読み解きます。"
    case "today":
      return "今日のあなたを象徴する1枚を引きます。"
    default:
      return ""
  }
}
