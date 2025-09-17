/**
 * カードシャッフルコンポーネント
 * カードのシャッフルアニメーションを表示
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

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

interface CardShufflerProps {
  isShuffling: boolean
  shuffleCards: ShuffleCard[]
  onShuffleComplete: () => void
  cardBackImage: string
}

export default function CardShuffler({
  isShuffling,
  shuffleCards,
  onShuffleComplete,
  cardBackImage
}: CardShufflerProps) {
  const [animationPhase, setAnimationPhase] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isShuffling) return

    const phases = [
      { duration: 500, phase: 1 }, // シャッフル開始
      { duration: 2000, phase: 2 }, // シャッフル中
      { duration: 500, phase: 3 }, // シャッフル終了
    ]

    let currentPhase = 0
    const runPhases = () => {
      if (currentPhase < phases.length) {
        setAnimationPhase(phases[currentPhase].phase)
        setTimeout(() => {
          currentPhase++
          runPhases()
        }, phases[currentPhase].duration)
      } else {
        onShuffleComplete()
      }
    }

    runPhases()
  }, [isShuffling, onShuffleComplete])

  if (!isShuffling) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-2">
            カードをシャッフル中...
          </h2>
          <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{
                width: `${((animationPhase - 1) / 3) * 100}%`
              }}
            />
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-80 h-60 mx-auto"
          style={{ perspective: "1000px" }}
        >
          {shuffleCards.map((card, index) => (
            <div
              key={`shuffle-${card.id}-${index}`}
              className="absolute w-16 h-24 transition-all duration-500 ease-out"
              style={{
                left: `${card.offsetX}px`,
                top: `${card.offsetY}px`,
                transform: `rotate(${card.rotation}deg) scale(${card.scale})`,
                zIndex: card.zIndex,
                animationDelay: `${card.delay}ms`,
                animation: isShuffling ? `shuffle-${card.animationType} 2s ease-in-out infinite` : 'none'
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg border-2 border-amber-400 flex items-center justify-center">
                <img
                  src={cardBackImage}
                  alt="カード"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  animationPhase >= dot
                    ? "bg-purple-500 scale-125"
                    : "bg-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shuffle-1 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.05); }
        }
        
        @keyframes shuffle-2 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          33% { transform: rotate(120deg) scale(1.2); }
          66% { transform: rotate(240deg) scale(0.8); }
        }
        
        @keyframes shuffle-3 {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.3); }
        }
      `}</style>
    </div>
  )
}
