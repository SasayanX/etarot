"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState, useCallback } from "react"
import { LoginBonusModal } from "@/components/login-bonus-modal"
import { useLoginBonus } from "@/hooks/use-login-bonus"
import { ReviewPromptDialog } from "@/components/review-prompt-dialog"
import { useReviewPrompt } from "@/hooks/use-review-prompt"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { showLoginBonus, claimLoginBonus } = useLoginBonus()
  const { showReviewPrompt, dismissReviewPrompt, markReviewShown } = useReviewPrompt()
  const { t } = useLanguage()

  return (
    <div className="py-8 space-y-8">
      {/* ログインボーナスモーダル - エラーハンドリング追加 */}
      {showLoginBonus && <LoginBonusModal isOpen={showLoginBonus} onClose={claimLoginBonus} />}
      
      {/* レビュー依頼ダイアログ */}
      {showReviewPrompt && (
        <ReviewPromptDialog
          isOpen={showReviewPrompt}
          onReview={markReviewShown}
          onDismiss={dismissReviewPrompt}
          onAlreadyReviewed={markReviewShown}
        />
      )}

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-amber-400">{t("home.title")}</h1>
        <p className="text-xl text-purple-300">{t("home.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FeaturedCard
          title={t("home.fortune.title")}
          description={t("home.fortune.description")}
          href="/fortune"
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fortune-cards-DSh1rqf1w5BaG8vMVOjddAtkNvn4Yh.png"
          buttonText={t("home.fortune.button")}
        />

        <FeaturedCard
          title={t("home.dictionary.title")}
          description={t("home.dictionary.description")}
          href="/dictionary"
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-dictionary-illustration.jpg-sNlSs4IREALbloxX5pu7RSXeeknuS4.png"
          buttonText={t("home.dictionary.button")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <MenuCard
          title={t("home.quiz.title")}
          description={t("home.quiz.description")}
          href="/quiz"
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-quiz-EVe9gqkW3bSOr347ZCkLBxQFYrWQ6n.png"
          buttonText={t("home.quiz.button")}
        />
        <MenuCard
          title={t("home.game.title")}
          description={t("home.game.description")}
          href="/game"
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tarot-game-xXetJTyliGrsDIBTNgYE10hFEY5H4H.png"
          buttonText={t("home.game.button")}
        />
        <MenuCard
          title={t("home.skins.title")}
          description={t("home.skins.description")}
          href="/skins"
          imagePath="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-skins-XwqGFSoGy0gRu0gru7YgtymhGiYwYU.png"
          buttonText={t("home.skins.button")}
        />
      </div>
    </div>
  )
}

function FeaturedCard({
  title,
  description,
  href,
  imagePath,
  buttonText = "開始する",
}: {
  title: string
  description: string
  href: string
  imagePath: string
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
    <Card className="overflow-hidden border-purple-700 bg-gray-900/60 backdrop-blur-sm">
      <div className="h-48 overflow-hidden relative">
        <img
          src={imgSrc || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-amber-400">{title}</CardTitle>
        <CardDescription className="text-purple-300">{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Link href={href} className="w-full">
          <Button className="w-full bg-purple-700 hover:bg-purple-600">
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
  buttonText = "見る",
}: {
  title: string
  description: string
  href: string
  disabled?: boolean
  badge?: string
  imagePath?: string
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
          <CardTitle className="text-amber-400">{title}</CardTitle>
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
            <Button variant="outline" className="w-full border-purple-700 text-purple-300 hover:bg-purple-900/50">
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
