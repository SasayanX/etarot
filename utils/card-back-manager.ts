// カードバックマネージャー
// カードバックの選択と管理を行う

// 金南輝能デザインのURLを定数として定義
export const GOLDEN_DRAGON_URL = "/default-tarot-card-back.png"

// カードバックのマッピング（ID → 画像パス）
export const CARD_BACK_MAPPING: Record<string, string> = {
  default: "/default-tarot-card-back.png",
  moonlight: "/moonlight-tarot-card-back.png",
  crystal: "/crystal-tarot-card-back.png",
  golden: "/golden-tarot-back.png",
  mystic: "/mystic-tarot-back.png",
  royal: "/royal-tarot-card-back.png",
  cosmic: "/cosmic-tarot-back.png",
  sakura: "/cardback-sakura.png",
  halloween: "/cardback-halloween.png",
  winter: "/winter-tarot-back.png",
  elemental: "/four-symbols-tarot-back.png",
  "four-symbols": "/four-symbols-tarot-back.png",
  fourSymbols: "/four-symbols-tarot-back.png",
  "snow-queen": "/snow-queen-tarot-back.png",
  snowQueen: "/snow-queen-tarot-back.png",
  dragon: "/dragon-tarot-back.png",
  "golden-dragon": "/default-tarot-card-back.png",
  goldenDragon: "/default-tarot-card-back.png",
}

// ストレージキー
const STORAGE_KEYS = {
  SELECTED_SUIT: "selectedSuit",
  SELECTED_CARD_BACK: "selectedCardBack",
  OWNED_SUITS: "ownedSuits",
  FORTUNE_CARD_BACK: "fortuneCardBack",
  FORTUNE_CARD_BACK_URL: "fortuneCardBackUrl",
  SESSION_SUIT_ID: "sessionSuitId",
  SESSION_CARD_BACK: "sessionCardBack",
}

// 初期化フラグ
let isInitialized = false

// 現在選択されているカードバックの情報
let currentCardBackInfo = {
  id: "default",
  imageUrl: "/default-tarot-card-back.png",
  timestamp: Date.now(),
}

// 最後に選択されたカードバックの情報をストレージに保存
function saveToStorage(suitId: string, imageUrl: string) {
  if (typeof window === "undefined") return

  try {
    // セッションストレージに保存（ページリロード間で保持）
    sessionStorage.setItem(STORAGE_KEYS.SESSION_SUIT_ID, suitId)
    sessionStorage.setItem(STORAGE_KEYS.SESSION_CARD_BACK, imageUrl)

    // ローカルストレージにも保存（長期保存）
    localStorage.setItem(STORAGE_KEYS.SELECTED_SUIT, suitId)
    localStorage.setItem(STORAGE_KEYS.SELECTED_CARD_BACK, imageUrl)
    localStorage.setItem(STORAGE_KEYS.FORTUNE_CARD_BACK, suitId)
    localStorage.setItem(STORAGE_KEYS.FORTUNE_CARD_BACK_URL, imageUrl)

    console.log(`[CardBackManager] Saved to storage: ${suitId}, ${imageUrl}`)

    // 特にドラゴンの場合は、確実に保存されるように追加の処理
    if (suitId === "dragon") {
      // 所有スーツリストにドラゴンが含まれていることを確認
      ensureDragonInOwnedSuits()
    }
  } catch (error) {
    console.error("[CardBackManager] Error saving to storage:", error)
  }
}

// ドラゴンが所有スーツリストに含まれていることを確認
function ensureDragonInOwnedSuits() {
  try {
    const ownedSuitsStr = localStorage.getItem(STORAGE_KEYS.OWNED_SUITS)
    if (ownedSuitsStr) {
      const ownedSuits = JSON.parse(ownedSuitsStr)
      if (Array.isArray(ownedSuits) && !ownedSuits.includes("dragon")) {
        ownedSuits.push("dragon")
        localStorage.setItem(STORAGE_KEYS.OWNED_SUITS, JSON.stringify(ownedSuits))
        console.log("[CardBackManager] Added dragon to owned suits")
      }
    }
  } catch (error) {
    console.error("[CardBackManager] Error ensuring dragon in owned suits:", error)
  }
}

