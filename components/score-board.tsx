"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, User } from "lucide-react"
import { getScoreData, formatDate, type ScoreEntry } from "@/utils/score-utils"
import { useLanguage } from "@/contexts/language-context"

export default function ScoreBoard() {
  const [scoreData, setScoreData] = useState(() => getScoreData())
  const [activeTab, setActiveTab] = useState<"classic" | "timeAttack" | "hard">("classic")
  const { t } = useLanguage()

  // クライアントサイドでスコアデータを読み込む
  useEffect(() => {
    setScoreData(getScoreData())
  }, [])

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

  return (
    <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-400 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          {t("scoreboard.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="classic" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="classic">{t("scoreboard.tab.classic")}</TabsTrigger>
            <TabsTrigger value="timeAttack">{t("scoreboard.tab.timeAttack")}</TabsTrigger>
            <TabsTrigger value="hard">{t("scoreboard.tab.hard")}</TabsTrigger>
          </TabsList>

          {(["classic", "timeAttack", "hard"] as const).map((mode) => (
            <TabsContent key={mode} value={mode} className="space-y-2">
              <h3 className="text-sm font-medium text-purple-300">{t(`scoreboard.mode.${mode}.title`)}</h3>
              {scoreData[mode].length > 0 ? (
                <div className="space-y-1">
                  {scoreData[mode].map((entry: ScoreEntry, index: number) => (
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
                        {entry.moves !== undefined && (
                          <div className="text-xs text-gray-400">
                            {entry.moves}
                            {t("scoreboard.moves")}
                          </div>
                        )}
                        {entry.tarotPoints !== undefined && entry.tarotPoints > 0 && (
                          <div className="text-xs text-amber-300">+{entry.tarotPoints}TP</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">{t("scoreboard.no.scores")}</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
