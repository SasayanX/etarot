"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { useLanguage } from "@/contexts/language-context"
import CardDetailView from "@/components/card-detail-view"
import { showAd } from "@/utils/ad-utils"

// タロットカードの定義（大アルカナ）
const majorArcana = [
  {
    id: 0,
    nameKey: "card.fool",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-the-fool.jpg-qMIhIdJbLFFDcbG6DCuVeJpdMxYYFF.jpeg",
    number: "0",
  },
  {
    id: 1,
    nameKey: "card.magician",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-the-magician.jpg-PKdG2cPVPYUaSTJyAQy3aKvkCrCLwL.jpeg",
    number: "I",
  },
  {
    id: 2,
    nameKey: "card.high_priestess",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-the-high-priestess.jpg-YraHWJEM3BVr9nUX0DEQVnz75AO4Ju.jpeg",
    number: "II",
  },
  {
    id: 3,
    nameKey: "card.empress",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-the-empress.jpg-WtFbAgyVTI4gO8RzJkIgq8Clot9a2Z.jpeg",
    number: "III",
  },
  {
    id: 4,
    nameKey: "card.emperor",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-the-emperor.jpg-QvRCOUbuXLX8J3uLPT3TzAsVAxNL81.jpeg",
    number: "IV",
  },
  {
    id: 5,
    nameKey: "card.hierophant",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-the-hierophant.jpg-XX882Wenrj2uZI6O2YRhpUDS53puP7.jpeg",
    number: "V",
  },
  {
    id: 6,
    nameKey: "card.lovers",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-the-lovers.jpg-r5sFSHZJlffXRhawcvLeC1gtUe6wlG.jpeg",
    number: "VI",
  },
  {
    id: 7,
    nameKey: "card.chariot",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-the-chariot.jpg-4ZyGVwUgwF4pJ3io6a4mcguNvVrtKU.jpeg",
    number: "VII",
  },
  {
    id: 8,
    nameKey: "card.strength",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-strength.jpg-uYkF18PIdhJBnW9aPRFqNmLsVzbyVy.jpeg",
    number: "VIII",
  },
  {
    id: 9,
    nameKey: "card.hermit",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-the-hermit.jpg-lSgaW8YCkTfjVeg1PQa1nCA3FBMQFz.jpeg",
    number: "IX",
  },
  {
    id: 10,
    nameKey: "card.wheel_of_fortune",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-wheel-of-fortune.jpg-wgeUsJcjpGaFq7H0ZjIgl1yWyxyKFR.jpeg",
    number: "X",
  },
  {
    id: 11,
    nameKey: "card.justice",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11-justice.jpg-acM0yRB2NWKdMzpXyctcIYb67gccRc.jpeg",
    number: "XI",
  },
  {
    id: 12,
    nameKey: "card.hanged_man",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-the-hanged-man.jpg-I7QImjNEyPcoXcCV2Zr2d35KewHlWq.jpeg",
    number: "XII",
  },
  {
    id: 13,
    nameKey: "card.death",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13-death.jpg-J0PTAiPztA6qzlpGQINoO92MaKphrV.jpeg",
    number: "XIII",
  },
  {
    id: 14,
    nameKey: "card.temperance",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-temperance.jpg-kO6BMsCpNJuJEzAioFgyLOUUQMDGEh.jpeg",
    number: "XIV",
  },
  {
    id: 15,
    nameKey: "card.devil",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-the-devil.jpg-RoornKKvcHXyJLLY4gXM9XlDqPsWDW.jpeg",
    number: "XV",
  },
  {
    id: 16,
    nameKey: "card.tower",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/16-the-tower.jpg-2qD572YP7T5eLZVCzL4yDW3la44yDL.jpeg",
    number: "XVI",
  },
  {
    id: 17,
    nameKey: "card.star",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17-the-star.jpg-btLZ7a8dSYhhbNGSuYn85LICydZ7w3.jpeg",
    number: "XVII",
  },
  {
    id: 18,
    nameKey: "card.moon",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18-the-moon.jpg-8qr3hzWSQiQ3lKTJX8T4D3P7ECWUb1.jpeg",
    number: "XVIII",
  },
  {
    id: 19,
    nameKey: "card.sun",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19-the-sun.jpg-DXpvNqh1OFJzpwh1aD0OBUbQkSpbZQ.jpeg",
    number: "XIX",
  },
  {
    id: 20,
    nameKey: "card.judgement",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20-judgement.jpg-2E1PWIPfjQZXH1qhnpyS6cx18PZUIO.jpeg",
    number: "XX",
  },
  {
    id: 21,
    nameKey: "card.world",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/21-the-world.jpg-wVVLmPfvFrEUueWlS0jn3xFihvnTm1.jpeg",
    number: "XXI",
  },
]

