"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Coins } from "lucide-react"
import Link from "next/link"

interface GameOverDialogProps {
  open: boolean
  onClose: () => void
  onRestart: () => void
  onGoBack?: () => void
  onReturnToMenu?: () => void
  score: number
  gameMode: string
  moves: number
  tarotPoints?: number
  showMenuOption?: boolean
}

export default function GameOverDialog({
  open,
  onClose,
  onRestart,
  onReturnToMenu,
  score,
  gameMode,
  moves,
  tarotPoints = 0,
  showMenuOption = false,
  onGoBack,
}: GameOverDialogProps) {
  // ゲームモードの日本語名を取得
  const getGameModeName = (mode: string) => {
    switch (mode) {
      case "classic":
        return "クラシックモード"
      case "hard":
        return "ハードモード"
      case "time-attack":
        return "タイムアタックモード"
      default:
        return mode
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-purple-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-amber-400">ゲーム終了</DialogTitle>
          <DialogDescription className="text-purple-300">
            {getGameModeName(gameMode)}のゲームが終了しました。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-800/60 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-purple-300">スコア</p>
                <p className="text-2xl font-bold text-amber-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-purple-300">手数</p>
                <p className="text-2xl font-bold text-white">{moves}</p>
              </div>
            </div>

            {tarotPoints > 0 && (
              <div className="mt-4 flex justify-center items-center">
                <div className="bg-amber-900/30 px-4 py-2 rounded-full flex items-center">
                  <Coins className="h-5 w-5 text-amber-400 mr-2" />
                  <span className="text-amber-400 font-bold">+{tarotPoints} TP獲得！</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={onRestart} className="bg-purple-700 hover:bg-purple-600 transition-all duration-300">
              もう一度プレイ
            </Button>
            <Link href="/game" className="w-full">
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={onClose}
              >
                ゲーム選択に戻る
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
