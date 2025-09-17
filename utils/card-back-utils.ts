/**
 * カードバックの選択と表示を管理するユーティリティ関数
 */

// カードバックのマッピング（IDとURL）
export const CARD_BACKS_URLS: Record<string, string> = {
  default: "/default-tarot-card-back.png",
  moonlight: "/moonlight-tarot-card-back.png",
  crystal: "/crystal-tarot-card-back.png",
  cosmic: "/cosmic-tarot-back.png",
  royal: "/royal-tarot-card-back.png",
  mystic: "/mystic-tarot-back.png",
  golden: "/golden-tarot-back.png",
  dragon: "/dragon-tarot-back.png",
  sakura: "/cardback-sakura.png",
  halloween: "/cardback-halloween.png",
  winter: "/winter-tarot-back.png",
  elemental: "/four-symbols-tarot-back.png",
  "four-symbols": "/four-symbols-tarot-back.png",
  "snow-queen": "/snow-queen-tarot-back.png",
  "golden-dragon": "/default-tarot-card-back.png",
  "cardback-winter": "/cardback-winter.png",
  "cardback-halloween": "/cardback-halloween.png",
  "cardback-sakura": "/cardback-sakura.png",
  "cardback-elemental": "/cardback-elemental.png",
}

// デフォルトのカードバック画像パス
const DEFAULT_CARD_BACK = "/default-tarot-card-back.png"

/**
 * 現在選択されているカードバックのURLを取得する
 * @returns カードバックのURL
 */
export function getSelectedCardBackUrl(): string {
  if (typeof window === "undefined") {
    return DEFAULT_CARD_BACK
  }

  try {
    // ローカルストレージからカードバック画像を取得
    const storedCardBack = localStorage.getItem("selectedCardBack")

    // デバッグ情報
    console.log("Getting selected card back:", storedCardBack || DEFAULT_CARD_BACK)

    return storedCardBack || DEFAULT_CARD_BACK
  } catch (error) {
    console.error("カードバック取得エラー:", error)
    return DEFAULT_CARD_BACK
  }
}

/**
 * カードバックの選択を保存する
 * @param imageUrl カードバックのURL
 */
export function setSelectedCardBack(imageUrl: string): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    // ローカルストレージにカードバック画像を保存
    localStorage.setItem("selectedCardBack", imageUrl)

    // デバッグ情報
    console.log("Setting selected card back:", imageUrl)

    // カードバック変更イベントを発火
    const event = new CustomEvent("cardSuitChanged", {
      detail: { imageUrl },
    })
    window.dispatchEvent(event)
  } catch (error) {
    console.error("カードバック保存エラー:", error)
  }
}

/**
 * カードバックの初期化を行う
 * 初回起動時やリフレッシュ時に呼び出す
 */
export function initializeCardBack(): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    // 現在のカードバックを取得
    const currentCardBack = getSelectedCardBackUrl()

    // デバッグ情報
    console.log("Initializing card back:", currentCardBack)

    // カードバック初期化イベントを発火
    const event = new CustomEvent("cardSuitRefresh", {
      detail: { imageUrl: currentCardBack },
    })
    window.dispatchEvent(event)
  } catch (error) {
    console.error("カードバック初期化エラー:", error)
  }
}

/**
 * カードバックIDからURLを取得する
 * @param suitId カードバックID
 * @returns カードバックのURL
 */
export function getCardBackUrlById(suitId: string): string {
  return CARD_BACKS_URLS[suitId] || DEFAULT_CARD_BACK
}