// セッションストレージから最後に選択されたカードバックの情報を取得
function getFromSessionStorage(): { suitId: string; imageUrl: string } | null {
  if (typeof window === "undefined") return null

  try {
    const suitId = sessionStorage.getItem(STORAGE_KEYS.SESSION_SUIT_ID)
    const imageUrl = sessionStorage.getItem(STORAGE_KEYS.SESSION_CARD_BACK)

    if (suitId && imageUrl) {
      console.log(`[CardBackManager] Retrieved from session storage: ${suitId}, ${imageUrl}`)
      return { suitId, imageUrl }
    }
  } catch (error) {
    console.error("[CardBackManager] Error retrieving from session storage:", error)
  }

  return null
}

// 所有スーツリストを取得
export function getOwnedSuits(): string[] {
  if (typeof window === "undefined") return ["default"]

  try {
    const savedOwnedSuits = localStorage.getItem(STORAGE_KEYS.OWNED_SUITS)
    if (savedOwnedSuits) {
      const parsedSuits = JSON.parse(savedOwnedSuits)
      if (Array.isArray(parsedSuits)) {
        return parsedSuits
      }
    }
  } catch (error) {
    console.error("[CardBackManager] Error parsing owned suits:", error)
  }

  return ["default"]
}

// IDの正規化（ハイフン付きとキャメルケースの両方に対応）
export function normalizeCardBackId(id: string): string {
  if (id === "fourSymbols") return "four-symbols"
  if (id === "snowQueen") return "snow-queen"
  if (id === "goldenDragon") return "golden-dragon"
  return id
}

// カードバックの監視リスナーを登録
export function initCardBackManager() {
  if (typeof window === "undefined") return

  console.log("[CardBackManager] Initializing")

  try {
    // すでに初期化済みの場合は、現在の状態を更新するだけ
    if (isInitialized) {
      console.log("[CardBackManager] Already initialized, refreshing state")
      refreshCardBackState()
      return
    }

    // まずセッションストレージをチェック（最も優先度が高い）
    const sessionData = getFromSessionStorage()
    if (sessionData) {
      currentCardBackInfo = {
        id: sessionData.suitId,
        imageUrl: sessionData.imageUrl,
        timestamp: Date.now(),
      }
      console.log(`[CardBackManager] Initialized from session storage: ${sessionData.suitId}, ${sessionData.imageUrl}`)

      // ローカルストレージも更新
      saveToStorage(sessionData.suitId, sessionData.imageUrl)
    } else {
      // セッションストレージになければローカルストレージをチェック
      const storedSuitId = localStorage.getItem(STORAGE_KEYS.SELECTED_SUIT) || "default"
      const storedCardBackUrl = localStorage.getItem(STORAGE_KEYS.SELECTED_CARD_BACK) || "/default-tarot-card-back.png"

      // 所有スーツのリストを取得して検証
      const ownedSuitsList = getOwnedSuits()

      // 選択されたスーツが所有されているか確認
      const isOwned = ownedSuitsList.includes(storedSuitId)
      const finalSuitId = isOwned ? storedSuitId : "default"

      // 選択されたカードバックのURLを検証
      let finalImageUrl = isOwned ? storedCardBackUrl : "/default-tarot-card-back.png"

      // URLが空または無効な場合、マッピングから取得するか、デフォルトを使用
      if (!finalImageUrl || finalImageUrl === "undefined" || finalImageUrl === "null") {
        finalImageUrl = CARD_BACK_MAPPING[finalSuitId] || "/default-tarot-card-back.png"
      }

      // 重要: 常にローカルストレージとセッションストレージを更新して一貫性を保つ
      saveToStorage(finalSuitId, finalImageUrl)

      currentCardBackInfo = {
        id: finalSuitId,
        imageUrl: finalImageUrl,
        timestamp: Date.now(),
      }

      console.log(`[CardBackManager] Initialized with suit: ${finalSuitId}, imageUrl: ${finalImageUrl}`)
    }

    // カードスーツ変更イベントのリスナーを設定
    window.addEventListener("cardSuitChanged", handleCardSuitChange)
    window.addEventListener("cardSuitRefresh", handleCardSuitChange)

    // ページ遷移後の状態復元のためにpopstateイベントをリッスン
    window.addEventListener("popstate", () => {
      console.log("[CardBackManager] popstate event detected, refreshing state")
      setTimeout(refreshCardBackState, 100)
    })

    // ページ表示状態変更時のリスナー
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("[CardBackManager] Page became visible, refreshing state")
        refreshCardBackState()
      }
    })

    // グローバル関数として公開
    if (typeof window !== "undefined") {
      ;(window as any).selectCardBack = selectCardBack
      ;(window as any).getCurrentCardBackUrl = getCurrentCardBackUrl
      ;(window as any).refreshCardBackState = refreshCardBackState
      ;(window as any).getOwnedSuits = getOwnedSuits
      ;(window as any).normalizeCardBackId = normalizeCardBackId
      ;(window as any).addSuitToOwned = addSuitToOwned
    }

    // 初期化完了
    isInitialized = true

    // 初期化後に初期値でイベントを発火
    dispatchCardBackChangeEvent(currentCardBackInfo.id, currentCardBackInfo.imageUrl)

    // 定期的に状態を更新するタイマーを設定
    setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshCardBackState()
      }
    }, 3000) // 3秒ごとに更新
  } catch (error) {
    console.error("[CardBackManager] Initialization error:", error)
    // エラー時はデフォルト値を設定
    currentCardBackInfo = {
      id: "default",
      imageUrl: "/default-tarot-card-back.png",
      timestamp: Date.now(),
    }

    // エラー時もイベントを発火して通知
    dispatchCardBackChangeEvent("default", "/default-tarot-card-back.png")
  }

  // 初期化後に状態を確認し、必要に応じて再保存
  setTimeout(() => {
    const storedSuitId = localStorage.getItem(STORAGE_KEYS.SELECTED_SUIT)

    // ドラゴンが選択されている場合は特別処理
    if (storedSuitId === "dragon") {
      console.log("[CardBackManager] Ensuring dragon card back is properly saved")
      selectCardBack("dragon", CARD_BACK_MAPPING.dragon)
      ensureDragonInOwnedSuits()
    }
  }, 500)
}