// バックアップ画像のURLを生成
const getBackupImageUrl = (card: { name: string; suit?: string }) => {
  // カードのスートに基づいてクエリを調整
  const suitText = card.suit ? `${card.suit} ` : ""
  return `/placeholder.svg?height=300&width=200&query=rider waite tarot card ${suitText}${encodeURIComponent(card.name)}`
}

// 小アルカナの定義（簡略化）
const minorArcanaSuits = ["wands", "cups", "swords", "pentacles"]
const minorArcanaRanks = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "page", "knight", "queen", "king"]

// 小アルカナのカードを生成
const generateMinorArcana = (t: (key: string) => string) => {
  return minorArcanaSuits.flatMap((suit, suitIndex) =>
    minorArcanaRanks.map((rank, rankIndex) => {
      const id = 22 + suitIndex * 14 + rankIndex

      // 小アルカナの画像URLを設定
      let image = ""

      // スートに基づいて画像URLを設定
      if (suit === "wands") {
        if (rank === "ace")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-wands.jpg-1pPgS5t2dGOqjkS3N4GkIbLgmSSI87.jpeg"
        else if (rank === "2")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-wand.jpg-e1azrTpQTiu35k0oVguk6JaMegRRoA.jpeg"
        else if (rank === "3")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-wand.jpg-uGgEzjxHzYqLgrsGdx2itqLqch0ktv.jpeg"
        else if (rank === "4")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-wand.jpg-CEnCaef04E0RX6y3HL2YWzMiyx09Cl.jpeg"
        else if (rank === "5")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-wand.jpg-3NViw5cuNzuYmrbaes8DH6ubhXtebR.jpeg"
        else if (rank === "6")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-wand.jpg-6rYwxii5fJjY1b6nF61zpsETWq3Q9a.jpeg"
        else if (rank === "7")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-wand.jpg-POyReivh15Dh1fuNwTWVjMOKBIBC8B.jpeg"
        else if (rank === "8")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-wand.jpg-fmFOT86lrSsK7eoe6UAHKA1fZ8AZfC.jpeg"
        else if (rank === "9")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-wand.jpg-lzxgJY822vkf4qEMEaSQAotpxCuY9J.jpeg"
        else if (rank === "10")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-wand.jpg-Gn7coGdI4gOe9YShWorFzHIzgdLAJB.jpeg"
        else if (rank === "page")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-wand.jpg-MlWxZUsmhzZOv8En7rmJ5KzQrFzQhv.jpeg"
        else if (rank === "knight")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-wands.jpg-OkWaa0SGCP5AvO9jTovVeGCQocd5Nr.jpeg"
        else if (rank === "queen")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-wands.jpg-bAjPDuYLlBAKowtcT2BskSkTCR3Xrj.jpeg"
        else if (rank === "king")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-wands.jpg-FaSnZh01XlalPLWM12oSnLAh1WQqJT.jpeg"
      } else if (suit === "cups") {
        if (rank === "ace")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-cups.jpg-VdQlUGDd9GSnJ60boD0YML61KU94Z8.jpeg"
        else if (rank === "2")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-cups.jpg-uhNsNJYS4QrAve5t4Za9nGcOEYd8yW.jpeg"
        else if (rank === "3")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-cups.jpg-oRHYBimxtzuKW8YvHioHORuHor80vR.jpeg"
        else if (rank === "4")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-cups.jpg-7OuDpH6Ixsr67IlGzYvc54ZNmVu5oN.jpeg"
        else if (rank === "5")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-cups.jpg-EqSd43skY62lAQfdNEZqG8LD7qB412.jpeg"
        else if (rank === "6")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-cups.jpg-KEq9KNSBvM7gA0W6tM0YfNv93ygb6V.jpeg"
        else if (rank === "7")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-cups.jpg-vmL5EERQuPJEfiyDcQEoDfwDi5tbXk.jpeg"
        else if (rank === "8")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-cups.jpg-8wIA9ua8sKHHKRN70U9hgy8HlMEXkW.jpeg"
        else if (rank === "9")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-cups.jpg-6Ummn38NN5G3Ko3FXezhwy70ATu542.jpeg"
        else if (rank === "10")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-cups.jpg-HxvR7GmKqtY82qhTCsPIIQk0tkHYvi.jpeg"
        else if (rank === "page")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-cups.jpg-VDfN69Dd51JoRKiacP22I3JFpg41Td.jpeg"
        else if (rank === "knight")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-cups.jpg-XWNThF2JdShb882z4xoe0Ml6Ig512P.jpeg"
        else if (rank === "queen")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-cups.jpg-3H2Jy2bCM3UBmlcVBHZcXjPSZlh2Iq.jpeg"
        else if (rank === "king")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-cups.jpg-8pSIMwNTDwUDYODInULhoVL5dQqi7U.jpeg"
      } else if (suit === "swords") {
        if (rank === "ace")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-swords.jpg-chQNJGHWYsgEdxiSs6lxm0qOHbUZBg.jpeg"
        else if (rank === "2")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-swords.jpg-9Y90GTmtafXm8I2usHFONGwbGwOw3G.jpeg"
        else if (rank === "3")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-swords.jpg-wU8DRZDJEWpCaCQkq1z0qBaOfOrCDN.jpeg"
        else if (rank === "4")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-swords.jpg-rCTihe3IGhTiIGEHNjHDwFmnVsYAXD.jpeg"
        else if (rank === "5")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-swords.jpg-Hh1SF2fvD442nNxA1FH7Jqy3QuU2wO.jpeg"
        else if (rank === "6")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-swords.jpg-sDaZV3jEsZz9WxGShlVQ7WwjbwquvC.jpeg"
        else if (rank === "7")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-swords.jpg-B7vythd4DCsgBFxobBRRg7x67Grg7U.jpeg"
        else if (rank === "8")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-swords.jpg-ZuZ3IGXCOTgDKnrvcAfVeEOUfcgHyJ.jpeg"
        else if (rank === "9")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-swords.jpg-PT4bbyVRPkQNvQznfpfazgmPDHIZpb.jpeg"
        else if (rank === "10")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-swords.jpg-GYnCdRpKiyjA6DDQLa6pB8shYz6Jhp.jpeg"
        else if (rank === "page")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-swords.jpg-lP1mllBk5M4opSWf9HY2Omk2xu9fcJ.jpeg"
        else if (rank === "knight")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-swords.jpg-6TKK2zvwPWwV9O1URXFrSrkN8wqQks.jpeg"
        else if (rank === "queen")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-swords.jpg-noAseTB0yKPSU6Ac0wPUfx1x0PczXT.jpeg"
        else if (rank === "king")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-swords.jpg-OtXJA2MtUgtsSCn62CsZMnCr5b39YQ.jpeg"
      } else if (suit === "pentacles") {
        if (rank === "ace")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-pentacles.jpg-sOIxEMVL7AYzJHFBVZHadwkQNQ5INU.jpeg"
        else if (rank === "2")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-pentacles.jpg-CYF4Kk57XozbdpMtcEzNqjFKULQEan.jpeg"
        else if (rank === "3")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-pentacles.jpg-4edW40u19prYAlWLlXTpqLWhtnERrd.jpeg"
        else if (rank === "4")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-pentacles.jpg-xc3cZEQ5a9W9wpjfR5jx4e9UAGxzoR.jpeg"
        else if (rank === "5")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-pentacles.jpg-FHrMohEpyQspTW9SiBtZdhjFRWTzZ2.jpeg"
        else if (rank === "6")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-pentacles.jpg-k1ZccRug9vFuXX8NGzPeNfLnlHhS9N.jpeg"
        else if (rank === "7")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-pentacles.jpg-Q56TZYMSPr7RkPwfPV3Ax27Kb6BHQe.jpeg"
        else if (rank === "8")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-pentacles.jpg-gHhaF7l39UimbmTZDDwHkU75xkI8Je.jpeg"
        else if (rank === "9")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-pentacles.jpg-UZC0QT8V3Ai6DChLf6awGUwbOgi8Yt.jpeg"
        else if (rank === "10")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-pentcles.jpg-pyvomqOb4EbMBVsC7f8PFMmFGLzYm0.jpeg"
        else if (rank === "page")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-pentacles.jpg-8Y1jttau2zYwoYEXhOK8keTemNUVT2.jpeg"
        else if (rank === "knight")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-pentacles.jpg-0rJ5zpcRimJrcoOxAvhptXxxJDq8fM.jpeg"
        else if (rank === "queen")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-pentacles.jpg-GyZ3HM2SZGZH7xreBIgDBXZzkNVA72.jpeg"
        else if (rank === "king")
          image =
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-pentacles.jpg-ieyyz6EdkWCQ9LbJ9aqU8ARyc627QB.jpeg"
      }

      // カード名を生成 - 翻訳を正しく適用
      let name = ""
      const translatedSuit = t(`suit.${suit}`)
      const connector = t("card.connector")

      if (rank === "ace") {
        name = `${t("rank.ace")}${connector}${translatedSuit}`
      } else if (["page", "knight", "queen", "king"].includes(rank)) {
        name = `${t(`rank.${rank}`)}${connector}${translatedSuit}`
      } else {
        name = `${rank}${connector}${translatedSuit}`
      }

      return {
        id,
        name,
        image,
        suit: translatedSuit,
        rank,
      }
    }),
  )
}

