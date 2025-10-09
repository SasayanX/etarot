"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSettings } from "@/contexts/settings-context"
import { useShop } from "@/contexts/shop-context" // ショップコンテキストをインポート
import { quizQuestions, resultMessages, getRandomQuizQuestions } from "@/data/quiz-data"
import type { QuizQuestion } from "@/types/quiz"
import Link from "next/link"
import { CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw, Home, Trophy, Medal, User, Coins } from "@/utils/icon-optimizer"
import { cn } from "@/lib/utils"
import VictoryCelebration from "@/components/victory-celebration"
import { addScore, getScoreData, formatDate, type ScoreEntry } from "@/utils/score-utils"
import { getBackupImageUrlById } from "@/utils/image-utils"
import { showAd } from "@/utils/ad-utils"
import { useLanguage } from "@/contexts/language-context"

// カードIDからカード名を取得
function getTarotCardName(cardId: number): string {
  const cardNames: { [key: number]: string } = {
    0: "愚者",
    1: "魔術師",
    2: "女教皇",
    3: "女帝",
    4: "皇帝",
    5: "教皇",
    6: "恋人",
    7: "戦車",
    7: "戦車",
    8: "力",
    9: "隠者",
    10: "運命の輪",
    11: "正義",
    12: "吊るされた男",
    13: "死神",
    14: "節制",
    15: "悪魔",
    16: "塔",
    17: "星",
    18: "月",
    19: "太陽",
    20: "審判",
    21: "世界",
  }
  return cardNames[cardId] || ""
}