// 所有スーツリストにスーツを追加
export function addSuitToOwned(suitId: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const normalizedId = normalizeCardBackId(suitId)
    const ownedSuits = getOwnedSuits()

    if (!ownedSuits.includes(normalizedId)) {
      ownedSuits.push(normalizedId)
      localStorage.setItem(STORAGE_KEYS.OWNED_SUITS, JSON.stringify(ownedSuits))
      console.log(`[CardBackManager] Added ${normalizedId} to owned suits`)

      // イベントを発火して他のコンポーネントに通知
      const event = new CustomEvent("ownedSuitsChanged", {
        detail: {
          ownedSuits,
          addedSuit: normalizedId,
          timestamp: Date.now(),
        },
        bubbles: true,
        cancelable: true,
      })
      window.dispatchEvent(event)

      return true
    }

    return false
  } catch (error) {
    console.error("[CardBackManager] Error adding suit to owned:", error)
    return false
  }
}

// 現在のカードバック状態を更新する
export function refreshCardBackState() {
  if (typeof window === "undefined") return

  try {
    // まずセッションストレージをチェック（最も優先度が高い）
    const sessionData = getFromSessionStorage()

    if (sessionData) {
      // セッションストレージにデータがある場合はそれを使用
      currentCardBackInfo = {
        id: sessionData.suitId,
        imageUrl: sessionData.imageUrl,
        timestamp: Date.now(),
      }

      // ローカルストレージも更新
      saveToStorage(sessionData.suitId, sessionData.imageUrl)

      console.log(`[CardBackManager] Refreshed state from session: ${sessionData.suitId}, ${sessionData.imageUrl}`)

      // 更新された状態でイベントを発火
      dispatchCardBackChangeEvent(sessionData.suitId, sessionData.imageUrl)

      return true
    }

    // セッションストレージにデータがない場合はローカルストレージから取得
    const storedSuitId = localStorage.getItem(STORAGE_KEYS.SELECTED_SUIT) || "default"
    const storedCardBackUrl = localStorage.getItem(STORAGE_KEYS.SELECTED_CARD_BACK) || "/default-tarot-card-back.png"

    // URLが無効な場合はマッピングから取得
    const validImageUrl =
      storedCardBackUrl && storedCardBackUrl !== "undefined" && storedCardBackUrl !== "null"
        ? storedCardBackUrl
        : CARD_BACK_MAPPING[storedSuitId] || "/default-tarot-card-back.png"

    // 常にローカルストレージとセッションストレージを更新して一貫性を保つ
    saveToStorage(storedSuitId, validImageUrl)

    // 現在の状態を更新
    currentCardBackInfo = {
      id: storedSuitId,
      imageUrl: validImageUrl,
      timestamp: Date.now(),
    }

    console.log(`[CardBackManager] Refreshed state from local: ${storedSuitId}, ${validImageUrl}`)

    // 更新された状態でイベントを発火
    dispatchCardBackChangeEvent(storedSuitId, validImageUrl)

    return true
  } catch (error) {
    console.error("[CardBackManager] Refresh error:", error)
    return false
  }
}