// カードアイテムコンポーネント
function CardItem({ card, onClick }: { card: any; onClick: () => void }) {
  const [_imageError, setImageError] = useState(false)
  const [fallbackAttempted, setFallbackAttempted] = useState(false)
  const [imageSrc, setImageSrc] = useState(card.image)

  // 最終的なフォールバック画像URL
  const finalFallbackUrl = `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(card.name)}`

  // 画像読み込みエラー時の処理
  const handleImageError = () => {
    console.warn(`画像読み込みエラー: ${imageSrc} (${card.name})`)

    if (!fallbackAttempted) {
      // 最初のフォールバック: バックアップ画像を試す
      const backupUrl = getBackupImageUrl(card)
      console.log(`バックアップ画像を試行: ${backupUrl}`)
      setImageSrc(backupUrl)
      setImageError(true)
      setFallbackAttempted(true)
    } else {
      // 最終フォールバック: プレースホルダー画像
      console.log(`最終フォールバック使用: ${finalFallbackUrl}`)
      setImageSrc(finalFallbackUrl)
    }
  }

  return (
    <div
      className="bg-gray-900 border border-purple-700 rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 hover:border-amber-400 overflow-hidden"
      onClick={onClick}
    >
      <div className="p-2 flex flex-col items-center justify-center">
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md border border-purple-600">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={card.name}
            className="w-full h-full object-contain"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>
        <div className="mt-2 text-center w-full">
          <p className="text-white font-medium">{card.name}</p>
          {card.id < 22 && <p className="text-amber-400 text-sm">{card.number}</p>}
        </div>
      </div>
    </div>
  )
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCard, setSelectedCard] = useState(null)
  const { textToSpeechEnabled } = useSettings()
  const { t } = useLanguage()
  const [_isLoading, _setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("major")

  // 大アルカナのカード名を翻訳
  const translatedMajorArcana = majorArcana.map((card) => ({
    ...card,
    name: t(card.nameKey),
  }))

  // 小アルカナを生成（翻訳対応）
  const minorArcana = generateMinorArcana(t)

  const allCards = [...translatedMajorArcana, ...minorArcana]

  // filteredCardsの定義を以下に変更
  const filteredCards = allCards.filter((card) => {
    const nameMatch = card.name.toLowerCase().includes(searchTerm.toLowerCase())
    let tabMatch = false

    if (activeTab === "major") {
      tabMatch = card.id < 22
    } else if (activeTab === "minor") {
      tabMatch = card.id >= 22
    } else if (activeTab === "wands") {
      tabMatch = card.suit === t("suit.wands")
    } else if (activeTab === "cups") {
      tabMatch = card.suit === t("suit.cups")
    } else if (activeTab === "swords") {
      tabMatch = card.suit === t("suit.swords")
    } else if (activeTab === "pentacles") {
      tabMatch = card.suit === t("suit.pentacles")
    }

    return nameMatch && tabMatch
  })

  // handleCardClick関数を確認し、コンソールログを追加して動作を確認します
  const handleCardClick = (card) => {
    try {
      console.log("カードがクリックされました:", card)
      setSelectedCard(card)
    } catch (error) {
      console.error("カードクリックエラー:", error)
    }
  }

  const handleCloseDetailView = () => {
    try {
      console.log("カード詳細を閉じます")
      setSelectedCard(null)
    } catch (error) {
      console.error("カード詳細を閉じる際のエラー:", error)
      // エラーが発生しても確実に閉じる
      setSelectedCard(null)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gray-900">
      <h1 className="text-3xl font-bold text-center text-amber-400 mb-2">{t("dictionary.title")}</h1>
      <p className="text-center text-gray-300 mb-6">{t("dictionary.subtitle")}</p>

      {/* オリジナルのタブデザイン */}
      <div className="flex mb-6 border-b border-amber-500/30">
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "major" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_major")
            setActiveTab("major")
          }}
        >
          {t("dictionary.tab.major")}
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "minor" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_minor")
            setActiveTab("minor")
          }}
        >
          {t("dictionary.tab.minor")}
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "wands" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_wands")
            setActiveTab("wands")
          }}
        >
          {t("dictionary.tab.wands")}
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "cups" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_cups")
            setActiveTab("cups")
          }}
        >
          {t("dictionary.tab.cups")}
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "swords" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_swords")
            setActiveTab("swords")
          }}
        >
          {t("dictionary.tab.swords")}
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "pentacles" ? "text-amber-400 border-b-2 border-amber-400" : "text-gray-400"
          }`}
          onClick={() => {
            showAd("dictionary_pentacles")
            setActiveTab("pentacles")
          }}
        >
          {t("dictionary.tab.pentacles")}
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-white border border-gray-600 rounded-lg bg-gray-800 focus:ring-amber-500 focus:border-amber-500"
          placeholder={t("dictionary.search.placeholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
      </div>

      {_isLoading ? (
        <div className="text-center text-white">{t("dictionary.loading")}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => (
            <CardItem key={card.id} card={card} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {selectedCard && (
        <CardDetailView card={selectedCard} onClose={handleCloseDetailView} textToSpeechEnabled={textToSpeechEnabled} />
      )}
    </div>
  )
}
