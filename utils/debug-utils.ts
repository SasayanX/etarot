/**
 * デバッグ用のユーティリティ関数
 */

// 画像の存在確認とデバッグ情報出力
export async function checkImageAndDebug(imagePath: string): Promise<boolean> {
  try {
    console.log(`画像パスの確認: ${imagePath}`)

    // 相対パスの場合は常に存在すると仮定
    if (imagePath.startsWith("/")) {
      console.log(`相対パス: ${imagePath} - 存在チェックをスキップ`)
      return true
    }

    // 画像の存在確認
    const response = await fetch(imagePath, { method: "HEAD" })
    const exists = response.ok

    if (exists) {
      console.log(`✅ 画像が存在します: ${imagePath}`)
    } else {
      console.warn(`❌ 画像が存在しません: ${imagePath} (ステータス: ${response.status})`)
    }

    return exists
  } catch (error) {
    console.error(`画像確認中にエラーが発生: ${imagePath}`, error)
    return false
  }
}

// 画像パスのデバッグ情報を出力
export function logImagePaths(cardId: number): void {
  console.log(`カードID: ${cardId} の画像パス情報:`)

  // 大アルカナ（0-21）
  if (cardId >= 0 && cardId <= 21) {
    console.log(`大アルカナ: /tarot-cards/major-arcana-${cardId}.png`)
  }
  // 小アルカナ - ワンド（22-35）
  else if (cardId >= 22 && cardId <= 35) {
    console.log(`ワンド: /tarot-cards/wands-${cardId - 22 + 1}.png`)
  }
  // 小アルカナ - カップ（36-49）
  else if (cardId >= 36 && cardId <= 49) {
    console.log(`カップ: /tarot-cards/cups-${cardId - 36 + 1}.png`)
  }
  // 小アルカナ - ソード（50-63）
  else if (cardId >= 50 && cardId <= 63) {
    console.log(`ソード: /tarot-cards/swords-${cardId - 50 + 1}.png`)
  }
  // 小アルカナ - ペンタクル（64-77）
  else if (cardId >= 64 && cardId <= 77) {
    console.log(`ペンタクル: /tarot-cards/pentacles-${cardId - 64 + 1}.png`)
  } else {
    console.log(`不明なカードID: ${cardId}`)
  }
}

// 画像読み込みエラーのデバッグ情報を出力
export function logImageError(src: string, error: any): void {
  console.group(`🔍 画像読み込みエラーの詳細`)
  console.error(`画像ソース: ${src}`)
  console.error(`エラー情報:`, error)
  console.log(`ブラウザ: ${navigator.userAgent}`)
  console.groupEnd()
}
