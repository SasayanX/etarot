"use client"
import { useState, useRef } from "react"
import { useEffect } from "react"

import { useShop } from "@/contexts/shop-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Gift, Sparkles } from "lucide-react"
import confetti from "canvas-confetti"

interface LoginBonusModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginBonusModal({ isOpen, onClose }: LoginBonusModalProps) {
  const { addPoints } = useShop()
  const [showConfetti, setShowConfetti] = useState(false)
  const [collected, setCollected] = useState(false)
  const BONUS_AMOUNT = 10 // 5から10に変更

  // アニメーション用の状態
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)

  // エラー状態の追加
  const [hasError, setHasError] = useState(false)

  // confetti用のcanvas参照
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // WebView検出関数
  const isWebView = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return false

    const ua = navigator.userAgent.toLowerCase()
    return (
      ua.indexOf("wv") > -1 ||
      ua.indexOf("webview") > -1 ||
      /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua) ||
      ua.includes("tarotapp") ||
      typeof window.ReactNativeWebView !== "undefined"
    )
  }

  // WebView対応の豪華なconfetti実装
  const safeRunConfetti = () => {
    try {
      if (isWebView()) {
        // WebView環境では独自の豪華なconfettiエフェクトを使用
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext("2d")
          if (!ctx) return

          // キャンバスサイズを設定
          canvas.width = window.innerWidth
          canvas.height = window.innerHeight

          // 豪華な色のパレット
          const colors = [
            "#FFD700", // ゴールド
            "#FFA500", // オレンジ
            "#9370DB", // ミディアムパープル
            "#8A2BE2", // ブルーバイオレット
            "#FF1493", // ディープピンク
            "#00BFFF", // ディープスカイブルー
            "#32CD32", // ライムグリーン
            "#FF4500", // オレンジレッド
            "#1E90FF", // ドジャーブルー
            "#FF00FF", // マゼンタ
          ]

          // パーティクルの形状
          const shapes = ["circle", "square", "triangle", "star", "heart"]

          // パーティクルクラス
          class Particle {
            x: number
            y: number
            size: number
            color: string
            speedY: number
            speedX: number
            rotation: number
            rotationSpeed: number
            shape: string
            opacity: number
            gravity: number
            friction: number
            wobble: number
            wobbleSpeed: number
            wobbleAngle: number

            constructor() {
              this.x = Math.random() * canvas.width
              this.y = Math.random() * canvas.height * 0.3 - canvas.height * 0.3 // 画面上部から出現
              this.size = Math.random() * 10 + 5 // より大きなサイズ
              this.color = colors[Math.floor(Math.random() * colors.length)]
              this.speedY = Math.random() * 3 + 2 // 落下速度
              this.speedX = Math.random() * 2 - 1 // 横方向の動き
              this.rotation = Math.random() * 360
              this.rotationSpeed = Math.random() * 10 - 5
              this.shape = shapes[Math.floor(Math.random() * shapes.length)]
              this.opacity = 1
              this.gravity = 0.1 + Math.random() * 0.1 // 重力効果
              this.friction = 0.98 // 摩擦
              this.wobble = Math.random() * 5 // 揺れの大きさ
              this.wobbleSpeed = Math.random() * 0.1 // 揺れの速度
              this.wobbleAngle = 0
            }

            update() {
              // 重力と摩擦の適用
              this.speedY += this.gravity
              this.speedX *= this.friction

              // 揺れの効果
              this.wobbleAngle += this.wobbleSpeed
              this.x += this.speedX + Math.sin(this.wobbleAngle) * this.wobble
              this.y += this.speedY

              // 回転
              this.rotation += this.rotationSpeed

              // 画面下部に到達したら徐々に透明に
              if (this.y > canvas.height * 0.8) {
                this.opacity -= 0.02
              }
            }

            draw(ctx: CanvasRenderingContext2D) {
              ctx.save()
              ctx.globalAlpha = this.opacity
              ctx.translate(this.x, this.y)
              ctx.rotate((this.rotation * Math.PI) / 180)
              ctx.fillStyle = this.color

              // 形状に応じた描画
              switch (this.shape) {
                case "circle":
                  ctx.beginPath()
                  ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
                  ctx.fill()
                  break

                case "square":
                  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
                  break

                case "triangle":
                  ctx.beginPath()
                  ctx.moveTo(0, -this.size / 2)
                  ctx.lineTo(this.size / 2, this.size / 2)
                  ctx.lineTo(-this.size / 2, this.size / 2)
                  ctx.closePath()
                  ctx.fill()
                  break

                case "star":
                  this.drawStar(ctx, 0, 0, 5, this.size / 2, this.size / 4)
                  break

                case "heart":
                  this.drawHeart(ctx, 0, 0, this.size / 2)
                  break

                default:
                  ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
              }

              ctx.restore()
            }

            // 星を描画
            drawStar(
              ctx: CanvasRenderingContext2D,
              cx: number,
              cy: number,
              spikes: number,
              outerRadius: number,
              innerRadius: number,
            ) {
              let rot = (Math.PI / 2) * 3
              let x = cx
              let y = cy
              const step = Math.PI / spikes

              ctx.beginPath()
              ctx.moveTo(cx, cy - outerRadius)

              for (let i = 0; i < spikes; i++) {
                x = cx + Math.cos(rot) * outerRadius
                y = cy + Math.sin(rot) * outerRadius
                ctx.lineTo(x, y)
                rot += step

                x = cx + Math.cos(rot) * innerRadius
                y = cy + Math.sin(rot) * innerRadius
                ctx.lineTo(x, y)
                rot += step
              }

              ctx.lineTo(cx, cy - outerRadius)
              ctx.closePath()
              ctx.fill()
            }

            // ハートを描画
            drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
              ctx.beginPath()
              ctx.moveTo(x, y + size / 4)

              // 左側の曲線
              ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size, y, x, y + size)

              // 右側の曲線
              ctx.bezierCurveTo(x + size, y, x + size / 2, y - size / 2, x, y + size / 4)

              ctx.fill()
            }
          }

          // パーティクル配列
          const particles: Particle[] = []

          // 複数のパーティクルバッチを時間差で生成
          const createParticleBatch = (count: number) => {
            for (let i = 0; i < count; i++) {
              particles.push(new Particle())
            }
          }

          // 初期バッチを生成
          createParticleBatch(150)

          // 時間差で追加のバッチを生成
          setTimeout(() => createParticleBatch(100), 300)
          setTimeout(() => createParticleBatch(100), 600)
          setTimeout(() => createParticleBatch(50), 900)

          // アニメーション
          let animationFrame: number
          const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // 全てのパーティクルを更新・描画
            for (let i = particles.length - 1; i >= 0; i--) {
              particles[i].update()
              particles[i].draw(ctx)

              // 透明になったパーティクルを削除
              if (particles[i].opacity <= 0) {
                particles.splice(i, 1)
              }
            }

            // パーティクルが残っていれば続行
            if (particles.length > 0) {
              animationFrame = requestAnimationFrame(animate)
            } else {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
            }
          }

          animate()

          // クリーンアップ
          return () => cancelAnimationFrame(animationFrame)
        }
      } else {
        // 通常のブラウザ環境では標準のconfettiを使用（こちらも豪華に）
        const duration = 3000
        const end = Date.now() + duration
        const colors = ["#FFD700", "#FFA500", "#9370DB", "#8A2BE2", "#FF1493", "#00BFFF", "#32CD32"]

        const frame = () => {
          // 左側から発射
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0.05, y: 0.5 },
            colors: colors,
            shapes: ["circle", "square"],
            scalar: 1.2,
          })

          // 右側から発射
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 0.95, y: 0.5 },
            colors: colors,
            shapes: ["circle", "square"],
            scalar: 1.2,
          })

          // 上部から発射
          confetti({
            particleCount: 3,
            angle: 90,
            spread: 100,
            origin: { x: 0.5, y: 0 },
            colors: colors,
            shapes: ["star", "circle"],
            scalar: 1.5,
          })

          if (Date.now() < end) {
            requestAnimationFrame(frame)
          }
        }

        frame()
      }
    } catch (error) {
      console.error("Confetti effect failed:", error)
      setHasError(true)
    }
  }

  useEffect(() => {
    if (isOpen && showConfetti) {
      safeRunConfetti()
    }
  }, [isOpen, showConfetti])

  // ボーナス受け取り処理
  const collectBonus = () => {
    try {
      // アニメーション開始
      setScale(1.2)
      setRotate(10)
      setTimeout(() => setScale(1), 300)
      setTimeout(() => setRotate(0), 300)

      // TPを追加
      if (typeof addPoints === "function") {
        addPoints(BONUS_AMOUNT)
      } else {
        console.error("addPoints is not a function", addPoints)
        throw new Error("addPoints is not a function")
      }

      // confetti効果を表示
      setShowConfetti(true)
      setCollected(true)

      // 少し待ってから閉じる
      setTimeout(() => {
        onClose()
        // 状態をリセット
        setTimeout(() => {
          setShowConfetti(false)
          setCollected(false)
          setHasError(false)
        }, 500)
      }, 3000) // 紙吹雪を長く表示するために時間を延長
    } catch (error) {
      console.error("Error collecting bonus:", error)
      setHasError(true)
      // エラーが発生しても閉じられるようにする
      setTimeout(() => {
        onClose()
        setHasError(false)
      }, 1000)
    }
  }

  // エラー発生時のフォールバック表示
  if (hasError) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-gradient-to-b from-purple-900 to-gray-900 border-amber-500 max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-amber-400">
              デイリーログインボーナス
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-white mb-4">ログインボーナスとして10TPを獲得しました！</p>
            <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-500">
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-md mx-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>デイリーログインボーナス</DialogTitle>
        </DialogHeader>

        <div className="rounded-[32px] border border-amber-400/30 bg-gradient-to-b from-[#1a0f25] to-[#0b0812] shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="relative h-80 w-full">
            <img
              src="/Lydia_login.png"
              alt="リディアのログインボーナス"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=400&width=600&text=Lydia"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 space-y-3 text-white">
              <div className="flex items-center gap-2 text-xs tracking-[0.35em] uppercase text-amber-200">
                <Gift className="h-4 w-4 text-amber-300" />
                Daily Login Bonus
              </div>

              <motion.div
                animate={{ scale, rotate }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="flex items-end gap-2"
              >
                <p className="text-4xl font-black text-amber-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">+{BONUS_AMOUNT}</p>
                <p className="pb-2 text-lg font-semibold text-amber-100">TP</p>

                {showConfetti && <Sparkles className="h-6 w-6 text-amber-200" />}
              </motion.div>

              <p className="text-sm text-purple-100 leading-relaxed">
                リディアからの贈り物です。毎日ログインして、特別なカードバックを解放していきましょう。
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5 text-white">
            <div className="rounded-2xl bg-black/30 border border-white/10 p-4 text-sm text-purple-100 leading-relaxed">
              次のログインボーナスまで、
              <span className="text-amber-300 font-semibold"> 24時間 </span>
              あります。連続ログインで限定デザインを手に入れましょう。
            </div>

            <Button
              onClick={collectBonus}
              disabled={collected}
              className={`w-full text-lg font-semibold shadow-lg ${
                collected
                  ? "bg-emerald-600 hover:bg-emerald-600 cursor-not-allowed"
                  : "bg-amber-400/90 hover:bg-amber-300 text-black"
              }`}
            >
              {collected ? "受け取り済み" : "ボーナスを受け取る"}
            </Button>
          </div>
        </div>
      </DialogContent>

      {isWebView() && (
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        />
      )}
    </Dialog>
  )
}