// カードスーツ変更イベントのハンドラー
function handleCardSuitChange(event: Event) {
  try {
    // イベントの詳細を取得
    const customEvent = event as CustomEvent
    if (customEvent.detail) {
      const { suitId, imageUrl } = customEvent.detail

      // 有効なURLかチェック
      let validImageUrl = imageUrl || CARD_BACK_MAPPING[suitId] || "/default-tarot-card-back.png"

      // IDの正規化
      const normalizedSuitId = normalizeCardBackId(suitId)

      // 正規化したIDに基づいて画像URLを再取得
      if (normalizedSuitId !== suitId) {
        validImageUrl = CARD_BACK_MAPPING[normalizedSuitId] || validImageUrl
      }

      currentCardBackInfo = {
        id: normalizedSuitId,
        imageUrl: validImageUrl,
        timestamp: Date.now(),
      }

      console.log(`[CardBackManager] Card suit changed to: ${normalizedSuitId}, imageUrl: ${validImageUrl}`)

      // ストレージを更新
      saveToStorage(normalizedSuitId, validImageUrl)

      // グローバル変数として保存
      if (typeof window !== "undefined") {
        ;(window as any).cardBackInfo = {
          suitId: normalizedSuitId,
          imageUrl: validImageUrl,
          timestamp: Date.now(),
        }
      }
    } else {
      // デフォルト値を使用
      const storedSuitId = localStorage.getItem(STORAGE_KEYS.SELECTED_SUIT) || "default"
      const storedCardBackUrl = localStorage.getItem(STORAGE_KEYS.SELECTED_CARD_BACK) || "/default-tarot-card-back.png"

      currentCardBackInfo = {
        id: storedSuitId,
        imageUrl: storedCardBackUrl,
        timestamp: Date.now(),
      }

      // ストレージを更新
      saveToStorage(storedSuitId, storedCardBackUrl)
    }
  } catch (error) {
    console.error("[CardBackManager] Error handling card suit change:", error)
  }
}

// カードバック変更イベントを発火
export function dispatchCardBackChangeEvent(suitId = currentCardBackInfo.id, imageUrl = currentCardBackInfo.imageUrl) {
  if (typeof window === "undefined") return

  try {
    // IDの正規化
    const normalizedSuitId = normalizeCardBackId(suitId)

    // 正規化したIDに基づいて画像URLを再取得
    let validImageUrl = imageUrl
    if (normalizedSuitId !== suitId) {
      validImageUrl = CARD_BACK_MAPPING[normalizedSuitId] || imageUrl
    }

    const event = new CustomEvent("cardSuitChanged", {
      detail: {
        suitId: normalizedSuitId,
        imageUrl: validImageUrl,
        timestamp: Date.now(),
      },
      bubbles: true,
      cancelable: true,
    })

    window.dispatchEvent(event)
    console.log(`[CardBackManager] Dispatched cardSuitChanged event: ${normalizedSuitId}, ${validImageUrl}`)

    // グローバル変数として保存
    ;(window as any).cardBackInfo = {
      suitId: normalizedSuitId,
      imageUrl: validImageUrl,
      timestamp: Date.now(),
    }

    return true
  } catch (error) {
    console.error("[CardBackManager] Error dispatching event:", error)
    return false
  }
}

// 現在選択されているカードバックの画像URLを取得
export function getCurrentCardBackUrl(): string {
  if (typeof window === "undefined") {
    return "/default-tarot-card-back.png"
  }

  try {
    // まずグローバル変数をチェック
    if ((window as any).cardBackInfo && (window as any).cardBackInfo.imageUrl) {
      return (window as any).cardBackInfo.imageUrl
    }

    // 次にセッションストレージをチェック
    const sessionImageUrl = sessionStorage.getItem(STORAGE_KEYS.SESSION_CARD_BACK)
    if (sessionImageUrl && sessionImageUrl !== "undefined" && sessionImageUrl !== "null") {
      return sessionImageUrl
    }

    // 次にローカルストレージをチェック
    const storedCardBackUrl = localStorage.getItem(STORAGE_KEYS.SELECTED_CARD_BACK)
    if (storedCardBackUrl && storedCardBackUrl !== "undefined" && storedCardBackUrl !== "null") {
      return storedCardBackUrl
    }

    // 保存されていない場合は現在のメモリ内の状態を返す
    if (currentCardBackInfo.imageUrl) {
      return currentCardBackInfo.imageUrl
    }

    // どれも無効な場合はデフォルトを返す
    return "/default-tarot-card-back.png"
  } catch (error) {
    console.error("カードバック取得エラー:", error)
    return "/default-tarot-card-back.png"
  }
}