// getTarotCardImagePath関数を辞書ページと同じ方法に修正
function getTarotCardImagePath(cardId: number): string {
  try {
    // 大アルカナ（0-21）の画像URL（辞書ページと同じ）
    const majorArcanaImages = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-the-fool.jpg-qMIhIdJbLFFDcbG6DCuVeJpdMxYYFF.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-the-magician.jpg-PKdG2cPVPYUaSTJyAQy3aKvkCrCLwL.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-the-high-priestess.jpg-YraHWJEM3BVr9nUX0DEQVnz75AO4Ju.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-the-empress.jpg-WtFbAgyVTI4gO8RzJkIgq8Clot9a2Z.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-the-emperor.jpg-QvRCOUbuXLX8J3uLPT3TzAsVAxNL81.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-the-hierophant.jpg-XX882Wenrj2uZI6O2YRhpUDS53puP7.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-the-lovers.jpg-r5sFSHZJlffXRhawcvLeC1gtUe6wlG.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-the-chariot.jpg-4ZyGVwUgwF4pJ3io6a4mcguNvVrtKU.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-strength.jpg-uYkF18PIdhJBnW9aPRFqNmLsVzbyVy.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-the-hermit.jpg-lSgaW8YCkTfjVeg1PQa1nCA3FBMQFz.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-wheel-of-fortune.jpg-wgeUsJcjpGaFq7H0ZjIgl1yWyxyKFR.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11-justice.jpg-acM0yRB2NWKdMzpXyctcIYb67gccRc.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-the-hanged-man.jpg-I7QImjNEyPcoXcCV2Zr2d35KewHlWq.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13-death.jpg-J0PTAiPztA6qzlpGQINoO92MaKphrV.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-temperance.jpg-kO6BMsCpNJuJEzAioFgyLOUUQMDGEh.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-the-devil.jpg-RoornKKvcHXyJLLY4gXM9XlDqPsWDW.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/16-the-tower.jpg-2qD572YP7T5eLZVCzL4yDW3la44yDL.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17-the-star.jpg-btLZ7a8dSYhhbNGSuYn85LICydZ7w3.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18-the-moon.jpg-8qr3hzWSQiQ3lKTJX8T4D3P7ECWUb1.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19-the-sun.jpg-DXpvNqh1OFJzpwh1aD0OBUbQkSpbZQ.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20-judgement.jpg-2E1PWIPfjQZXH1qhnpyS6cx18PZUIO.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/21-the-world.jpg-wVVLmPfvFrEUueWlS0jn3xFihvnTm1.jpeg",
    ]

    // 大アルカナ（0-21）
    if (cardId >= 0 && cardId <= 21) {
      return majorArcanaImages[cardId] || getBackupImageUrlById(cardId)
    }

    // 小アルカナ - ワンド（22-35）
    if (cardId >= 22 && cardId <= 35) {
      const rank = cardId - 22
      const wandImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-wands.jpg-1pPgS5t2dGOqjkS3N4GkIbLgmSSI87.jpeg", // エース
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-wand.jpg-e1azrTpQTiu35k0oVguk6JaMegRRoA.jpeg", // 2
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-wand.jpg-uGgEzjxHzYqLgrsGdx2itqLqch0ktv.jpeg", // 3
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-wand.jpg-CEnCaef04E0RX6y3HL2YWzMiyx09Cl.jpeg", // 4
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-wand.jpg-3NViw5cuNzuYmrbaes8DH6ubhXtebR.jpeg", // 5
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-wand.jpg-6rYwxii5fJjY1b6nF61zpsETWq3Q9a.jpeg", // 6
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-wand.jpg-POyReivh15Dh1fuNwTWVjMOKBIBC8B.jpeg", // 7
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-wand.jpg-fmFOT86lrSsK7eoe6UAHKA1fZ8AZfC.jpeg", // 8
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-wand.jpg-lzxgJY822vkf4qEMEaSQAotpxCuY9J.jpeg", // 9
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-wand.jpg-Gn7coGdI4gOe9YShWorFzHIzgdLAJB.jpeg", // 10
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-wand.jpg-MlWxZUsmhzZOv8En7rmJ5KzQrFzQhv.jpeg", // ペイジ
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-wands.jpg-OkWaa0SGCP5AvO9jTovVeGCQocd5Nr.jpeg", // ナイト
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-wands.jpg-bAjPDuYLlBAKowtcT2BskSkTCR3Xrj.jpeg", // クイーン
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-wands.jpg-FaSnZh01XlalPLWM12oSnLAh1WQqJT.jpeg", // キング
      ]
      return wandImages[rank] || getBackupImageUrlById(cardId)
    }

    // 小アルカナ - カップ（36-49）
    if (cardId >= 36 && cardId <= 49) {
      const rank = cardId - 36
      const cupImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-cups.jpg-VdQlUGDd9GSnJ60boD0YML61KU94Z8.jpeg", // エース
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-cups.jpg-uhNsNJYS4QrAve5t4Za9nGcOEYd8yW.jpeg", // 2
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-cups.jpg-oRHYBimxtzuKW8YvHioHORuHor80vR.jpeg", // 3
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-cups.jpg-7OuDpH6Ixsr67IlGzYvc54ZNmVu5oN.jpeg", // 4
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-cups.jpg-EqSd43skY62lAQfdNEZqG8LD7qB412.jpeg", // 5
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-cups.jpg-KEq9KNSBvM7gA0W6tM0YfNv93ygb6V.jpeg", // 6
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-cups.jpg-vmL5EERQuPJEfiyDcQEoDfwDi5tbXk.jpeg", // 7
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-cups.jpg-8wIA9ua8sKHHKRN70U9hgy8HlMEXkW.jpeg", // 8
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-cups.jpg-6Ummn38NN5G3Ko3FXezhwy70ATu542.jpeg", // 9
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-cups.jpg-HxvR7GmKqtY82qhTCsPIIQk0tkHYvi.jpeg", // 10
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-cups.jpg-VDfN69Dd51JoRKiacP22I3JFpg41Td.jpeg", // ペイジ
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-cups.jpg-XWNThF2JdShb882z4xoe0Ml6Ig512P.jpeg", // ナイト
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-cups.jpg-3H2Jy2bCM3UBmlcVBHZcXjPSZlh2Iq.jpeg", // クイーン
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-cups.jpg-8pSIMwNTDwUDYODInULhoVL5dQqi7U.jpeg", // キング
      ]
      return cupImages[rank] || getBackupImageUrlById(cardId)
    }

    // 小アルカナ - ソード（50-63）
    if (cardId >= 50 && cardId <= 63) {
      const rank = cardId - 50
      const swordImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-swords.jpg-chQNJGHWYsgEdxiSs6lxm0qOHbUZBg.jpeg", // エース
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-swords.jpg-9Y90GTmtafXm8I2usHFONGwbGwOw3G.jpeg", // 2
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-swords.jpg-wU8DRZDJEWpCaCQkq1z0qBaOfOrCDN.jpeg", // 3
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-swords.jpg-rCTihe3IGhTiIGEHNjHDwFmnVsYAXD.jpeg", // 4
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-swords.jpg-Hh1SF2fvD442nNxA1FH7Jqy3QuU2wO.jpeg", // 5
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-swords.jpg-sDaZV3jEsZz9WxGShlVQ7WwjbwquvC.jpeg", // 6
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-swords.jpg-B7vythd4DCsgBFxobBRRg7x67Grg7U.jpeg", // 7
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-swords.jpg-ZuZ3IGXCOTgDKnrvcAfVeEOUfcgHyJ.jpeg", // 8
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-swords.jpg-PT4bbyVRPkQNvQznfpfazgmPDHIZpb.jpeg", // 9
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-swords.jpg-GYnCdRpKiyjA6DDQLa6pB8shYz6Jhp.jpeg", // 10
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-swords.jpg-lP1mllBk5M4opSWf9HY2Omk2xu9fcJ.jpeg", // ペイジ
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-swords.jpg-6TKK2zvwPWwV9O1URXFrSrkN8wqQks.jpeg", // ナイト
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-swords.jpg-noAseTB0yKPSU6Ac0wPUfx1x0PczXT.jpeg", // クイーン
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-swords.jpg-OtXJA2MtUgtsSCn62CsZMnCr5b39YQ.jpeg", // キング
      ]
      return swordImages[rank] || getBackupImageUrlById(cardId)
    }

    // 小アルカナ - ペンタクル（64-77）
    if (cardId >= 64 && cardId <= 77) {
      const rank = cardId - 64
      const pentacleImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-pentacles.jpg-sOIxEMVL7AYzJHFBVZHadwkQNQ5INU.jpeg", // エース
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-pentacles.jpg-CYF4Kk57XozbdpMtcEzNqjFKULQEan.jpeg", // 2
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-pentacles.jpg-4edW40u19prYAlWLlXTpqLWhtnERrd.jpeg", // 3
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-pentacles.jpg-xc3cZEQ5a9W9wpjfR5jx4e9UAGxzoR.jpeg", // 4
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-pentacles.jpg-FHrMohEpyQspTW9SiBtZdhjFRWTzZ2.jpeg", // 5
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-pentacles.jpg-k1ZccRug9vFuXX8NGzPeNfLnlHhS9N.jpeg", // 6
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-pentacles.jpg-Q56TZYMSPr7RkPwfPV3Ax27Kb6BHQe.jpeg", // 7
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-pentacles.jpg-gHhaF7l39UimbmTZDDwHkU75xkI8Je.jpeg", // 8
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-pentacles.jpg-UZC0QT8V3Ai6DChLf6awGUwbOgi8Yt.jpeg", // 9
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-pentcles.jpg-pyvomqOb4EbMBVsC7f8PFMmFGLzYm0.jpeg", // 10
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-pentacles.jpg-8Y1jttau2zYwoYEXhOK8keTemNUVT2.jpeg", // ペイジ
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-pentacles.jpg-0rJ5zpcRimJrcoOxAvhptXxxJDq8fM.jpeg", // ナイト
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-pentacles.jpg-GyZ3HM2SZGZH7xreBIgDBXZzkNVA72.jpeg", // クイーン
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-pentacles.jpg-ieyyz6EdkWCQ9LbJ9aqU8ARyc627QB.jpeg", // キング
      ]
      return pentacleImages[rank] || getBackupImageUrlById(cardId)
    }

    // フォールバック
    console.warn(`Invalid card ID: ${cardId}, using backup image`)
    return getBackupImageUrlById(cardId)
  } catch (error) {
    console.error(`Error getting card image path for ID: ${cardId}`, error)
    return getBackupImageUrlById(cardId)
  }
}

