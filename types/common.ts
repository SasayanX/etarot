// 共通の型定義

export type SoundType = "flip" | "shuffle" | "match" | "success" | "wrong" | "whistle" | "correct" | "incorrect"

export type CardSuitId = 
  | "default"
  | "mystic"
  | "golden"
  | "cosmic"
  | "royal"
  | "moonlight"
  | "crystal"
  | "dragon"
  | "goldenDragon"
  | "fourSymbols"
  | "elemental"
  | "sakura"
  | "halloween"
  | "winter"
  | "snowQueen"

export type FortuneType = "daily" | "love" | "career" | "money" | "decision"

export type Difficulty = "easy" | "medium" | "hard"

export type QuizCategory = "meaning" | "symbol" | "history" | "element" | "astrology"

export type Language = "ja" | "en"

export interface ImageLoadState {
  loaded: boolean
  error: boolean
  src: string
}

export interface CardBackInfo {
  suitId: CardSuitId
  imageUrl: string
  timestamp: number
}

export interface AdDebugInfo {
  lastAdShownTime: number
  timeSinceLastAd: number
  adInterval: number
  isWebView: boolean
}

export interface QuizResult {
  isCorrect: boolean
  points: number
  questionIndex: number
}

export interface GameState {
  combo: number
  consecutiveMatches: number
  score: number
  timeRemaining?: number
}

export interface CardState {
  id: number
  cardId: number
  name: string
  image: string
  isFlipped: boolean
  isMatched: boolean
  isSelected: boolean
}

// イベント型定義
export interface CardSuitChangeEvent extends CustomEvent {
  detail: {
    suitId: CardSuitId
    imageUrl: string
    timestamp: number
  }
}

export interface PointsUpdateEvent extends CustomEvent {
  detail: {
    points: number
    change: number
    source: string
  }
}

// ユーティリティ型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
