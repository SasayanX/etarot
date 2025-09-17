"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { addSuitToOwned } from "@/utils/card-back-manager"

// ショップのコンテキスト型定義
interface ShopContextType {
  points: number
  addPoints: (amount: number) => void
  purchaseSuit: (suitId: string) => { success: boolean; message: string }
  checkCondition: (suitId: string) => boolean
  getHiddenConditionDescription: (suitId: string) => string
  ownedSuits: string[]
  selectedSuit: string
  setSelectedSuit: (suitId: string) => void
}

// デフォルト値
const defaultShopContext: ShopContextType = {
  points: 0,
  addPoints: () => {},
  purchaseSuit: () => ({ success: false, message: "ShopContext not initialized" }),
  checkCondition: () => false,
  getHiddenConditionDescription: () => "条件不明",
  ownedSuits: ["default"],
  selectedSuit: "default",
  setSelectedSuit: () => {},
}

// コンテキストの作成
const ShopContext = createContext<ShopContextType>(defaultShopContext)

// コンテキストを使用するためのフック
export const useShop = () => useContext(ShopContext)

// プロバイダーコンポーネント
export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState(0)
  const [ownedSuits, setOwnedSuits] = useState<string[]>(["default"])
  const [selectedSuit, setSelectedSuit] = useState("default")
  const { toast } = useToast()

  // 初期化時にローカルストレージからデータを読み込む
  useEffect(() => {
    if (typeof window !== "undefined") {
      // ポイントの読み込み - 確実に読み込む
      const savedPoints = localStorage.getItem("tarotPoints")
      const pointsValue = savedPoints ? Number.parseInt(savedPoints, 10) : 0
      console.log(`[SHOP CONTEXT] Loading points from localStorage: ${pointsValue}`)
      setPoints(pointsValue)

      // 所有スーツの読み込み
      const savedOwnedSuits = localStorage.getItem("ownedSuits")
      if (savedOwnedSuits) {
        try {
          const parsedSuits = JSON.parse(savedOwnedSuits)
          if (Array.isArray(parsedSuits)) {
            setOwnedSuits(parsedSuits)
          }
        } catch (error) {
          console.error("Error parsing owned suits:", error)
          setOwnedSuits(["default"])
          localStorage.setItem("ownedSuits", JSON.stringify(["default"]))
        }
      } else {
        localStorage.setItem("ownedSuits", JSON.stringify(["default"]))
      }

      // 選択中のスーツを読み込み
      const savedSelectedSuit = localStorage.getItem("selectedSuit")
      if (savedSelectedSuit) {
        setSelectedSuit(savedSelectedSuit)
      }

      // ローカルストレージの変更を監視
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === "tarotPoints" && e.newValue) {
          const newPoints = Number.parseInt(e.newValue, 10)
          console.log(`[SHOP CONTEXT] Storage change detected: ${newPoints}`)
          setPoints(newPoints)
        }
      }

      window.addEventListener("storage", handleStorageChange)

      return () => {
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  // ポイントを追加する関数
  const addPoints = (amount: number) => {
    if (typeof window === "undefined") return false

    try {
      // デバッグログを追加
      console.log(`[SHOP DEBUG] addPoints called with amount: ${amount}`)
      console.log(`[SHOP DEBUG] Current points before addition: ${points}`)

      // 異常に大きな値をチェック
      if (amount > 100) {
        console.warn(`[SHOP WARNING] Unusually large point addition attempted: ${amount}`)
        // 異常に大きな値の場合は制限
        amount = Math.min(amount, 10)
      }

      // 負の値をチェック
      if (amount <= 0) {
        console.warn(`[SHOP WARNING] Invalid point amount: ${amount}`)
        return false
      }

      const newPoints = points + amount
      setPoints(newPoints)

      // ローカルストレージに保存する前に確認
      console.log(`[SHOP DEBUG] Saving to localStorage: tarotPoints = ${newPoints}`)
      localStorage.setItem("tarotPoints", newPoints.toString())

      // 保存後に確認
      const savedValue = localStorage.getItem("tarotPoints")
      console.log(`[SHOP DEBUG] Verified localStorage value: ${savedValue}`)

      // カスタムイベントを発火（他のコンポーネントに通知）
      const event = new CustomEvent("tarotPointsUpdated", {
        detail: { points: newPoints, added: amount },
      })
      window.dispatchEvent(event)

      console.log(`[SHOP DEBUG] Points updated successfully: ${points} -> ${newPoints}`)
      return true
    } catch (error) {
      console.error("[SHOP ERROR] Error adding points:", error)
      return false
    }
  }

  // スーツを購入する関数
  const purchaseSuit = (suitId: string) => {
    if (typeof window === "undefined") {
      return { success: false, message: "ブラウザ環境でのみ利用可能です" }
    }

    try {
      console.log(`Purchasing suit: ${suitId}`)

      // スーツの価格を取得（実際のアプリでは価格マスタから取得）
      const suitPrices: Record<string, number> = {
        moonlight: 5000,
        golden: 7500,
        crystal: 6500,
        mystic: 6000,
        royal: 8500,
        dragon: 9999,
        halloween: 4500,
        "snow-queen": 5500,
        elemental: 9999,
      }

      const price = suitPrices[suitId] || 5000

      // ポイントが足りるかチェック
      if (points < price) {
        return {
          success: false,
          message: `ポイントが不足しています (必要: ${price}TP, 所持: ${points}TP)`,
        }
      }

      // すでに所有しているかチェック
      if (ownedSuits.includes(suitId)) {
        return {
          success: false,
          message: `すでに所有しています: ${suitId}`,
        }
      }

      // ポイントを消費
      const newPoints = points - price
      setPoints(newPoints)
      localStorage.setItem("tarotPoints", newPoints.toString())

      // 所有スーツリストに追加
      const newOwnedSuits = [...ownedSuits, suitId]
      setOwnedSuits(newOwnedSuits)
      localStorage.setItem("ownedSuits", JSON.stringify(newOwnedSuits))

      // カードバックマネージャーにも通知
      addSuitToOwned(suitId)

      // カスタムイベントを発火（他のコンポーネントに通知）
      const event = new CustomEvent("suitPurchased", {
        detail: { suitId, price, newPoints },
      })
      window.dispatchEvent(event)

      console.log(`Purchased suit: ${suitId} for ${price}TP. New points: ${newPoints}`)

      return {
        success: true,
        message: `${suitId}を${price}TPで購入しました`,
      }
    } catch (error) {
      console.error("Error purchasing suit:", error)
      return {
        success: false,
        message: `購入処理中にエラーが発生しました: ${error}`,
      }
    }
  }

  // 条件達成をチェックする関数
  const checkCondition = (suitId: string) => {
    if (typeof window === "undefined") return false

    try {
      // 条件チェックのロジック（実際のアプリでは条件に応じて実装）
      switch (suitId) {
        case "cosmic":
          // タイムアタックモードでスコア15000以上を達成したかチェック
          // 正しいキー名とデータ構造を使用
          const gameScores = JSON.parse(localStorage.getItem("tarotGameScores") || "{}")
          const timeAttackScores = gameScores.timeAttack || []
          const timeAttackHighScore = timeAttackScores.length > 0 ? timeAttackScores[0]?.score || 0 : 0
          console.log(`[DEBUG] Checking cosmic condition - High score: ${timeAttackHighScore}`)
          return timeAttackHighScore >= 15000

        case "sakura":
          // 桜の季節（3月16日～4月15日）の間に、7日間ログインしたかチェック
          const now = new Date()
          const month = now.getMonth() + 1 // 0-indexed
          const day = now.getDate()
          const isSakuraSeason = (month === 3 && day >= 16) || (month === 4 && day <= 15)

          // ログイン日数のチェック（実際のアプリではログイン履歴から計算）
          const loginDays = JSON.parse(localStorage.getItem("loginDays") || "[]")
          const loginDaysInSeason = loginDays.filter((date: string) => {
            const loginDate = new Date(date)
            const loginMonth = loginDate.getMonth() + 1
            const loginDay = loginDate.getDate()
            return (loginMonth === 3 && loginDay >= 16) || (loginMonth === 4 && loginDay <= 15)
          })

          return isSakuraSeason && loginDaysInSeason.length >= 7

        default:
          return false
      }
    } catch (error) {
      console.error("Error checking condition:", error)
      return false
    }
  }

  // 隠し条件の説明を取得する関数
  const getHiddenConditionDescription = (suitId: string) => {
    switch (suitId) {
      case "cosmic":
        return "タイムアタックモードでスコア15000以上を達成する"
      case "sakura":
        return "桜の咲く季節（3月16日～4月15日）の間に、7日間ログインする"
      default:
        return "特別な条件を達成する"
    }
  }

  // 選択中のスーツを設定する関数
  const handleSetSelectedSuit = (suitId: string) => {
    if (typeof window === "undefined") return

    try {
      setSelectedSuit(suitId)
      localStorage.setItem("selectedSuit", suitId)
    } catch (error) {
      console.error("Error setting selected suit:", error)
    }
  }

  // コンテキスト値の作成
  const value = {
    points,
    addPoints,
    purchaseSuit,
    checkCondition,
    getHiddenConditionDescription,
    ownedSuits,
    selectedSuit,
    setSelectedSuit: handleSetSelectedSuit,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}
