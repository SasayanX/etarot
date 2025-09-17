// 小アルカナカードのIDから画像URLを取得する関数
export function getMinorArcanaImageUrlFromId(cardId: number): string | null {
  // 大アルカナの場合はnullを返す
  if (cardId < 22) return null

  // カードIDから小アルカナのスートと数字を計算
  const suitIndex = Math.floor((cardId - 22) / 14)
  const valueIndex = (cardId - 22) % 14

  // スートの配列
  const suits = ["wands", "cups", "swords", "pentacles"]

  // 値の配列（1-10, ページ, ナイト, クイーン, キング）
  const values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "page", "knight", "queen", "king"]

  // 有効な範囲内かチェック
  if (suitIndex >= 0 && suitIndex < suits.length && valueIndex >= 0 && valueIndex < values.length) {
    const suit = suits[suitIndex]
    const value = values[valueIndex]

    // Wikimedia Commonsの画像URLを生成
    return `https://upload.wikimedia.org/wikipedia/commons/${getMinorArcanaWikiPath(suit, value)}`
  }

  return null
}

// 小アルカナカードの日本語名を取得する関数
export function getMinorArcanaNameJaFromId(cardId: number): string | null {
  // 大アルカナの場合はnullを返す
  if (cardId < 22) return null

  // カードIDから小アルカナのスートと数字を計算
  const suitIndex = Math.floor((cardId - 22) / 14)
  const valueIndex = (cardId - 22) % 14

  // スートの日本語名
  const suitsJa = ["ワンド", "カップ", "ソード", "ペンタクル"]

  // 値の日本語名
  const valuesJa = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "ページ", "ナイト", "クイーン", "キング"]

  // 有効な範囲内かチェック
  if (suitIndex >= 0 && suitIndex < suitsJa.length && valueIndex >= 0 && valueIndex < valuesJa.length) {
    return `${suitsJa[suitIndex]}の${valuesJa[valueIndex]}`
  }

  return null
}

// Wikimedia Commonsのパスを取得する関数
function getMinorArcanaWikiPath(suit: string, value: string): string {
  // スートと値に基づいてWikimedia Commonsのパスを返す
  const paths: Record<string, Record<string, string>> = {
    wands: {
      "1": "1/11/Wands01.jpg", // 修正済み
      "2": "2/2b/Wands02.jpg",
      "3": "f/ff/Wands03.jpg",
      "4": "a/a4/Wands04.jpg",
      "5": "9/9d/Wands05.jpg",
      "6": "3/3b/Wands06.jpg",
      "7": "e/e4/Wands07.jpg",
      "8": "6/6b/Wands08.jpg",
      "9": "4/4d/Wands09.jpg", // 確認済み
      "10": "0/0b/Wands10.jpg",
      page: "e/ec/Wands11.jpg", // 確認済み
      knight: "1/16/Wands12.jpg",
      queen: "0/0d/Wands13.jpg",
      king: "c/ce/Wands14.jpg",
    },
    cups: {
      // 他のカードのパスは変更なし
      "1": "3/36/Cups01.jpg",
      "2": "f/f8/Cups02.jpg",
      "3": "7/7a/Cups03.jpg",
      "4": "3/35/Cups04.jpg",
      "5": "d/d7/Cups05.jpg",
      "6": "1/17/Cups06.jpg",
      "7": "a/ae/Cups07.jpg",
      "8": "6/60/Cups08.jpg",
      "9": "2/24/Cups09.jpg",
      "10": "8/84/Cups10.jpg",
      page: "a/ad/Cups11.jpg",
      knight: "f/fa/Cups12.jpg",
      queen: "6/62/Cups13.jpg",
      king: "0/04/Cups14.jpg",
    },
    swords: {
      // 他のカードのパスは変更なし
      "1": "1/1a/Swords01.jpg",
      "2": "9/9e/Swords02.jpg",
      "3": "0/02/Swords03.jpg",
      "4": "b/bf/Swords04.jpg",
      "5": "2/23/Swords05.jpg",
      "6": "2/29/Swords06.jpg",
      "7": "3/34/Swords07.jpg",
      "8": "a/a7/Swords08.jpg",
      "9": "2/2f/Swords09.jpg",
      "10": "d/d4/Swords10.jpg",
      page: "4/4c/Swords11.jpg",
      knight: "b/b0/Swords12.jpg",
      queen: "d/d4/Swords13.jpg",
      king: "3/33/Swords14.jpg",
    },
    pentacles: {
      // 他のカードのパスは変更なし
      "1": "f/fd/Pents01.jpg",
      "2": "9/9f/Pents02.jpg",
      "3": "4/42/Pents03.jpg",
      "4": "3/35/Pents04.jpg",
      "5": "9/96/Pents05.jpg",
      "6": "a/a6/Pents06.jpg",
      "7": "6/6a/Pents07.jpg",
      "8": "4/49/Pents08.jpg",
      "9": "f/f0/Pents09.jpg",
      "10": "4/42/Pents10.jpg",
      page: "e/ec/Pents11.jpg",
      knight: "d/d5/Pents12.jpg",
      queen: "8/88/Pents13.jpg",
      king: "1/1c/Pents14.jpg",
    },
  }

  return paths[suit]?.[value] || ""
}