// 難易度に応じた色を取得
function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "easy":
      return "bg-green-500/20 text-green-500 border-green-500/50"
    case "medium":
      return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
    case "hard":
      return "bg-red-500/20 text-red-500 border-red-500/50"
    default:
      return "bg-gray-500/20 text-gray-500 border-gray-500/50"
  }
}

// カテゴリに応じた色を取得
function getCategoryColor(category: string): string {
  switch (category) {
    case "meaning":
      return "bg-purple-500/20 text-purple-500 border-purple-500/50"
    case "symbol":
      return "bg-blue-500/20 text-blue-500 border-blue-500/50"
    case "history":
      return "bg-amber-500/20 text-amber-500 border-amber-500/50"
    case "element":
      return "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
    case "astrology":
      return "bg-pink-500/20 text-pink-500 border-pink-500/50"
    default:
      return "bg-gray-500/20 text-gray-500 border-gray-500/50"
  }
}

// メダルの色を取得
const getMedalColor = (index: number): string => {
  switch (index) {
    case 0:
      return "text-yellow-400" // 金
    case 1:
      return "text-gray-300" // 銀
    case 2:
      return "text-amber-600" // 銅
    default:
      return "text-gray-500"
  }
}

// メダルアイコンを取得
const getMedalIcon = (index: number) => {
  if (index <= 2) {
    return <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
  }
  return <Trophy className="h-4 w-4 text-gray-500 opacity-50" />
}

