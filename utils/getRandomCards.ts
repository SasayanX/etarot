/**
 * ランダムなカードIDを生成する関数
 * @param count 生成するカードの数
 * @param excludeIds 除外するカードID（オプション）
 * @returns ランダムなカードIDの配列
 */
export function getRandomCards(count: number, excludeIds: number[] = []): number[] {
  // 大アルカナの全カードID（0-21）
  const allCardIds = Array.from({ length: 22 }, (_, i) => i)

  // 除外するIDを除いたカードIDの配列を作成
  const availableCardIds = allCardIds.filter((id) => !excludeIds.includes(id))

  // Fisher-Yatesアルゴリズムでシャッフル
  const shuffled = [...availableCardIds]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // 指定された数だけ取得
  return shuffled.slice(0, count)
}
