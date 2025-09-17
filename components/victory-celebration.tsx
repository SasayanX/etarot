"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Star, Sparkles, Coins } from "lucide-react"

interface VictoryCelebrationProps {
  open?: boolean
  show?: boolean
  onClose?: () => void
  score?: number
  gameMode?: string
  onSaveScore?: (playerName: string) => void
  tarotPoints?: number
}

// 紙吹雪パーティクルのインターフェース
interface ConfettiParticle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

export default function VictoryCelebration({
  open,
  onClose,
  score,
  gameMode,
  onSaveScore,
  tarotPoints = 0,
  show,
}: VictoryCelebrationProps) {
  const [playerName, setPlayerName] = useState("")
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])
  const [showConfetti, setShowConfetti] = useState(false)

  // 紙吹雪の色配列
  const confettiColors = [
    "#FFD700", // ゴールド
    "#FF6B6B", // レッド
    "#4ECDC4", // ティール
    "#45B7D1", // ブルー
    "#96CEB4", // グリーン
    "#FFEAA7", // イエロー
    "#DDA0DD", // プラム
    "#98D8C8", // ミント
  ]

  // 紙吹雪パーティクルを生成
  const createConfettiParticle = (id: number): ConfettiParticle => {
    return {
      id,
      x: Math.random() * window.innerWidth,
      y: -Math.random() * 100 - 10, // より高い位置から開始
      vx: (Math.random() - 0.5) * 8, // より大きな横方向の速度
      vy: Math.random() * 5 + 3, // より大きな縦方向の速度
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      size: Math.random() * 12 + 6, // より大きなサイズ（4-16px → 6-18px）
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15, // より速い回転
    }
  }

  // 紙吹雪アニメーションを開始
  const startConfetti = () => {
    setShowConfetti(true)
    const particles: ConfettiParticle[] = []

    // 初期パーティクルを生成（50個 → 150個に変更）
    for (let i = 0; i < 150; i++) {
      particles.push(createConfettiParticle(i))
    }

    setConfetti(particles)

    // アニメーションループ
    const animateConfetti = () => {
      setConfetti((prevConfetti) => {
        return prevConfetti
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            rotation: particle.rotation + particle.rotationSpeed,
            vy: particle.vy + 0.1, // 重力効果
          }))
          .filter((particle) => particle.y < window.innerHeight + 50) // 画面外のパーティクルを削除
      })
    }

    const intervalId = setInterval(animateConfetti, 16) // 60fps

    // 継続的にパーティクルを追加
    let particleId = 150
    const addMoreParticles = setInterval(() => {
      setConfetti((prev) => {
        const newParticles = []
        for (let i = 0; i < 20; i++) {
          newParticles.push(createConfettiParticle(particleId++))
        }
        return [...prev, ...newParticles]
      })
    }, 200) // 200msごとに20個追加

    // 5秒後に紙吹雪を停止（3秒 → 5秒に変更）
    setTimeout(() => {
      clearInterval(intervalId)
      clearInterval(addMoreParticles)
      setTimeout(() => {
        setShowConfetti(false)
        setConfetti([])
      }, 3000) // パーティクルが落ちきるまで待つ時間も延長
    }, 5000)
  }

  // ダイアログが開かれたときに紙吹雪を開始
  useEffect(() => {
    if (open || show) {
      setTimeout(startConfetti, 300) // 少し遅延させて開始
    }
  }, [open, show])

  const handleSave = () => {
    if (playerName.trim() && onSaveScore) {
      onSaveScore(playerName.trim())
    }
    if (onClose) onClose()
  }

  const getGameModeTitle = () => {
    if (!gameMode) return "ゲーム"
    switch (gameMode) {
      case "classic":
        return "クラシックモード"
      case "timeAttack":
        return "タロットクイズ"
      case "hard":
        return "ハードモード"
      default:
        return "ゲーム"
    }
  }

  return (
    <>
      {/* 紙吹雪エフェクト */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[60]">
          {confetti.map((particle) => (
            <div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                transform: `rotate(${particle.rotation}deg)`,
                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={open || false} onOpenChange={onClose || (() => {})}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-amber-500/50 backdrop-blur-sm">
          <DialogHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Trophy className="h-16 w-16 text-amber-400 animate-bounce" />
                <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
                <Star className="h-4 w-4 text-amber-300 absolute -bottom-1 -left-1 animate-ping" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-amber-400">🎉 おめでとうございます！ 🎉</DialogTitle>
            <div className="space-y-2">
              <p className="text-lg text-purple-200">{getGameModeTitle()}完了！</p>
              <div className="bg-amber-500/20 rounded-lg p-4 border border-amber-500/50">
                <p className="text-3xl font-bold text-amber-400">{score ? score.toLocaleString() : "0"}</p>
                <p className="text-sm text-amber-300">ポイント獲得</p>
                {tarotPoints > 0 && (
                  <div className="flex items-center justify-center mt-2">
                    <Coins className="h-4 w-4 text-amber-400 mr-1" />
                    <span className="text-amber-400 font-bold">+{tarotPoints} TP</span>
                  </div>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div>
              <Label htmlFor="playerName" className="text-purple-200">
                プレイヤー名を入力してスコアを保存
              </Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="あなたの名前"
                className="mt-1 bg-purple-900/50 border-purple-700 text-white placeholder-purple-300"
                maxLength={20}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={!playerName.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                スコアを保存
              </Button>
              <Button
                onClick={onClose || (() => {})}
                variant="outline"
                className="flex-1 border-purple-700 text-purple-300 hover:bg-purple-900/50"
              >
                スキップ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