const QuizPage = () => {
  // すべてのフックをコンポーネントの最上部に配置
  const [activeTab, setActiveTab] = useState("quick")
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>(["easy", "medium", "hard"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "meaning",
    "symbol",
    "history",
    "element",
    "astrology",
  ])
  const [customQuizSize, setCustomQuizSize] = useState(10)
  const [combo, setCombo] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [scoreData, setScoreData] = useState(() => getScoreData())
  const [earnedTarotPoints, setEarnedTarotPoints] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(0)
  const [questionResults, setQuestionResults] = useState<Array<{ isCorrect: boolean; points: number }>>([])

  // コンテキストフック
  const { playSound, speak, textToSpeechEnabled } = useSettings()
  const { points, addPoints } = useShop()
  const { t, language } = useLanguage()

  // メモ化されたフック
  const memoizedQuestions = useMemo(() => questions, [questions])
  const memoizedImageSource = useCallback((cardId: number) => getCardImageSource(cardId), [imageErrors])

  // すべてのuseEffectをここに配置
  useEffect(() => {
    setMounted(true)
    if (process.env.NODE_ENV === "development") {
      setDebugMode(true)
    }
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionResults(new Array(questions.length).fill(null))
    }
  }, [questions.length])

  useEffect(() => {
    setScoreData(getScoreData())
  }, [])

  useEffect(() => {
    console.log("[QUIZ DEBUG] ShopContext points changed:", points)
  }, [points])

  useEffect(() => {
    console.log("Quiz page - Current points:", points)
    if (debugMode && questions.length > 0 && currentQuestionIndex < questions.length) {
      console.log("Current question:", questions[currentQuestionIndex])
      console.log("Correct answer index:", questions[currentQuestionIndex].correctAnswer)
      console.log(
        "Correct answer:",
        questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswer],
      )
    }
  }, [points, questions, currentQuestionIndex, debugMode])

  useEffect(() => {
    const loadPoints = () => {
      if (typeof window !== "undefined") {
        const savedPoints = localStorage.getItem("tarotPoints")
        const pointsValue = savedPoints ? Number.parseInt(savedPoints, 10) : 0
        console.log(`[QUIZ DEBUG] Loading points from localStorage: ${pointsValue}`)
        setCurrentPoints(pointsValue)
      }
    }

    loadPoints()

    const handlePointsUpdate = (event: CustomEvent) => {
      console.log(`[QUIZ DEBUG] Points update event: ${event.detail.points}`)
      setCurrentPoints(event.detail.points)
    }

    window.addEventListener("tarotPointsUpdated", handlePointsUpdate as EventListener)

    return () => {
      window.removeEventListener("tarotPointsUpdated", handlePointsUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    if (isAnswered) {
      const newResults = [...questionResults]
      const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer
      const multiplier = isCorrect ? Math.min(10, combo) : 0
      const points = isCorrect ? 100 * multiplier : 0

      newResults[currentQuestionIndex] = { isCorrect, points }
      setQuestionResults(newResults)
    }
  }, [isAnswered, selectedOption, currentQuestionIndex, questions, combo])

  useEffect(() => {
    if (quizStarted && questions.length > 0) {
      const preloadCardImages = () => {
        const currentQuestion = questions[currentQuestionIndex]
        if (currentQuestion?.cardId !== undefined) {
          const img = new Image()
          img.src = getTarotCardImagePath(currentQuestion.cardId)
        }

        preloadNextImages()
      }

      preloadCardImages()
    }
  }, [quizStarted, currentQuestionIndex, questions])

  // コールバック関数
  const preloadNextImages = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestion = questions[currentQuestionIndex + 1]
      if (nextQuestion?.cardId !== undefined) {
        const img = new Image()
        img.src = getTarotCardImagePath(nextQuestion.cardId)
      }
    }
  }, [currentQuestionIndex, questions])

  const calculatePoints = useCallback(() => {
    return score
  }, [score])

  const handleOptionSelect = useCallback(
    (optionIndex: number) => {
      if (isAnswered) return

      setSelectedOption(optionIndex)
      setIsAnswered(true)

      const currentQuestion = questions[currentQuestionIndex]
      const basePoints = 100

      if (optionIndex === currentQuestion.correctAnswer) {
        const newCombo = combo + 1
        const multiplier = Math.min(10, newCombo)
        const pointsEarned = basePoints * multiplier

        setScore(score + pointsEarned)
        setCombo(newCombo)
        playSound("match")

        if (textToSpeechEnabled) {
          speak(`正解です！${multiplier}倍の${pointsEarned}スコア獲得！`)
        }
        setTimeout(() => {
          if (textToSpeechEnabled) {
            speak(currentQuestion.explanation)
          }
        }, 1500)
      } else {
        setCombo(0)
        playSound("wrong")

        if (textToSpeechEnabled) {
          speak("残念、不正解です。")
        }
        setTimeout(() => {
          if (textToSpeechEnabled) {
            speak(currentQuestion.explanation)
          }
        }, 1500)
      }
    },
    [isAnswered, questions, currentQuestionIndex, score, combo, textToSpeechEnabled, speak, playSound],
  )

  const goToNextQuestion = useCallback(() => {
    setShowExplanation(false)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setIsAnswered(false)
      if (textToSpeechEnabled && currentQuestionIndex + 1 < questions.length) {
        const nextQuestion = questions[currentQuestionIndex + 1]
        speak(nextQuestion.question)
      }
    } else {
      try {
        console.log("Quiz ending - starting end game process")

        playSound("success")

        const points = calculatePoints()
        setEarnedPoints(points)

        const validResults = questionResults.filter((result) => result !== null && result !== undefined)
        const correctAnswers = validResults.filter((result) => result.isCorrect).length
        const tarotPoints = Math.floor(points / 100)

        console.log("Quiz results:", {
          totalQuestions: questions.length,
          validResults: validResults.length,
          correctAnswers,
          tarotPoints,
          points,
        })

        if (tarotPoints > 0) {
          console.log("Adding tarot points at quiz end:", tarotPoints)
          try {
            addPoints(tarotPoints)
          } catch (error) {
            console.error("Error adding tarot points:", error)
          }
        }

        setTimeout(() => {
          try {
            setEarnedTarotPoints(tarotPoints)
            setShowVictory(true)

            if (textToSpeechEnabled) {
              const percentage = Math.round((correctAnswers / questions.length) * 100)
              speak(
                `クイズ終了！あなたのスコアは${points}ポイント、${correctAnswers}問正解、${percentage}%です。獲得タロットポイントは${tarotPoints}TPです！`,
              )
            }
          } catch (error) {
            console.error("Error in quiz end state update:", error)
            setQuizCompleted(true)
          }
        }, 100)
      } catch (error) {
        console.error("Error in quiz end process:", error)
        setQuizCompleted(true)
      }
    }
  }, [
    currentQuestionIndex,
    questions,
    textToSpeechEnabled,
    speak,
    playSound,
    calculatePoints,
    questionResults,
    addPoints,
    score,
  ])

  // その他の関数
  const initializeQuickQuiz = () => {
    showAd("quiz_quick")
    const selectedQuestions = getRandomQuizQuestions(10)

    if (debugMode) {
      console.log("Selected questions:", selectedQuestions)
      selectedQuestions.forEach((q, i) => {
        console.log(`Question ${i + 1} - Correct answer index: ${q.correctAnswer}`)
      })
    }

    setQuestions(selectedQuestions)
    resetQuiz()
    setQuizStarted(true)
    if (textToSpeechEnabled && selectedQuestions.length > 0) {
      setTimeout(() => {
        speak(selectedQuestions[0].question)
      }, 500)
    }
  }

  const initializeCustomQuiz = () => {
    showAd("quiz_custom")

    const filtered = quizQuestions.filter(
      (q) => selectedDifficulty.includes(q.difficulty) && selectedCategories.includes(q.category),
    )

    const shuffled = [...filtered].sort(() => 0.5 - Math.random())
    const selectedQuestions = getRandomQuizQuestions(Math.min(customQuizSize, filtered.length))

    if (debugMode) {
      console.log("Selected questions:", selectedQuestions)
      selectedQuestions.forEach((q, i) => {
        console.log(`Question ${i + 1} - Correct answer index: ${q.correctAnswer}`)
      })
    }

    setQuestions(selectedQuestions)
    resetQuiz()
    setQuizStarted(true)
    if (textToSpeechEnabled && selectedQuestions.length > 0) {
      setTimeout(() => {
        speak(selectedQuestions[0].question)
      }, 500)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizCompleted(false)
    setShowExplanation(false)
    setQuizStarted(true)
    setShowVictory(false)
    setCombo(0)
    setImageErrors({})
    setEarnedTarotPoints(0)
    setQuestionResults([])
  }

  const getResultMessage = () => {
    const correctAnswers = questionResults.filter((result) => result && result.isCorrect).length
    const percentage = (correctAnswers / questions.length) * 100

    if (percentage >= 90) {
      const randomIndex = Math.floor(Math.random() * resultMessages.excellent[language].length)
      return resultMessages.excellent[language][randomIndex]
    } else if (percentage >= 70) {
      const randomIndex = Math.floor(Math.random() * resultMessages.good[language].length)
      return resultMessages.good[language][randomIndex]
    } else if (percentage >= 50) {
      const randomIndex = Math.floor(Math.random() * resultMessages.average[language].length)
      return resultMessages.average[language][randomIndex]
    } else {
      const randomIndex = Math.floor(Math.random() * resultMessages.poor[language].length)
      return resultMessages.poor[language][randomIndex]
    }
  }

  const toggleDifficulty = (difficulty: string) => {
    if (selectedDifficulty.includes(difficulty)) {
      if (selectedDifficulty.length > 1) {
        setSelectedDifficulty(selectedDifficulty.filter((d) => d !== difficulty))
      }
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty])
    }
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== category))
      }
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSaveScore = (playerName: string) => {
    console.log("Saving score:", earnedPoints, "for player:", playerName)
    addScore("timeAttack", earnedPoints, undefined, playerName, earnedTarotPoints)
    setScoreData(getScoreData())
  }

  const handleVictoryClose = () => {
    setShowVictory(false)
    setQuizCompleted(true)
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo(0, 0)
      }
    }, 100)
  }

  const handleImageError = (cardId: number) => {
    console.warn(`Failed to load image for card ID: ${cardId}, using backup image`)
    setImageErrors((prev) => ({ ...prev, [cardId]: true }))
  }

  const getCardImageSource = (cardId: number) => {
    try {
      if (imageErrors[cardId]) {
        console.log(`Using backup image for card ID: ${cardId}`)
        return getBackupImageUrlById(cardId)
      }
      const imagePath = getTarotCardImagePath(cardId)
      console.log(`Using image path for card ID ${cardId}: ${imagePath}`)
      return imagePath
    } catch (error) {
      console.error(`Error getting image source for card ID: ${cardId}`, error)
      return getBackupImageUrlById(cardId)
    }
  }

  // マウント前は何も表示しない
  if (!mounted) {
    return null
  }

  return (
    <div className="py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-400">{language === "ja" ? "タロットクイズ" : "Tarot Quiz"}</h1>
        <p className="text-xl text-purple-300">
          {language === "ja" ? "タロットの知識をテストしよう" : "Test your Tarot knowledge"}
        </p>

        <div className="flex justify-center items-center mt-2">
          <div className="bg-amber-900/30 px-4 py-2 rounded-full flex items-center">
            <Coins className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-amber-400 font-bold">{currentPoints} TP</span>
          </div>
        </div>
        {debugMode && (
          <div className="text-xs text-gray-400 mt-1">
            Debug: localStorage points = {currentPoints}, ShopContext points = {points}
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="quick">{language === "ja" ? "クイックモード" : "Quick Mode"}</TabsTrigger>
          <TabsTrigger value="custom">{language === "ja" ? "カスタムモード" : "Custom Mode"}</TabsTrigger>
        </TabsList>

        <TabsContent value="quick" className="space-y-6">
          <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-amber-400">{language === "ja" ? "クイックモード" : "Quick Mode"}</CardTitle>
              <CardDescription className="text-purple-300">
                {language === "ja"
                  ? "10問のランダムなクイズに挑戦しよう"
                  : "Challenge yourself with 10 randomly selected quiz questions."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700">
                <h3 className="text-lg font-bold text-amber-400 mb-2">{language === "ja" ? "ルール" : "Rules"}</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>
                    {language === "ja"
                      ? "10問のランダムな問題に挑戦"
                      : "Challenge yourself with 10 randomly selected questions"}
                  </li>
                  <li>
                    {language === "ja"
                      ? "難易度と問題カテゴリはランダムに選択"
                      : "Difficulty and question categories are randomly selected"}
                  </li>
                  <li>
                    {language === "ja"
                      ? "正解で100スコア獲得（基本点）"
                      : "Earn score for correct answers (base 100 score)"}
                  </li>
                  <li>
                    {language === "ja"
                      ? "連続正解でコンボボーナス（最大10倍）"
                      : "Consecutive correct answers multiply your score (up to 10x for 1000 score)"}
                  </li>
                  <li className="text-amber-400">
                    {language === "ja"
                      ? "正解でタロットポイント（TP）を獲得！"
                      : "Earn Tarot Points (TP) for correct answers!"}
                  </li>
                  <li className="text-amber-400">
                    {language === "ja" ? "高難易度ほど多くのTPを獲得" : "Higher difficulty levels earn more TP"}
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                onClick={initializeQuickQuiz}
              >
                {language === "ja" ? "クイックモード開始" : "Start Quick Mode"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-amber-400">{language === "ja" ? "カスタムモード" : "Custom Mode"}</CardTitle>
              <CardDescription className="text-purple-300">
                {language === "ja"
                  ? "難易度、カテゴリ、問題数をカスタマイズしてクイズに挑戦"
                  : "Customize difficulty, categories, and question count for your quiz challenge"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3">{language === "ja" ? "難易度" : "Difficulty"}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedDifficulty.includes("easy")
                        ? "bg-green-500/20 text-green-500 border-green-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleDifficulty("easy")}
                  >
                    {language === "ja" ? "初級" : "Easy"} (1TP)
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedDifficulty.includes("medium")
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleDifficulty("medium")}
                  >
                    {language === "ja" ? "中級" : "Medium"} (1TP)
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedDifficulty.includes("hard")
                        ? "bg-red-500/20 text-red-500 border-red-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleDifficulty("hard")}
                  >
                    {language === "ja" ? "上級" : "Hard"} (2TP)
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">{language === "ja" ? "カテゴリ" : "Category"}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedCategories.includes("meaning")
                        ? "bg-purple-500/20 text-purple-500 border-purple-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleCategory("meaning")}
                  >
                    {language === "ja" ? "カードの意味" : "Card Meaning"}
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedCategories.includes("symbol")
                        ? "bg-blue-500/20 text-blue-500 border-blue-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleCategory("symbol")}
                  >
                    {language === "ja" ? "象徴" : "Symbol"}
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedCategories.includes("history")
                        ? "bg-amber-500/20 text-amber-500 border-amber-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleCategory("history")}
                  >
                    {language === "ja" ? "歴史" : "History"}
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedCategories.includes("element")
                        ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleCategory("element")}
                  >
                    {language === "ja" ? "元素" : "Element"}
                  </Badge>
                  <Badge
                    className={cn(
                      "cursor-pointer border",
                      selectedCategories.includes("astrology")
                        ? "bg-pink-500/20 text-pink-500 border-pink-500/50"
                        : "bg-gray-500/20 text-gray-500 border-gray-500/50",
                    )}
                    onClick={() => toggleCategory("astrology")}
                  >
                    {language === "ja" ? "占星術" : "Astrology"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">{language === "ja" ? "問題数" : "Question Count"}</h3>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    className="border-purple-700 text-purple-300"
                    onClick={() => setCustomQuizSize(Math.max(5, customQuizSize - 5))}
                  >
                    -5
                  </Button>
                  <span className="text-2xl font-bold text-amber-400">{customQuizSize}</span>
                  <Button
                    variant="outline"
                    className="border-purple-700 text-purple-300"
                    onClick={() => setCustomQuizSize(Math.min(20, customQuizSize + 5))}
                  >
                    +5
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                onClick={initializeCustomQuiz}
              >
                {language === "ja" ? "カスタムモード開始" : "Start Custom Mode"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {quizStarted && !quizCompleted && questions.length > 0 && (
        <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-amber-400">
                  {language === "ja" ? "問題" : "Question"} {currentQuestionIndex + 1}/{questions.length}
                </CardTitle>
                <CardDescription className="text-purple-300">
                  <div className="flex gap-2 mt-1">
                    <Badge className={getDifficultyColor(questions[currentQuestionIndex].difficulty)}>
                      {questions[currentQuestionIndex].difficulty === "easy"
                        ? "初級"
                        : questions[currentQuestionIndex].difficulty === "medium"
                          ? "中級"
                          : "上級"}
                    </Badge>
                    <Badge className={getCategoryColor(questions[currentQuestionIndex].category)}>
                      {questions[currentQuestionIndex].category === "meaning"
                        ? "カードの意味"
                        : questions[currentQuestionIndex].category === "symbol"
                          ? "象徴"
                          : questions[currentQuestionIndex].category === "history"
                            ? "歴史"
                            : questions[currentQuestionIndex].category === "element"
                              ? "元素"
                              : "占星術"}
                    </Badge>
                  </div>
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{language === "ja" ? "スコア" : "Score"}</p>
                <p className="text-xl font-bold text-amber-400">{score}</p>
                {combo > 0 && (
                  <p className="text-sm font-bold text-green-400 animate-pulse">
                    {combo} {language === "ja" ? "コンボ" : "Combo"}! (x{Math.min(10, combo + 1)})
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700">
              <h3 className="text-xl font-bold text-white mb-4">
                {typeof questions[currentQuestionIndex].question === "string"
                  ? questions[currentQuestionIndex].question
                  : questions[currentQuestionIndex].question[language] ||
                    questions[currentQuestionIndex].question.ja ||
                    questions[currentQuestionIndex].question}
              </h3>

              {questions[currentQuestionIndex].cardId !== undefined && (
                <div className="flex justify-center mb-6">
                  <div className="w-32">
                    <img
                      src={memoizedImageSource(questions[currentQuestionIndex].cardId!) || "/placeholder.svg"}
                      alt={getTarotCardName(questions[currentQuestionIndex].cardId!)}
                      className="w-full rounded-lg border-2 border-amber-600 shadow-lg shadow-amber-500/20"
                      onError={() => handleImageError(questions[currentQuestionIndex].cardId!)}
                      onLoad={() =>
                        console.log(`Successfully loaded image for card ID: ${questions[currentQuestionIndex].cardId}`)
                      }
                      data-card-id={questions[currentQuestionIndex].cardId}
                      crossOrigin="anonymous"
                    />
                    <p className="text-center text-sm text-amber-400 mt-2">
                      {getTarotCardName(questions[currentQuestionIndex].cardId!)}
                    </p>
                    {debugMode && (
                      <div className="text-xs text-gray-400 mt-1 text-center">
                        <p>Card ID: {questions[currentQuestionIndex].cardId}</p>
                        <p>Image: {getCardImageSource(questions[currentQuestionIndex].cardId!)}</p>
                        <p>Error: {imageErrors[questions[currentQuestionIndex].cardId!] ? "Yes" : "No"}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {(() => {
                  const currentQuestion = questions[currentQuestionIndex]
                  let optionsToDisplay: string[] = []

                  if (
                    typeof currentQuestion.options === "object" &&
                    currentQuestion.options.ja &&
                    currentQuestion.options.en
                  ) {
                    optionsToDisplay = currentQuestion.options[language] || currentQuestion.options.ja || []
                  } else if (Array.isArray(currentQuestion.options)) {
                    optionsToDisplay = currentQuestion.options
                  } else {
                    console.error("Unknown options structure:", currentQuestion.options)
                    optionsToDisplay = []
                  }

                  return optionsToDisplay.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "justify-start text-left h-auto py-3 px-4 border-2",
                        isAnswered && index === currentQuestion.correctAnswer
                          ? "border-green-500 bg-green-500/20 text-green-500"
                          : isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer
                            ? "border-red-500 bg-red-500/20 text-red-500"
                            : selectedOption === index
                              ? "border-amber-500 bg-amber-500/20 text-amber-500"
                              : "border-purple-700 text-purple-300 hover:bg-purple-900/50",
                      )}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {isAnswered && index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <div
                              className={cn(
                                "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                selectedOption === index ? "border-amber-500 bg-amber-500/20" : "border-purple-700",
                              )}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))
                })()}
              </div>

              {debugMode && (
                <div className="mt-4 p-2 bg-gray-700/50 rounded text-xs text-gray-300">
                  <p>Debug: 正解インデックス = {questions[currentQuestionIndex].correctAnswer}</p>
                  <p>Debug: Options構造 = {JSON.stringify(questions[currentQuestionIndex].options)}</p>
                  <p>
                    Debug: 正解 = {(() => {
                      const currentQuestion = questions[currentQuestionIndex]
                      if (typeof currentQuestion.options === "object" && currentQuestion.options.ja) {
                        return (
                          currentQuestion.options[language]?.[currentQuestion.correctAnswer] ||
                          currentQuestion.options.ja[currentQuestion.correctAnswer]
                        )
                      } else if (Array.isArray(currentQuestion.options)) {
                        return currentQuestion.options[currentQuestion.correctAnswer]
                      }
                      return "不明"
                    })()}
                  </p>
                </div>
              )}
            </div>

            {isAnswered && (
              <div
                className={cn(
                  "bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border transition-all duration-500",
                  selectedOption === questions[currentQuestionIndex].correctAnswer
                    ? "border-green-500"
                    : "border-red-500",
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={cn(
                    "text-lg font-bold",
                    selectedOption === questions[currentQuestionIndex].correctAnswer
                      ? "text-green-400"
                      : "text-red-400"
                  )}>
                    {selectedOption === questions[currentQuestionIndex].correctAnswer
                      ? (language === "ja" ? "正解！" : "Correct!")
                      : (language === "ja" ? "不正解" : "Incorrect")}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-300 hover:text-purple-200 p-0 h-auto"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    <HelpCircle className="h-5 w-5 mr-1" />
                    {language === "ja" ? "解説" : "Explanation"}を
                    {showExplanation
                      ? language === "ja"
                        ? "非表示"
                        : "Hide"
                      : language === "ja"
                        ? "解説"
                        : "Explanation"}
                  </Button>
                </div>

                {showExplanation && (
                  <p className="text-gray-300 text-sm mt-2">
                    {typeof questions[currentQuestionIndex].explanation === "string"
                      ? questions[currentQuestionIndex].explanation
                      : questions[currentQuestionIndex].explanation[language] ||
                        questions[currentQuestionIndex].explanation.ja ||
                        questions[currentQuestionIndex].explanation}
                  </p>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {isAnswered && (
              <Button
                className="ml-4 bg-purple-700 hover:bg-purple-600 transition-all duration-300"
                onClick={goToNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1
                  ? language === "ja"
                    ? "次へ"
                    : "Next"
                  : language === "ja"
                    ? "結果を見る"
                    : "Show Results"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-amber-400 flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            {language === "ja" ? "スコアボード" : "Quiz Scoreboard"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-purple-300">
              {language === "ja" ? "タロットクイズ ハイスコア" : "Tarot Quiz High Scores"}
            </h3>
            {scoreData.timeAttack.length > 0 ? (
              <div className="space-y-1">
                {scoreData.timeAttack.map((entry: ScoreEntry, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800/60 p-2 rounded-md border border-gray-700"
                  >
                    <div className="flex items-center">
                      <span className="w-8 flex items-center justify-center">{getMedalIcon(index)}</span>
                      <div>
                        <div className="font-medium text-white flex items-center">
                          <User className="h-3 w-3 mr-1 text-gray-400" />
                          {entry.playerName}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(entry.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400">{entry.score.toLocaleString()}</div>
                      {entry.tarotPoints !== undefined && entry.tarotPoints > 0 && (
                        <div className="text-xs text-amber-300">+{entry.tarotPoints}TP</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400">
                {language === "ja"
                  ? "まだスコアがありません。クイズに挑戦して最初の記録を作ろう！"
                  : "No scores yet. Take the quiz to create your first record!"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {quizCompleted && !showVictory && (
        <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-400">{language === "ja" ? "クイズ結果" : "Quiz Results"}</CardTitle>
            <CardDescription className="text-purple-300">
              {language === "ja" ? "お疲れ様でした！あなたの結果をご覧ください。" : "Well done! Here are your results."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-amber-500/20 border-4 border-amber-500 mb-4">
                <div>
                  <p className="text-3xl font-bold text-amber-400">{score}</p>
                  <p className="text-sm text-amber-300">ポイント</p>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{getResultMessage()}</h3>
              <p className="text-gray-300">
                {language === "ja" ? "獲得スコア" : "Earned Score"}:{" "}
                <span className="text-amber-400 font-bold">{earnedPoints}</span>
              </p>
              <p className="text-gray-300">
                {language === "ja" ? "獲得タロットポイント" : "Earned Tarot Points"}:{" "}
                <span className="text-amber-400 font-bold">{earnedTarotPoints} TP</span>
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700">
              <h3 className="text-lg font-bold text-white mb-3">
                {language === "ja" ? "問題の振り返り" : "Question Review"}
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {questions.map((question, index) => {
                  const result = questionResults[index]
                  return (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border",
                        result
                          ? result.isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-red-500 bg-red-500/10"
                          : "border-gray-700 bg-gray-800/60",
                      )}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-white">
                          {index + 1}.{" "}
                          {typeof question.question === "string"
                            ? question.question
                            : question.question[language] || question.question.ja || question.question}
                        </p>
                        {result && (
                          <span className={`text-xs font-bold ${result.isCorrect ? "text-green-400" : "text-red-400"}`}>
                            {result.points > 0 ? `+${result.points}` : "0"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {language === "ja" ? "正解" : "Correct Answer"}: {(() => {
                          const currentQuestion = questions[index]
                          let optionsToDisplay: string[] = []

                          if (
                            typeof currentQuestion.options === "object" &&
                            currentQuestion.options.ja &&
                            currentQuestion.options.en
                          ) {
                            optionsToDisplay = currentQuestion.options[language] || currentQuestion.options.ja || []
                          } else if (Array.isArray(currentQuestion.options)) {
                            optionsToDisplay = currentQuestion.options
                          }

                          return optionsToDisplay[currentQuestion.correctAnswer] || "不明"
                        })()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button
              className="bg-purple-700 hover:bg-purple-600 transition-all duration-300"
              onClick={() => {
                if (activeTab === "quick") {
                  initializeQuickQuiz()
                } else {
                  initializeCustomQuiz()
                }
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {language === "ja" ? "もう一度挑戦" : "Try Again"}
            </Button>
            <Link href="/quiz">
              <Button variant="outline" className="border-purple-700 text-purple-300 hover:bg-purple-900/50">
                <Home className="mr-2 h-4 w-4" />
                {language === "ja" ? "選択画面に戻る" : "Back to Selection"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      {mounted && showVictory && (
        <VictoryCelebration
          open={showVictory}
          onClose={handleVictoryClose}
          score={earnedPoints}
          gameMode="timeAttack"
          onSaveScore={handleSaveScore}
          tarotPoints={earnedTarotPoints}
        />
      )}

      <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-amber-400 mb-2">
          {language === "ja" ? "タロットクイズについて" : "About Tarot Quiz"}
        </h3>
        <p className="text-gray-300 text-sm mb-4">
          {language === "ja"
            ? "タロットクイズでは、タロットカードの意味、象徴、歴史などの知識をテストできます。正解でポイントを獲得し、特別な機能のアンロックに使用できます。"
            : "In the Tarot Quiz, you can test your knowledge of Tarot card meanings, symbols, history, and more. Earn points for correct answers that can be used to unlock special features."}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-bold text-purple-300 mb-2">
              {language === "ja" ? "難易度レベル" : "Difficulty Levels"}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-xs">
              <li className="text-green-400">
                {language === "ja" ? "初級：基本的なタロット知識 (1TP)" : "Basic Tarot knowledge (1TP)"}
              </li>
              <li className="text-yellow-400">
                {language === "ja" ? "中級：より深いタロット理解 (1TP)" : "Deeper Tarot understanding (1TP)"}
              </li>
              <li className="text-red-400">
                {language === "ja" ? "上級：高度なタロット専門知識 (2TP)" : "Advanced Tarot expertise (2TP)"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage
