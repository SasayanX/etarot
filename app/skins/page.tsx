"use client"

import { useMemo } from "react"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Lock, Eye, Coins, Trophy, Gift, Check, Sparkles, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import BottomNavigation from "@/components/bottom-navigation"
import { useShop } from "@/contexts/shop-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"

// カードバックの型定義
interface CardBack {
  id: string
  name: string
  description: string
  image: string
  lockedImage?: string
  price?: number // TPでの価格
  adRequired?: boolean // 広告視聴が必要か
  unlockCondition?: string // 解放条件の説明
  isHidden?: boolean // 隠しスーツか
  isUnlocked?: boolean // 解放済みか
  isSelected?: boolean // 選択中か
  category: "basic" | "premium" | "special" | "seasonal" | "limited" // カテゴリ
  isNew?: boolean // 新着アイテムか
}

// カードバックマネージャーをインポート
import { selectCardBack, GOLDEN_DRAGON_URL } from "@/utils/card-back-manager"

// ドラゴンカードバックのプレースホルダー画像URLを更新
const DRAGON_PLACEHOLDER = "/dragon-tarot-back.webp" // 実際の画像パスに変更

// ファイルの先頭に追加
import { useLanguage } from "@/contexts/language-context"

// コンポーネント内で useLanguage を使用
export default function SkinsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const {
    checkCondition,
    getHiddenConditionDescription,
    purchaseSuit: shopPurchaseSuit,
    points: shopPoints,
    ownedSuits,
  } = useShop()
  const [activeTab, setActiveTab] = useState("all")
  const [tarotPoints, setTarotPoints] = useState(0) // 初期ポイントを0に修正
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCardBackName, setNewCardBackName] = useState("")
  const [newCardBackImageUrl, setNewCardBackImageUrl] = useState("")

  // カードバックの配列を動的に翻訳するように変更
  const getCardBacks = useCallback(
    (): CardBack[] => [
      {
        id: "default",
        name: t("cardback.default.name"),
        description: t("cardback.default.description"),
        image: "/default-tarot-card-back.webp",
        isUnlocked: true,
        isSelected: true,
        category: "basic",
      },
      {
        id: "moonlight",
        name: t("cardback.moonlight.name"),
        description: t("cardback.moonlight.description"),
        image: "/moonlight-tarot-card-back.webp",
        price: 5000,
        isUnlocked: false,
        category: "premium",
      },
      {
        id: "golden",
        name: t("cardback.golden.name"),
        description: t("cardback.golden.description"),
        image: "/golden-tarot-back.webp",
        price: 7500,
        isUnlocked: false,
        category: "premium",
      },
      {
        id: "crystal",
        name: t("cardback.crystal.name"),
        description: t("cardback.crystal.description"),
        image: "/crystal-tarot-card-back.webp",
        price: 6500,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
      {
        id: "mystic",
        name: t("cardback.mystic.name"),
        description: t("cardback.mystic.description"),
        image: "/mystic-tarot-back.webp",
        price: 6000,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
      {
        id: "royal",
        name: t("cardback.royal.name"),
        description: t("cardback.royal.description"),
        image: "/royal-tarot-card-back.webp",
        price: 8500,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
      {
        id: "dragon",
        name: t("cardback.dragon.name"),
        description: t("cardback.dragon.description"),
        image: "/dragon-tarot-back.webp",
        price: 9999,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
      {
        id: "lydia-back-30",
        name: t("cardback.lydia30.name"),
        description: t("cardback.lydia30.description"),
        image: "/Lydia30.PNG",
        lockedImage: "/Lydia30_Login_Secret.webp",
        unlockCondition: t("cardback.lydia30.condition"),
        isUnlocked: false,
        category: "special",
      },
      {
        id: "lydia-back-60",
        name: t("cardback.lydia60.name"),
        description: t("cardback.lydia60.description"),
        image: "/Lydia60.PNG",
        lockedImage: "/Lydia60_Login_Secret.webp",
        unlockCondition: t("cardback.lydia60.condition"),
        isUnlocked: false,
        category: "special",
      },
      {
        id: "cosmic",
        name: t("cardback.cosmic.name"),
        description: t("cardback.cosmic.description"),
        image: "/cosmic-tarot-back.webp",
        isHidden: true,
        unlockCondition: t("cardback.cosmic.condition"),
        isUnlocked: false,
        category: "special",
      },
      {
        id: "elemental",
        name: t("cardback.elemental.name"),
        description: t("cardback.elemental.description"),
        image: "/four-symbols-tarot-back.webp",
        price: 9999,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
      {
        id: "sakura",
        name: t("cardback.sakura.name"),
        description: t("cardback.sakura.description"),
        image: "/cardback-sakura.webp",
        isHidden: true,
        unlockCondition: t("cardback.sakura.condition"),
        isUnlocked: false,
        category: "seasonal",
      },
      {
        id: "halloween",
        name: t("cardback.halloween.name"),
        description: t("cardback.halloween.description"),
        image: "/cardback-halloween.webp",
        price: 4500,
        isUnlocked: false,
        category: "seasonal",
        isNew: true,
      },
      {
        id: "snow-queen",
        name: t("cardback.snowQueen.name"),
        description: t("cardback.snowQueen.description"),
        image: "/snow-queen-tarot-back.webp",
        price: 5500,
        isUnlocked: false,
        category: "premium",
        isNew: true,
      },
    ],
    [t],
  )

  const [cardBacks, setCardBacks] = useState<CardBack[]>([])
  const [previewCard, setPreviewCard] = useState({ id: 0, name: "The Fool" })
  // カードは常に裏面を表示するように設定
  const [isPreviewFlipped, setIsPreviewFlipped] = useState(true)
  // 選択されたスキンをデフォルトデザインに初期化
  const [selectedSkin, setSelectedSkin] = useState<string | null>("/default-tarot-card-back.webp")
  // 画像読み込みエラーの状態を追跡
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  // 選択中のカードバックID
  const [selectedCardBackId, setSelectedCardBackId] = useState<string>("default")
  // 購入済みスーツのリスト
  const [ownedSuitsList, setOwnedSuitsList] = useState<string[]>(["default"])

  // 言語が変更されたときにカードバックを更新
  useEffect(() => {
    setCardBacks(getCardBacks())
  }, [getCardBacks])

  // ショップのポイントが変更されたら同期
  useEffect(() => {
    console.log(`[SKINS DEBUG] ShopContext points changed: ${shopPoints}`)
    setTarotPoints(shopPoints)
  }, [shopPoints])

  // ショップの所有スーツリストが変更されたら同期
  useEffect(() => {
    if (ownedSuits && ownedSuits.length > 0) {
      setOwnedSuitsList(ownedSuits)
    }
  }, [ownedSuits])

  // 画像エラー処理の改善 - コンポーネント内部に移動
  const onImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string, id: string) => {
      console.log(`画像の読み込みに失敗しました: ${e.currentTarget.src} for ${id}`)
      // エラーが発生した画像URLをログに出力
      console.error(`Failed to load image: ${e.currentTarget.src}`)

      // エラー状態を更新
      setImageErrors((prev) => ({
        ...prev,
        [id]: true,
      }))

      // 画像読み込みエラー時のフォールバック処理を強化
      try {
        // すでにプレースホルダーの場合は何もしない
        if (e.currentTarget.src.includes("placeholder") || e.currentTarget.src.includes("placehold.co")) {
          return
        }

        // 特定のIDに対する特別な処理
        if (id === "default" || id === "golden-dragon") {
          e.currentTarget.src = GOLDEN_DRAGON_URL
          return
        }

        // フォールバック画像を設定
        e.currentTarget.src = fallbackSrc
        e.currentTarget.onerror = null // 無限ループを防ぐ
      } catch (error) {
        console.error("Error in image fallback:", error)
        // 最終的なフォールバック
        e.currentTarget.src = "/image-error.png"
      }
    },
    [],
  )

  // 安全な画像読み込みのためのヘルパー関数
  const safeImageUrl = useCallback(
    (url: string, id: string): string => {
      // エラーが発生している場合はプレースホルダーを返す
      if (imageErrors[id]) {
        return id === "dragon"
          ? DRAGON_PLACEHOLDER
          : `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(id)}%20tarot%20back`
      }

      // 特定のIDに対する処理
      if (id === "dragon") {
        return DRAGON_PLACEHOLDER
      }

      // 絶対URLの場合はそのまま返す
      if (url.startsWith("http")) {
        return url
      }

      // 相対パスの場合、先頭のスラッシュを確認
      if (!url.startsWith("/") && !url.startsWith("./")) {
        return `/${url}`
      }

      // 相対パスの場合、存在確認は行わずそのまま返す
      return url
    },
    [imageErrors],
  )

  // 重複を削除する関数
  const removeDuplicates = useCallback((suits: CardBack[]): CardBack[] => {
    const uniqueIds = new Set<string>()
    return suits.filter((suit) => {
      if (uniqueIds.has(suit.id)) {
        return false
      }
      uniqueIds.add(suit.id)
      return true
    })
  }, [])

  // ローカルストレージからデータを読み込む
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(`[SKINS DEBUG] Loading data from localStorage`)

      // ポイントの読み込み - ShopContextから取得するので、ここでは設定しない
      const savedPoints = localStorage.getItem("tarotPoints")
      console.log(`[SKINS DEBUG] Saved points in localStorage: ${savedPoints}`)

      // 初期化時はShopContextのポイントを使用
      if (savedPoints) {
        const pointsValue = Number.parseInt(savedPoints)
        console.log(`[SKINS DEBUG] Setting initial points to: ${pointsValue}`)
        setTarotPoints(pointsValue)
      } else {
        console.log(`[SKINS DEBUG] No saved points, keeping initial value: 0`)
      }

      // 所有スーツの読み込み
      const savedOwnedSuits = localStorage.getItem("ownedSuits")
      let ownedSuitsList = ["default"] // デフォルトのみを初期所有に設定
      if (savedOwnedSuits) {
        try {
          const parsedSuits = JSON.parse(savedOwnedSuits)
          if (Array.isArray(parsedSuits)) {
            ownedSuitsList = parsedSuits
            setOwnedSuitsList(ownedSuitsList)
          }
        } catch (error) {
          console.error("Error parsing owned suits:", error)
          // エラーの場合はデフォルトのみを使用
          localStorage.setItem("ownedSuits", JSON.stringify(ownedSuitsList))
        }
      } else {
        // 所有スーツが未設定の場合、初期値を保存
        localStorage.setItem("ownedSuits", JSON.stringify(ownedSuitsList))
      }

      // 選択中のスーツを取得
      const selectedSuit = localStorage.getItem("selectedSuit") || "default"
      setSelectedCardBackId(selectedSuit)

      // 選択中のカードバックURLを取得
      const selectedCardBackUrl = localStorage.getItem("selectedCardBack") || GOLDEN_DRAGON_URL
      setSelectedSkin(selectedCardBackUrl)

      // スーツの状態を読み込み
      const savedSuits = localStorage.getItem("cardSuits")
      if (savedSuits) {
        try {
          const parsedSuits = JSON.parse(savedSuits)
          setCardBacks((prevSuits) => {
            // 重複を削除
            const uniqueSuits = removeDuplicates(prevSuits.filter((suit) => suit.id !== "golden-dragon"))

            return uniqueSuits.map((suit) => {
              // デフォルトは常に選択中・解放済みに
              if (suit.id === "default") {
                return {
                  ...suit,
                  isUnlocked: true,
                  isSelected: selectedSuit === "default",
                  image: GOLDEN_DRAGON_URL,
                }
              }

              // ドラゴンの特別処理
              if (suit.id === "dragon") {
                return {
                  ...suit,
                  isUnlocked: ownedSuitsList.includes("dragon"),
                  isSelected: selectedSuit === "dragon",
                  image: "/dragon-tarot-back.webp",
                }
              }

              // その他のスーツ
              const savedSuit = parsedSuits.find((s: CardBack) => s.id === suit.id)
              if (savedSuit) {
                return {
                  ...suit,
                  isUnlocked: savedSuit.isUnlocked || ownedSuitsList.includes(suit.id),
                  isSelected: suit.id === selectedSuit,
                }
              }
              // 所有スーツリストに基づいて解放状態を設定
              return {
                ...suit,
                isUnlocked: ownedSuitsList.includes(suit.id),
                isSelected: suit.id === selectedSuit,
              }
            })
          })
        } catch (error) {
          console.error("カードバックの読み込みに失敗しました:", error)
          // エラーの場合は所有スーツリストに基づいて設定
          setCardBacks((prevSuits) => {
            // 重複を削除
            const uniqueSuits = removeDuplicates(prevSuits.filter((suit) => suit.id !== "golden-dragon"))

            return uniqueSuits.map((suit) => ({
              ...suit,
              isUnlocked: ownedSuitsList.includes(suit.id),
              isSelected: suit.id === selectedSuit,
              image:
                suit.id === "default"
                  ? GOLDEN_DRAGON_URL
                  : suit.id === "dragon"
                    ? "/dragon-tarot-back.webp"
                    : suit.image,
            }))
          })
        }
      } else {
        // cardSuitsがない場合は、ownedSuitsに基づいて解放状態を設定
        setCardBacks((prevSuits) => {
          // 重複を削除
          const uniqueSuits = removeDuplicates(prevSuits.filter((suit) => suit.id !== "golden-dragon"))

          return uniqueSuits.map((suit) => ({
            ...suit,
            isUnlocked: ownedSuitsList.includes(suit.id),
            isSelected: suit.id === selectedSuit,
            image:
              suit.id === "default" ? GOLDEN_DRAGON_URL : suit.id === "dragon" ? "/dragon-tarot-back.webp" : suit.image,
          }))
        })
      }

      // カスタムイベントを発火して他のコンポーネントに通知
      if (typeof window !== "undefined") {
        const event = new CustomEvent("cardSuitChanged", {
          detail: {
            suitId: selectedSuit,
            imageUrl: selectedCardBackUrl,
            timestamp: Date.now(),
          },
          bubbles: true,
          cancelable: true,
        })
        window.dispatchEvent(event)
        console.log(`Dispatched cardSuitChanged event for ${selectedSuit}`)
      }
    }
  }, [removeDuplicates])

  // データをローカルストレージに保存
  const saveData = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tarotPoints", tarotPoints.toString())

      // 選択されているスーツを取得
      const selectedSuitId = selectedCardBackId || "default"

      localStorage.setItem(
        "cardSuits",
        JSON.stringify(
          cardBacks.map((suit) => ({
            id: suit.id,
            isUnlocked: suit.isUnlocked || suit.id === "default", // デフォルトのみ常に解放済み
            isSelected: suit.id === selectedSuitId, // 選択中のスーツを反映
          })),
        ),
      )

      // 選択中のスーツIDを明示的に保存
      localStorage.setItem("selectedSuit", selectedSuitId)

      // 選択中のカードバックの画像URLを保存
      const selectedSuit = cardBacks.find((suit) => suit.id === selectedSuitId)
      const selectedImageUrl = selectedSuit ? selectedSuit.image : GOLDEN_DRAGON_URL
      localStorage.setItem("selectedCardBack", selectedImageUrl)

      // 占いページ用の設定も更新
      localStorage.setItem("fortuneCardBack", selectedSuitId)
      localStorage.setItem("fortuneCardBackUrl", selectedImageUrl)

      console.log("Saved to localStorage:", {
        tarotPoints,
        selectedSuit: selectedSuitId,
        selectedCardBack: selectedImageUrl,
      })
    }
  }, [tarotPoints, cardBacks, selectedCardBackId])

  // データが変更されたら保存
  useEffect(() => {
    saveData()
  }, [tarotPoints, cardBacks, selectedCardBackId, saveData])

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setNewCardBackName("")
    setNewCardBackImageUrl("")
  }

  const handleCreateCardBack = () => {
    // 新しいカードバックを作成
    const newCardBack: CardBack = {
      id: `custom-${Date.now()}`,
      name: newCardBackName || t("cardback.custom.name"),
      description: t("cardback.custom.description"),
      image: newCardBackImageUrl || "/placeholder-b581k.png",
      isUnlocked: true,
      isSelected: false,
      category: "basic",
      isNew: true,
    }

    // カードバックリストに追加
    setCardBacks((prev) => [...prev, newCardBack])

    toast({
      title: t("toast.createSuccess.title"),
      description: t("toast.createSuccess.description"),
    })

    handleCloseDialog()
  }

  // handleSelectSkin関数を更新
  const handleSelectSkin = (skinUrl: string, suitId: string) => {
    try {
      // 選択されたスーツを取得
      const selectedSuit = cardBacks.find((suit) => suit.id === suitId)

      if (!selectedSuit) {
        throw new Error(t("error.cardbackNotFound", { id: suitId }))
      }

      // 選択されたスーツが解放されていない場合は選択できない
      if (!selectedSuit.isUnlocked) {
        toast({
          variant: "destructive",
          title: t("toast.error"),
          description: t("toast.cardback.not.unlocked"),
        })
        return
      }

      // カードバックを選択
      const success = selectCardBack(suitId, skinUrl)

      if (success) {
        // 選択状態を更新
        setCardBacks((prevSuits) =>
          prevSuits.map((suit) => ({
            ...suit,
            isSelected: suit.id === suitId,
          })),
        )

        // 選択されたスキンを更新
        setSelectedSkin(skinUrl)
        setSelectedCardBackId(suitId)

        // ローカルストレージに保存
        localStorage.setItem("selectedCardBack", skinUrl)
        localStorage.setItem("selectedSuit", suitId)
        localStorage.setItem("fortuneCardBack", suitId)
        localStorage.setItem("fortuneCardBackUrl", skinUrl)

        // 特にドラゴンの場合は、確実に保存されるように追加の処理
        if (suitId === "dragon") {
          setTimeout(() => {
            console.log("Dragon card back selected - ensuring it's properly saved")
            localStorage.setItem("selectedSuit", "dragon")
            localStorage.setItem("selectedCardBack", "/dragon-tarot-back.webp")
            localStorage.setItem("fortuneCardBack", "dragon")
            localStorage.setItem("fortuneCardBackUrl", "/dragon-tarot-back.webp")

            // イベントを発火
            const event = new CustomEvent("cardSuitChanged", {
              detail: {
                suitId: "dragon",
                imageUrl: "/dragon-tarot-back.webp",
                timestamp: Date.now(),
              },
              bubbles: true,
              cancelable: true,
            })
            window.dispatchEvent(event)
          }, 500)
        }

        toast({
          title: t("toast.cardback.selected"),
          description: t("toast.cardback.applied").replace("{name}", selectedSuit.name),
        })
      } else {
        toast({
          variant: "destructive",
          title: t("toast.error"),
          description: t("error.cardbackSelectionFailed"),
        })
      }
    } catch (error) {
      console.error("Error selecting card back:", error)
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("error.cardbackSelectionError"),
      })
    }
  }

  // selectSuit 関数を以下のように修正：
  const selectSuit = (id: string) => {
    try {
      // 選択されたスーツを取得
      const selectedSuit = cardBacks.find((suit) => suit.id === id)

      if (!selectedSuit) {
        throw new Error(t("error.cardbackNotFound", { id }))
      }

      // 選択されたスーツが解放されていない場合は選択できない
      if (!selectedSuit.isUnlocked) {
        toast({
          variant: "destructive",
          title: t("toast.error"),
          description: t("toast.cardback.not.unlocked"),
        })
        return
      }

      // カードバックを選択
      handleSelectSkin(selectedSuit.image, id)
    } catch (error) {
      console.error("Error in selectSuit:", error)
      toast({
        variant: "destructive",
        title: t("toast.error"),
        description: t("error.cardbackSelectionError"),
      })
    }
  }

  // 購入処理を修正
  const purchaseSuit = (id: string) => {
    console.log(`Attempting to purchase suit: ${id}`)
    const suit = cardBacks.find((s) => s.id === id)
    if (!suit) {
      console.error(`Suit not found: ${id}`)
      return
    }

    if (suit.price && tarotPoints < suit.price) {
      toast({
        title: t("toast.insufficient.points"),
        description: t("toast.insufficient.points.description").replace(
          "{amount}",
          (suit.price - tarotPoints).toString(),
        ),
        variant: "destructive",
      })
      return
    }

    // ShopContextのpurchaseSuit関数を使用
    const result = shopPurchaseSuit(id)

    if (result && result.success) {
      // スーツを解放
      setCardBacks((prevSuits) => prevSuits.map((s) => (s.id === id ? { ...s, isUnlocked: true } : s)))

      // 所有スーツリストを更新
      setOwnedSuitsList((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id]
        }
        return prev
      })

      // ドラゴンの場合は特別処理
      if (id === "dragon") {
        // utils/card-back-manager.tsのaddSuitToOwned関数を使用
        import("@/utils/card-back-manager")
          .then(({ addSuitToOwned }) => {
            addSuitToOwned("dragon")
            console.log("Dragon card back added to owned suits via card-back-manager")
          })
          .catch((error) => {
            console.error("Failed to import card-back-manager:", error)
          })
      }

      toast({
        title: t("toast.purchase.successful"),
        description: t("toast.purchase.successful").replace("{name}", suit.name),
      })

      // 購入後に自動的に選択
      selectSuit(id)
    } else {
      toast({
        variant: "destructive",
        title: t("toast.purchase.failed"),
        description: t("error.cardbackPurchaseFailed"),
      })
    }
  }

  // 広告視聴でスーツを解放（仮実装）
  const watchAdForSuit = (id: string) => {
    toast({
      title: t("toast.watch.ad"),
      description: t("toast.watch.ad.description"),
    })

    // 広告視聴の代わりに3秒待機
    setTimeout(() => {
      setCardBacks((prevSuits) => prevSuits.map((s) => (s.id === id ? { ...s, isUnlocked: true } : s)))

      // 所有スーツリストを更新
      setOwnedSuitsList((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id]
        }
        return prev
      })

      // ローカルストレージに保存
      const updatedOwnedSuits = [...ownedSuitsList]
      if (!updatedOwnedSuits.includes(id)) {
        updatedOwnedSuits.push(id)
      }
      localStorage.setItem("ownedSuits", JSON.stringify(updatedOwnedSuits))

      toast({
        title: t("toast.unlock.successful"),
        description: t("toast.unlock.successful").replace("{name}", cardBacks.find((s) => s.id === id)?.name || ""),
      })
    }, 3000)
  }

  // 条件達成チェック（実装）
  const handleCheckCondition = (id: string) => {
    toast({
      title: t("toast.condition.check"),
      description: t("toast.condition.check.description"),
    })

    // 実際の条件チェック
    const result = checkCondition(id)

    if (result) {
      setCardBacks((prevSuits) => prevSuits.map((s) => (s.id === id ? { ...s, isUnlocked: true } : s)))

      // 所有スーツリストを更新
      setOwnedSuitsList((prev) => {
        if (!prev.includes(id)) {
          return [...prev, id]
        }
        return prev
      })

      // ローカルストレージに保存
      const updatedOwnedSuits = [...ownedSuitsList]
      if (!updatedOwnedSuits.includes(id)) {
        updatedOwnedSuits.push(id)
      }
      localStorage.setItem("ownedSuits", JSON.stringify(updatedOwnedSuits))

      toast({
        title: t("toast.condition.achieved"),
        description: t("toast.condition.achieved").replace("{name}", cardBacks.find((s) => s.id === id)?.name || ""),
      })
    } else {
      toast({
        title: t("toast.condition.not.met"),
        description: t("toast.condition.not.met").replace("{condition}", getHiddenConditionDescription(id)),
        variant: "destructive",
      })
    }
  }

  // 重複を削除したカードバックリスト
  const uniqueCardBacks = useMemo(() => {
    return removeDuplicates(cardBacks.filter((suit) => suit.id !== "golden-dragon"))
  }, [cardBacks, removeDuplicates])

  // フィルタリングされたスーツを取得
  const filteredSuits =
    activeTab === "all"
      ? uniqueCardBacks
      : uniqueCardBacks.filter((suit) =>
          activeTab === "unlocked"
            ? suit.isUnlocked
            : suit.category === activeTab && (!suit.isHidden || suit.isUnlocked),
        )

  // カードバック画像をレンダリングする関数
  const renderCardBackImage = (suit: CardBack) => {
    const sourceImage = suit.isUnlocked ? suit.image : suit.lockedImage || suit.image
    const imageUrl = safeImageUrl(sourceImage, suit.id)

    return (
      <div className="aspect-[3/4] bg-gray-800 overflow-hidden rounded-t-lg flex items-center justify-center">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={suit.name}
          className={`max-h-full max-w-full object-contain transition-all duration-300 ${!suit.isUnlocked ? "filter grayscale opacity-50" : ""}`}
          onError={(e) =>
            onImageError(
              e,
              `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(suit.name)}%20tarot%20back`,
              suit.id,
            )
          }
        />
        {!suit.isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Lock className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
    )
  }

  // デバッグ情報を表示するボタン
  const handleShowDebugInfo = () => {
    const debugInfo = {
      selectedCardBackId,
      selectedSkin,
      ownedSuitsList,
      tarotPoints,
      shopPoints,
      localStorage: {
        selectedSuit: localStorage.getItem("selectedSuit"),
        selectedCardBack: localStorage.getItem("selectedCardBack"),
        fortuneCardBack: localStorage.getItem("fortuneCardBack"),
        fortuneCardBackUrl: localStorage.getItem("fortuneCardBackUrl"),
        ownedSuits: localStorage.getItem("ownedSuits"),
        tarotPoints: localStorage.getItem("tarotPoints"),
      },
    }

    console.log("Debug Info:", debugInfo)

    toast({
      title: t("toast.debug.info"),
      description: t("toast.debug.info.description"),
    })
  }

  return (
    <div className="pb-20 pt-8 space-y-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("settings.back")}
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-amber-900/30 px-4 py-2 rounded-full">
              <Coins className="h-5 w-5 text-amber-400 mr-2" />
              <span className="text-amber-400 font-bold">{tarotPoints} TP</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShowDebugInfo}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-amber-400">{t("shop.title")}</h1>
          <p className="text-xl text-purple-300">{t("shop.subtitle")}</p>
        </div>

        {/* プレビューカード */}
        <div className="mb-8 p-4 bg-gray-900/60 rounded-lg">
          <h2 className="text-xl font-bold text-center text-amber-400 mb-4">{t("shop.current.cardback")}</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-96 rounded-lg overflow-hidden border-2 border-amber-500">
              <img
                src={selectedSkin || "/default-tarot-card-back.webp"}
                alt={t("shop.current.cardback")}
                className="w-full h-full object-cover"
                onError={(e) => onImageError(e, "/default-tarot-card-back.webp", "default")}
              />
            </div>
            <div className="mt-2 text-center">
              <p className="text-amber-300">
                {t("shop.selected")}: {cardBacks.find((s) => s.id === selectedCardBackId)?.name || "Default"}
              </p>
              <p className="text-xs text-gray-400">ID: {selectedCardBackId}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">{t("shop.tabs.all")}</TabsTrigger>
            <TabsTrigger value="basic">{t("shop.tabs.basic")}</TabsTrigger>
            <TabsTrigger value="premium">{t("shop.tabs.premium")}</TabsTrigger>
            <TabsTrigger value="special">{t("shop.tabs.special")}</TabsTrigger>
            <TabsTrigger value="seasonal">{t("shop.tabs.seasonal")}</TabsTrigger>
            <TabsTrigger value="unlocked">{t("shop.tabs.unlocked")}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredSuits.map((suit) => (
                <Card
                  key={suit.id}
                  className={`border-purple-700 ${suit.isSelected ? "bg-purple-900/40" : "bg-gray-900/60"} backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-purple-500/20`}
                >
                  <div className="relative">
                    {/* カードバックの表示部分を修正 */}
                    {renderCardBackImage(suit)}
                    {suit.isSelected && (
                      <Badge className="absolute top-2 right-2 bg-amber-500">
                        <Check className="h-3 w-3 mr-1" />
                        {t("shop.badges.selected")}
                      </Badge>
                    )}
                    {suit.isNew && !suit.isSelected && (
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t("shop.badges.new")}
                      </Badge>
                    )}
                    {suit.category === "premium" && (
                      <Badge className="absolute top-2 left-2 bg-purple-600">{t("shop.badges.premium")}</Badge>
                    )}
                    {suit.category === "seasonal" && (
                      <Badge className="absolute top-2 left-2 bg-green-600">{t("shop.badges.seasonal")}</Badge>
                    )}
                    {suit.category === "special" && (
                      <Badge className="absolute top-2 left-2 bg-blue-600">{t("shop.badges.special")}</Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      {suit.name}
                      {suit.isHidden && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-2 text-blue-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-gray-900 border-blue-500 text-white p-3">
                              <p className="font-semibold text-blue-400 mb-1">{t("shop.hidden.condition")}</p>
                              <p>{suit.unlockCondition || getHiddenConditionDescription(suit.id)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-300">{suit.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex flex-col space-y-2">
                    {suit.isUnlocked ? (
                      <Button
                        className={`w-full ${suit.isSelected ? "bg-purple-700" : "bg-amber-700 hover:bg-amber-600"}`}
                        onClick={() => selectSuit(suit.id)}
                        disabled={suit.isSelected}
                      >
                        {suit.isSelected ? t("shop.buttons.selected") : t("shop.buttons.select")}
                      </Button>
                    ) : (
                      <>
                        {suit.price && (
                          <Button
                            className="w-full bg-amber-700 hover:bg-amber-600 flex items-center justify-center"
                            onClick={() => purchaseSuit(suit.id)}
                            disabled={tarotPoints < suit.price}
                          >
                            <Coins className="mr-2 h-4 w-4" />
                            {t("shop.buttons.purchase").replace("{price}", suit.price.toString())}
                          </Button>
                        )}
                        {suit.adRequired && (
                          <Button
                            className="w-full bg-blue-700 hover:bg-blue-600"
                            onClick={() => watchAdForSuit(suit.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t("shop.buttons.watch.ad")}
                          </Button>
                        )}
                        {suit.unlockCondition && !suit.isHidden && (
                          <Button
                            className="w-full bg-green-700 hover:bg-green-600 flex items-center justify-center"
                            onClick={() => handleCheckCondition(suit.id)}
                          >
                            <Trophy className="mr-2 h-4 w-4" />
                            {t("shop.buttons.check.achievement")}
                          </Button>
                        )}
                        {suit.isHidden && !suit.isUnlocked && (
                          <div className="flex flex-col space-y-2">
                            <Button
                              className="w-full bg-blue-700 hover:bg-blue-600 flex items-center justify-center"
                              onClick={() => handleCheckCondition(suit.id)}
                            >
                              <Trophy className="mr-2 h-4 w-4" />
                              {t("shop.buttons.check.achievement")}
                            </Button>
                            <div className="text-sm text-gray-400 text-center py-1">
                              <Gift className="inline-block mr-1 h-4 w-4" />
                              {suit.id === "cosmic"
                                ? t("cardback.cosmic.hint")
                                : suit.id === "sakura"
                                  ? t("cardback.sakura.hint")
                                  : t("cardback.hidden.hint")}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="border-amber-500 bg-amber-500/10 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-amber-400">{t("shop.earn.points.title")}</CardTitle>
            <CardDescription className="text-amber-300">{t("shop.earn.points.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-amber-700">
              <h3 className="text-lg font-bold text-amber-400 mb-2">{t("shop.earn.points.how")}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                <li>{t("shop.earn.points.fortune")}</li>
                <li>{t("shop.earn.points.quiz")}</li>
                <li>{t("shop.earn.points.game")}</li>
                <li>{t("shop.earn.points.login")}</li>
                <li>{t("shop.earn.points.events")}</li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-amber-700/30 text-xs text-gray-400">
              <p className="mb-1">{t("shop.disclaimer.note")}</p>
              <p>{t("shop.disclaimer.reset")}</p>
            </div>
          </CardContent>
        </Card>

        {/* 新しいカードバック作成ダイアログ */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialog.create.cardback")}</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {t("dialog.name")}
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("dialog.placeholder.name")}
                value={newCardBackName}
                onChange={(e) => setNewCardBackName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-2">
                {t("dialog.image.url")}
              </label>
              <input
                type="text"
                id="imageUrl"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={t("dialog.placeholder.image")}
                value={newCardBackImageUrl}
                onChange={(e) => setNewCardBackImageUrl(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCardBack} className="bg-purple-600 hover:bg-purple-700">
                {t("dialog.create")}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="ml-2">
                  {t("dialog.cancel")}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <BottomNavigation />
    </div>
  )
}