// カードバックを選択
export function selectCardBack(suitId: string, imageUrl?: string): boolean {
  if (typeof window === "undefined") return false

  try {
    // IDの正規化
    const normalizedSuitId = normalizeCardBackId(suitId)

    // 正規化したIDに基づいて画像URLを取得
    const finalImageUrl = imageUrl || CARD_BACK_MAPPING[normalizedSuitId] || "/default-tarot-card-back.png"

    // 現在の状態を更新
    currentCardBackInfo = {
      id: normalizedSuitId,
      imageUrl: finalImageUrl,
      timestamp: Date.now(),
    }

    // ストレージを更新
    saveToStorage(normalizedSuitId, finalImageUrl)

    // グローバル変数として保存
    ;(window as any).cardBackInfo = {
      suitId: normalizedSuitId,
      imageUrl: finalImageUrl,
      timestamp: Date.now(),
    }

    console.log(`[CardBackManager] Selected card back: ${normalizedSuitId}, ${finalImageUrl}`)

    // イベントを発火
    const event = new CustomEvent("cardSuitChanged", {
      detail: {
        suitId: normalizedSuitId,
        imageUrl: finalImageUrl,
        timestamp: Date.now(),
      },
      bubbles: true,
      cancelable: true,
    })

    window.dispatchEvent(event)

    // 少し遅延させて再度イベントを発火（確実に反映させるため）
    setTimeout(() => {
      const refreshEvent = new CustomEvent("cardSuitRefresh", {
        detail: {
          suitId: normalizedSuitId,
          imageUrl: finalImageUrl,
          timestamp: Date.now() + 1,
        },
        bubbles: true,
        cancelable: true,
      })
      window.dispatchEvent(refreshEvent)

      // 追加: 再度ストレージを更新して確実に保存
      saveToStorage(normalizedSuitId, finalImageUrl)
    }, 100)

    return true
  } catch (error) {
    console.error("[CardBackManager] Error selecting card back:", error)
    return false
  }
}

// 選択されているカードバックを取得する関数
export function getSelectedCardBack(): string {
  if (typeof window === "undefined") return "default"

  try {
    const storedSuitId = localStorage.getItem(STORAGE_KEYS.SELECTED_SUIT)
    if (storedSuitId && storedSuitId !== "undefined" && storedSuitId !== "null") {
      return storedSuitId
    }

    // フォールバックとして現在のメモリ内の状態を返す
    if (currentCardBackInfo.id) {
      return currentCardBackInfo.id
    }

    return "default"
  } catch (error) {
    console.error("[CardBackManager] Error getting selected card back:", error)
    return "default"
  }
}

// カードバックを設定する関数
export function setSelectedCardBack(cardBackId: string): void {
  if (typeof window === "undefined") return

  try {
    // IDの正規化
    const normalizedSuitId = normalizeCardBackId(cardBackId)

    // 対応する画像URLを取得
    const imageUrl = CARD_BACK_MAPPING[normalizedSuitId] || "/default-tarot-card-back.png"

    // selectCardBack関数を使用して設定
    selectCardBack(normalizedSuitId, imageUrl)

    console.log(`[CardBackManager] Set selected card back: ${normalizedSuitId}, ${imageUrl}`)
  } catch (error) {
    console.error("[CardBackManager] Error setting selected card back:", error)
  }
}

// アプリケーション起動時に初期化
if (typeof window !== "undefined") {
  // DOMContentLoadedイベントで初期化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCardBackManager)
  } else {
    // すでにDOMが読み込まれている場合は直接初期化
    initCardBackManager()
  }

  // ページの表示状態が変わったときに再初期化
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      refreshCardBackState()
    }
  })

  // ページ遷移後にも状態を復元
  window.addEventListener("load", () => {
    console.log("[CardBackManager] Window load event, refreshing state")
    setTimeout(refreshCardBackState, 100)
  })

  // ページ遷移を検知して状態を更新
  window.addEventListener("popstate", () => {
    console.log("[CardBackManager] Navigation detected (popstate), refreshing state")
    setTimeout(refreshCardBackState, 100)
  })

  // Next.jsのルーター変更を検知（可能な場合）
  if (typeof window.history.pushState === "function") {
    const originalPushState = window.history.pushState
    window.history.pushState = function () {
      const result = originalPushState.apply(this, arguments as any)
      console.log("[CardBackManager] Navigation detected (pushState), refreshing state")
      setTimeout(refreshCardBackState, 100)
      return result
    }
  }
}
