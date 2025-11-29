import type React from "react"
/**
 * カード画像に関するユーティリティ関数
 */

// カード画像のパスを取得する関数
export function getCardImagePath(cardId: number): string {
  // 大アルカナ（0-21）
  if (cardId >= 0 && cardId <= 21) {
    return `/tarot-cards/major-arcana-${cardId}.png`
  }

  // 小アルカナ - ワンド（22-35）
  if (cardId >= 22 && cardId <= 35) {
    return `/tarot-cards/wands-${cardId - 22 + 1}.png`
  }

  // 小アルカナ - カップ（36-49）
  if (cardId >= 36 && cardId <= 49) {
    return `/tarot-cards/cups-${cardId - 36 + 1}.png`
  }

  // 小アルカナ - ソード（50-63）
  if (cardId >= 50 && cardId <= 63) {
    return `/tarot-cards/swords-${cardId - 50 + 1}.png`
  }

  // 小アルカナ - ペンタクル（64-77）
  if (cardId >= 64 && cardId <= 77) {
    return `/tarot-cards/pentacles-${cardId - 64 + 1}.png`
  }

  // フォールバック
  return `/placeholder.svg?height=300&width=200&query=タロットカード${cardId}`
}

// カードバックの画像パスを取得する関数
export function getCardBackImagePath(suitId: string): string {
  const cardBackMap: Record<string, string> = {
    default: "/default-tarot-card-back.webp",
    moonlight: "/moonlight-tarot-card-back.webp",
    crystal: "/crystal-tarot-card-back.webp",
    golden: "/golden-tarot-back.webp",
    mystic: "/mystic-tarot-back.webp",
    royal: "/royal-tarot-card-back.webp",
    cosmic: "/cosmic-tarot-back.webp",
    sakura: "/cardback-sakura.webp",
    halloween: "/cardback-halloween.webp",
    winter: "/cardback-winter.png",
    elemental: "/cardback-elemental.png",
    fourSymbols: "/four-symbols-tarot-back.webp",
    snowQueen: "/snow-queen-tarot-back.webp",
    goldenDragon: "/golden-dragon-tarot-back.jpg",
  }

  return cardBackMap[suitId] || cardBackMap.default
}

// 画像の読み込みエラーを処理する関数
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string): void {
  const img = event.currentTarget
  console.warn(`Image load error: ${img.src}`)
  img.src = fallbackSrc
  img.onerror = null // 無限ループを防止
}

// 画像が存在するかチェックする関数
export async function checkImageExists(url: string): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const response = await fetch(url, { method: "HEAD" })
    return response.ok
  } catch (error) {
    console.error(`Failed to check image URL: ${url}`, error)
    return false
  }
}

// 画像をプリロードする関数
export async function preloadCardImages(cardIds: number[]): Promise<void> {
  if (typeof window === "undefined") return

  const imagePaths = cardIds.map((id) => getCardImagePath(id))

  await Promise.allSettled(
    imagePaths.map((path) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // エラーでも続行
        img.src = path
      })
    }),
  )

  console.log(`Preloaded ${imagePaths.length} card images`)
}
