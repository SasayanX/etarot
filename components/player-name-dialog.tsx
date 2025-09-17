"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy } from "lucide-react"

interface PlayerNameDialogProps {
  open: boolean
  onClose: (playerName?: string) => void
  score: number
  mode: "classic" | "timeAttack" | "hard"
  moves?: number
  timeLeft?: number
  roundCount?: number
  isHighScore?: boolean
}

export default function PlayerNameDialog({
  open,
  onClose,
  score,
  mode,
  moves,
  timeLeft,
  roundCount,
  isHighScore = false,
}: PlayerNameDialogProps) {
  const [playerName, setPlayerName] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onClose(playerName.trim() || "プレイヤー")
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isHighScore ? "ハイスコア達成！" : "スコアを記録"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="py-4">
            {isHighScore && (
              <div className="flex flex-col items-center mb-4">
                <Trophy className="h-16 w-16 text-yellow-400 animate-pulse" />
                <p className="text-center text-lg font-bold text-yellow-400 mt-2">新記録おめでとう！</p>
              </div>
            )}
            <p className="text-center text-lg mb-2">
              {isHighScore ? "あなたの名前を残しましょう！" : "プレイヤー名を入力してください"}
            </p>
            <p className="text-center text-xl font-bold">スコア: {score}</p>
            {moves !== undefined && <p className="text-center">手数: {moves}</p>}
            {timeLeft !== undefined && <p className="text-center">残り時間: {timeLeft}秒</p>}
            {roundCount !== undefined && <p className="text-center">クリアしたラウンド: {roundCount - 1}</p>}
            <p className="text-center text-sm mt-2">
              {mode === "classic" && "クラシックモード"}
              {mode === "timeAttack" && "タイムアタックモード"}
              {mode === "hard" && "ハードモード"}
            </p>
            <div className="mt-4">
              <Input
                type="text"
                placeholder="プレイヤー名"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full"
                maxLength={20}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              記録する
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              キャンセル
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
