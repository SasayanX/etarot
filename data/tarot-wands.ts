import type { TarotCard, TarotCardDetails } from "../types/tarot"

// ワンドのカード
export const wandsCards: TarotCard[] = [
  {
    id: "ace-of-wands",
    name: "エース・オブ・ワンド",
    suit: "wands",
    number: 1,
    arcana: "minor",
    image: "/images/tarot/wands/ace-of-wands.png",
    keywords: ["創造性", "情熱", "新しい始まり"],
    element: "火",
  },
  // 他のカードも同様...
]

// 以下を追加して、ワンドの9が正しく定義されていることを確認します
// 必要に応じて、以下のようなエントリを追加してください
/*
  {
    id: "nine-of-wands",
    name: "9・オブ・ワンド",
    suit: "wands",
    number: 9,
    arcana: "minor",
    image: "/images/tarot/wands/9-of-wands.png",
    keywords: ["忍耐", "持続", "防御"],
    element: "火",
  },
*/

// ワンドのカード詳細情報
export const wandsDetails: Record<string, TarotCardDetails> = {
  "ace-of-wands": {
    id: "ace-of-wands",
    name: "エース・オブ・ワンド",
    meaning: "ワンドのエースは、創造性、情熱、エネルギー、インスピレーションの新たな始まりを表します。",
    uprightMeaning: "創造性、情熱、冒険、新しい始まり、インスピレーション、可能性",
    reversedMeaning: "創造的なブロック、遅延、エネルギーの欠如、熱意の喪失",
    keywords: ["創造性", "情熱", "可能性", "インスピレーション", "冒険"],
    element: "火",
    numerology: "1",
    funFact: "ワンドのエースは、タロットの中で最も創造的なエネルギーと関連が強いカードの一つです。",
  },
  // 他のカードも同様...
}
