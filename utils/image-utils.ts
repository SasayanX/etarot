import type React from "react"
/**
 * 画像関連のユーティリティ関数
 */

// カード画像のURLを取得する関数
export function getCardImageUrl(cardId: number): string {
  try {
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
    console.warn(`Invalid card ID: ${cardId}, using placeholder`)
    return getBackupImageUrlById(cardId)
  } catch (error) {
    console.error(`Error in getCardImageUrl for card ID: ${cardId}`, error)
    return getBackupImageUrlById(cardId)
  }
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
export async function preloadImages(
  imagePaths: string[],
  onProgress?: (loaded: number, total: number) => void,
): Promise<string[]> {
  // サーバーサイドでは空の配列を返す
  if (typeof window === "undefined") {
    return []
  }

  const loadedPaths: string[] = []
  const total = imagePaths.length

  // Promise.allSettled を使用して、一部の画像が失敗しても続行できるようにする
  const results = await Promise.allSettled(
    imagePaths.map(
      (imagePath, index) =>
        new Promise<string>((resolve, reject) => {
          // ブラウザ環境でのみ Image オブジェクトを使用
          const img = new window.Image()

          // タイムアウト処理を追加（5秒）
          const timeoutId = setTimeout(() => {
            reject(new Error(`Timeout loading image: ${imagePath}`))
          }, 5000)

          img.onload = () => {
            clearTimeout(timeoutId)
            loadedPaths.push(imagePath)
            if (onProgress) {
              onProgress(index + 1, total)
            }
            resolve(imagePath)
          }

          img.onerror = () => {
            clearTimeout(timeoutId)
            console.warn(`Failed to preload image: ${imagePath}`)
            // パスを含めてリジェクトすることで、どの画像が失敗したかを知ることができる
            reject(imagePath)
          }

          // イベントハンドラを設定した後にsrcを設定
          img.src = imagePath

          // キャッシュのために追加
          if (img.complete) {
            clearTimeout(timeoutId)
            loadedPaths.push(imagePath)
            if (onProgress) {
              onProgress(index + 1, total)
            }
            resolve(imagePath)
          }
        }),
    ),
  )

  // デバッグ用に結果をログ出力
  const failedImages = results
    .filter((result): result is PromiseRejectedResult => result.status === "rejected")
    .map((result) => result.reason)

  if (failedImages.length > 0) {
    console.warn(`Failed to preload ${failedImages.length} images:`, failedImages)
  }

  return loadedPaths
}

// バックアップ画像のURLを取得する関数
export function getBackupImageUrlById(cardId: number): string {
  try {
    // 大アルカナ（0-21）
    if (cardId >= 0 && cardId <= 21) {
      const cardName =
        [
          "The Fool",
          "The Magician",
          "The High Priestess",
          "The Empress",
          "The Emperor",
          "The Hierophant",
          "The Lovers",
          "The Chariot",
          "Strength",
          "The Hermit",
          "Wheel of Fortune",
          "Justice",
          "The Hanged Man",
          "Death",
          "Temperance",
          "The Devil",
          "The Tower",
          "The Star",
          "The Moon",
          "The Sun",
          "Judgement",
          "The World",
        ][cardId] || `Major Arcana ${cardId}`

      return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(cardName)}`
    }

    // 小アルカナ - ワンド（22-35）
    if (cardId >= 22 && cardId <= 35) {
      const rank = cardId - 22 + 1
      const cardName =
        rank <= 10
          ? `${rank} of Wands`
          : rank === 11
            ? "Page of Wands"
            : rank === 12
              ? "Knight of Wands"
              : rank === 13
                ? "Queen of Wands"
                : "King of Wands"
      return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(cardName)}`
    }

    // 小アルカナ - カップ（36-49）
    if (cardId >= 36 && cardId <= 49) {
      const rank = cardId - 36 + 1
      const cardName =
        rank <= 10
          ? `${rank} of Cups`
          : rank === 11
            ? "Page of Cups"
            : rank === 12
              ? "Knight of Cups"
              : rank === 13
                ? "Queen of Cups"
                : "King of Cups"
      return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(cardName)}`
    }

    // 小アルカナ - ソード（50-63）
    if (cardId >= 50 && cardId <= 63) {
      const rank = cardId - 50 + 1
      const cardName =
        rank <= 10
          ? `${rank} of Swords`
          : rank === 11
            ? "Page of Swords"
            : rank === 12
              ? "Knight of Swords"
              : rank === 13
                ? "Queen of Swords"
                : "King of Swords"
      return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(cardName)}`
    }

    // 小アルカナ - ペンタクル（64-77）
    if (cardId >= 64 && cardId <= 77) {
      const rank = cardId - 64 + 1
      const cardName =
        rank <= 10
          ? `${rank} of Pentacles`
          : rank === 11
            ? "Page of Pentacles"
            : rank === 12
              ? "Knight of Pentacles"
              : rank === 13
                ? "Queen of Pentacles"
                : "King of Pentacles"
      return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(cardName)}`
    }

    // フォールバック
    return `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(`Tarot Card ${cardId}`)}`
  } catch (error) {
    console.error("Error generating backup image URL:", error)
    return `/placeholder.svg?height=300&width=200&query=Tarot Card`
  }
}
