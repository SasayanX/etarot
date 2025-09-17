"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ScoreBoard from "@/components/score-board"
import { useShop } from "@/contexts/shop-context"
import { Coins } from "lucide-react"
import { useEffect, useState } from "react"
import { showAd } from "@/utils/ad-utils"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"

export default function GamePage() {
  const { points } = useShop()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    console.log("Game page - Current points:", points)
  }, [points])

  if (!mounted) {
    return null
  }

  const navigateToGameMode = (mode: string) => {
    console.log(`ゲームモード ${mode} に遷移します`)
    console.log(`遷移先: /game/${mode}`)

    // 広告表示を試みるが、エラーが発生しても遷移を続行
    try {
      showAd(`game_${mode}`)
    } catch (error) {
      console.error("広告表示エラー:", error)
    }

    // 直接遷移
    try {
      router.push(`/game/${mode}`)
      console.log(`router.push実行完了: /game/${mode}`)
    } catch (error) {
      console.error("ナビゲーションエラー:", error)
    }
  }

  return (
    <div className="py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-400">{t("game.title")}</h1>
        <p className="text-xl text-purple-300">{t("game.subtitle")}</p>

        <div className="flex justify-center items-center mt-2">
          <div className="bg-amber-900/30 px-4 py-2 rounded-full flex items-center">
            <Coins className="h-5 w-5 text-amber-400 mr-2" />
            <span className="text-amber-400 font-bold">{points !== undefined ? points : 0} TP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GameModeCard
          title={t("game.mode.classic.title")}
          description={t("game.mode.classic.description")}
          mode="classic"
          onSelect={navigateToGameMode}
          difficulty={t("game.difficulty.beginner")}
        />

        <GameModeCard
          title={t("game.mode.timeAttack.title")}
          description={t("game.mode.timeAttack.description")}
          mode="time-attack"
          onSelect={navigateToGameMode}
          difficulty={t("game.difficulty.intermediate")}
        />

        <GameModeCard
          title={t("game.mode.hard.title")}
          description={t("game.mode.hard.description")}
          mode="hard"
          onSelect={navigateToGameMode}
          difficulty={t("game.difficulty.advanced")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-purple-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{t("game.rules.title")}</h2>
          <ul className="list-disc list-inside space-y-2 text-purple-200">
            <li>{t("game.rules.grid")}</li>
            <li>{t("game.rules.pairs")}</li>
            <li>{t("game.rules.tap")}</li>
            <li>{t("game.rules.points")}</li>
            <li>{t("game.rules.unlock")}</li>
          </ul>
        </div>

        <ScoreBoard />
      </div>
    </div>
  )
}

function GameModeCard({
  title,
  description,
  mode,
  onSelect,
  difficulty,
}: {
  title: string
  description: string
  mode: string
  onSelect: (mode: string) => void
  difficulty: string
}) {
  const { t } = useLanguage()

  const handleClick = () => {
    console.log(`GameModeCard clicked: ${mode}`)
    onSelect(mode)
  }

  return (
    <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-amber-400">{title}</CardTitle>
          <span
            className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              difficulty === t("game.difficulty.beginner")
                ? "bg-green-900/60 text-green-300"
                : difficulty === t("game.difficulty.intermediate")
                  ? "bg-yellow-900/60 text-yellow-300"
                  : "bg-red-900/60 text-red-300",
            )}
          >
            {difficulty}
          </span>
        </div>
        <CardDescription className="text-purple-300">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full bg-purple-700 hover:bg-purple-600" onClick={handleClick}>
          {t("game.play")}
        </Button>
      </CardFooter>
    </Card>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
