export interface TarotCard {
  id: string
  name: string
  suit: string
  number?: number | string
  arcana: "major" | "minor"
  image: string
  backImage?: string
  keywords?: string[]
  element?: string
  astrology?: string
  description?: string
}

export interface TarotCardDetails {
  id: string
  name: string
  meaning: string
  uprightMeaning: string
  reversedMeaning: string
  keywords: string[]
  element: string
  astrology?: string
  numerology?: string
  funFact?: string
}

export interface CardStatus {
  id: string
  loaded: boolean
  error: boolean
}
