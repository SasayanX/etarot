// カードの詳細情報をインデックス化するファイル
import type { TarotCard } from "../types/card"
import { majorArcanaCards as majorArcana } from "./tarot-major-arcana"
import { cupsCards as cups } from "./tarot-cups"
import { pentaclesCards as pentacles } from "./tarot-pentacles"
import { swordsCards as swords } from "./tarot-swords" // swordsCards を swords としてインポート
import { wandsCards as wands } from "./tarot-wands"

// カード詳細データを全てのカードタイプから結合
export const cardDetailsData: TarotCard[] = [...majorArcana, ...cups, ...pentacles, ...swords, ...wands]

// カードIDによる検索用のマップを作成
export const cardDetailsMap = new Map<string, TarotCard>()

// 全てのカードをマップに追加
cardDetailsData.forEach((card) => {
  cardDetailsMap.set(card.id.toString(), card)
})

// IDでカードを検索する関数
export function getCardById(id: string): TarotCard | undefined {
  return cardDetailsMap.get(id)
}

// カードタイプでカードをフィルタリングする関数
export function getCardsByType(type: string): TarotCard[] {
  return cardDetailsData.filter((card) => card.type === type)
}

// カードの名前で検索する関数
export function getCardByName(name: string): TarotCard | undefined {
  return cardDetailsData.find((card) => card.name.toLowerCase() === name.toLowerCase())
}

// キーワードでカードを検索する関数
export function searchCardsByKeyword(keyword: string): TarotCard[] {
  const lowerKeyword = keyword.toLowerCase()
  return cardDetailsData.filter(
    (card) =>
      card.name.toLowerCase().includes(lowerKeyword) ||
      (card.meaningUpright && card.meaningUpright.toLowerCase().includes(lowerKeyword)) ||
      (card.meaningReversed && card.meaningReversed.toLowerCase().includes(lowerKeyword)) ||
      (card.description && card.description.toLowerCase().includes(lowerKeyword)),
  )
}

// ランダムなカードを取得する関数
export function getRandomCard(): TarotCard {
  const randomIndex = Math.floor(Math.random() * cardDetailsData.length)
  return cardDetailsData[randomIndex]
}

// ランダムな複数のカードを取得する関数
export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...cardDetailsData].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
