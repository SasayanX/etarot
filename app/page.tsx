"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Heart, MessageCircle, Sparkles, Star } from "lucide-react"
import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { LoginBonusModal } from "@/components/login-bonus-modal"
import { useLoginBonus } from "@/hooks/use-login-bonus"
import { useLanguage } from "@/contexts/language-context"
import { trackGrowthEvent } from "@/utils/growth-events"

export default function Home() {
  const { showLoginBonus, claimLoginBonus } = useLoginBonus()
  const { t } = useLanguage()
  const [canShowLoginBonus, setCanShowLoginBonus] = useState(false)

  useEffect(() => {
    setCanShowLoginBonus(localStorage.getItem("hasCompletedFortune") === "true")
    trackGrowthEvent("home_view")
  }, [])

  return (
    <div className="py-8 space-y-8">
      {canShowLoginBonus && showLoginBonus && <LoginBonusModal isOpen={showLoginBonus} onClose={claimLoginBonus} />}
      
      <div className="text-center space-y-3 px-4">
        <p className="text-sm font-semibold tracking-[0.3em] uppercase text-amber-300">Positive Tarot</p>
        <h1 className="text-4xl font-bold text-amber-400">今日の恋、どう動く？</h1>
        <p className="text-lg text-purple-200">
          迷っている気持ちを選ぶだけ。タロットが今のあなたに必要な言葉を届けます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IntentCard
          title="好きな人から返信が来ない"
          description="待つべきか、送るべきか。今日の恋の流れを見ます。"
          href="/fortune?type=decision&intent=reply"
          icon={MessageCircle}
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fortune-cards-DSh1rqf1w5BaG8vMVOjddAtkNvn4Yh.png"
          buttonText="送る/待つを占う"
        />
        <IntentCard
          title="彼の気持ちを知りたい"
          description="過去・現在・未来の3枚で、関係のヒントを受け取ります。"
          href="/fortune?type=love&intent=feelings"
          icon={Heart}
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-dictionary-illustration.jpg-sNlSs4IREALbloxX5pu7RSXeeknuS4.png"
          buttonText="3枚で占う"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <MenuCard
          title="今日の運勢"
          description="朝の1枚で、今日の流れを前向きに整える"
          href="/fortune?type=daily&intent=today"
          icon={Sparkles}
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-quiz-EVe9gqkW3bSOr347ZCkLBxQFYrWQ6n.png"
          buttonText="今日を占う"
        />
        <MenuCard
          title={t("home.dictionary.title")}
          description="カードの意味を知って、結果をもっと深く読む"
          href="/dictionary"
          icon={Star}
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-game-xXetJTyliGrsDIBTNgYE10hFEY5H4H.png"
          buttonText="辞典を見る"
        />
        <MenuCard
          title="タロットを遊んで覚える"
          description="クイズとゲームで、カードの意味が自然に身につく"
          href="/quiz"
          icon={ArrowRight}
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-skins-XwqGFSoGy0gRu0gru7YgtymhGiYwYU.png"
          buttonText="挑戦する"
        />
      </div>
    </div>
  )
}

function IntentCard({
  title,
  description,
  href,
  imagePath,
  icon: Icon,
  buttonText = "開始する",
}: {
  title: string
  description: string
  href: string
  imagePath: string
  icon: React.ElementType
  buttonText?: string
}) {
  const [imgSrc, setImgSrc] = useState(imagePath)

  // エラーハンドリングをuseCallbackを使用して実装
  const handleImageError = useCallback(() => {
    console.error(`画像の読み込みに失敗しました: ${imagePath}`)
    // より安全なプレースホルダー画像を使用
    setImgSrc(`/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title)}`)
  }, [imagePath, title])

  return (
    <Card className="overflow-hidden border-amber-500/60 bg-gray-900/70 backdrop-blur-sm">
      <div className="h-48 overflow-hidden relative">
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-amber-400 flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-purple-300">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button
            className="w-full bg-amber-500 hover:bg-amber-400 text-black"
            onClick={() => trackGrowthEvent("home_intent_click", { title })}
          >
            {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function MenuCard({
  title,
  description,
  href,
  disabled = false,
  badge,
  imagePath,
  icon: Icon,
  buttonText = "見る",
}: {
  title: string
  description: string
  href: string
  disabled?: boolean
  badge?: string
  imagePath?: string
  icon: React.ElementType
  buttonText?: string
}) {
  const [imgSrc, setImgSrc] = useState(imagePath)

  // エラーハンドリングをuseCallbackを使用して実装
  const handleImageError = useCallback(() => {
    if (imagePath) {
      console.error(`画像の読み込みに失敗しました: ${imagePath}`)
      setImgSrc(`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(title)}`)
    }
  }, [imagePath, title])

  return (
    <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm overflow-hidden">
      {imagePath && (
        <div className="h-32 overflow-hidden relative">
          <img
            src={imgSrc || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-amber-400 flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </CardTitle>
          {badge && (
            <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/50">
              {badge}
            </span>
          )}
        </div>
        <CardDescription className="text-purple-300">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        {disabled ? (
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-400 cursor-not-allowed opacity-70"
            disabled
          >
            準備中 <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Link href={href} className="w-full">
            <Button
              variant="outline"
              className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/50"
              onClick={() => trackGrowthEvent("home_secondary_click", { title })}
            >
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
