/**
 * カードバックのデバッグ用ユーティリティ関数
 */

// ドラゴンカードバックの購入状態を修正
export function fixDragonCardBackPurchase(): boolean {
  try {
    // 現在の購入済みアイテムを取得
    const purchasedItemsStr = localStorage.getItem("purchasedItems")
    const purchasedItems = purchasedItemsStr ? JSON.parse(purchasedItemsStr) : []

    // ドラゴンカードバックが含まれていない場合は追加
    let modified = false
    if (!purchasedItems.includes("dragon")) {
      purchasedItems.push("dragon")
      modified = true
    }

    // 修正した購入済みアイテムを保存
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems))

    return modified
  } catch (error) {
    console.error("ドラゴンカードバックの購入状態修正中にエラーが発生しました:", error)
    return false
  }
}

// クリスタルカードバックの購入状態を修正
export function fixCrystalCardBackPurchase(): boolean {
  try {
    // 現在の購入済みアイテムを取得
    const purchasedItemsStr = localStorage.getItem("purchasedItems")
    const purchasedItems = purchasedItemsStr ? JSON.parse(purchasedItemsStr) : []

    // クリスタルカードバックが含まれていない場合は追加
    let modified = false
    if (!purchasedItems.includes("crystal")) {
      purchasedItems.push("crystal")
      modified = true
    }

    // 修正した購入済みアイテムを保存
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems))

    return modified
  } catch (error) {
    console.error("クリスタルカードバックの購入状態修正中にエラーが発生しました:", error)
    return false
  }
}

// 四神カードバックの購入状態を修正
export function fixFourSymbolsCardBackPurchase(): boolean {
  try {
    // 現在の購入済みアイテムを取得
    const purchasedItemsStr = localStorage.getItem("purchasedItems")
    const purchasedItems = purchasedItemsStr ? JSON.parse(purchasedItemsStr) : []

    // 四神カードバックが含まれていない場合は追加
    let modified = false
    if (!purchasedItems.includes("four-symbols")) {
      purchasedItems.push("four-symbols")
      modified = true
    }

    // 修正した購入済みアイテムを保存
    localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems))

    return modified
  } catch (error) {
    console.error("四神カードバックの購入状態修正中にエラーが発生しました:", error)
    return false
  }
}

// 占いページでのカードバック適用を修正
export function fixFortuneCardBackApplication(): void {
  try {
    // 選択中のカードバックを取得
    const selectedCardBack = localStorage.getItem("selectedCardBack") || "default"

    // 占いページ用のカードバック設定を保存
    localStorage.setItem("fortuneCardBack", selectedCardBack)

    console.log("占いページのカードバック適用を修正しました:", selectedCardBack)
  } catch (error) {
    console.error("占いページのカードバック適用修正中にエラーが発生しました:", error)
  }
}

// すべての問題を一括修正
export function fixAllCardBackIssues(): {
  dragonFixed: boolean
  crystalFixed: boolean
  fourSymbolsFixed: boolean
} {
  const dragonFixed = fixDragonCardBackPurchase()
  const crystalFixed = fixCrystalCardBackPurchase()
  const fourSymbolsFixed = fixFourSymbolsCardBackPurchase()

  fixFortuneCardBackApplication()

  return {
    dragonFixed,
    crystalFixed,
    fourSymbolsFixed,
  }
}
