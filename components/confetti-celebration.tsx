"use client"

import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface ConfettiCelebrationProps {
  isActive: boolean
  duration?: number
  onComplete?: () => void
}

export default function ConfettiCelebration({ isActive, duration = 3000, onComplete }: ConfettiCelebrationProps) {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const confettiInstanceRef = useRef<confetti.CreateTypes | null>(null)

  useEffect(() => {
    if (isActive && confettiCanvasRef.current) {
      // canvas-confettiのインスタンスを作成
      confettiInstanceRef.current = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true,
      })

      // 紙吹雪の設定
      const end = Date.now() + duration
      const colors = ["#9333ea", "#f59e0b", "#4f46e5", "#7c3aed", "#ec4899", "#10b981"]

      const runConfetti = () => {
        if (confettiInstanceRef.current) {
          // 左側から発射
          confettiInstanceRef.current({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
          })

          // 右側から発射
          confettiInstanceRef.current({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
          })

          // 中央上部から発射
          confettiInstanceRef.current({
            particleCount: 3,
            angle: 90,
            spread: 45,
            origin: { x: 0.5, y: 0 },
            colors: colors,
          })

          if (Date.now() < end) {
            requestAnimationFrame(runConfetti)
          } else {
            // アニメーション完了時の処理
            setTimeout(() => {
              if (onComplete) onComplete()
            }, 1000)
          }
        }
      }

      runConfetti()
    }

    return () => {
      if (confettiInstanceRef.current) {
        confettiInstanceRef.current.reset()
      }
    }
  }, [isActive, duration, onComplete])

  if (!isActive) return null

  return <canvas ref={confettiCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-[100]" />
}
