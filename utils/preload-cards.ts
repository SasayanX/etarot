// カード画像をプリロードするユーティリティ関数
export const preloadNewCardImages = () => {
  console.log("Preloading card images...")

  // メジャーアルカナのプリロード
  for (let i = 0; i <= 21; i++) {
    const img = new Image()
    img.src = `/rider-waite-${i}.png`
    img.onerror = () => {
      console.log(`Failed to preload major arcana card ${i}, trying alternative source`)
      img.src = `/placeholder.svg?height=400&width=250&query=tarot%20card%20${i}`
    }
  }

  // カップスートのプリロード
  preloadSuitImages("cups")

  // ワンドスートのプリロード
  preloadSuitImages("wands")

  // ペンタクルスートのプリロード
  preloadSuitImages("pentacles")

  // ソードスートのプリロード
  preloadSuitImages("swords")

  console.log("Card preloading initiated")
}

// スート別のカード画像をプリロードする関数
const preloadSuitImages = (suit: string) => {
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  const courts = ["page", "knight", "queen", "king"]

  // 拡張子を決定
  const getExtension = (suit: string, cardType: string): string => {
    if (
      suit === "swords" &&
      (cardType === "page" || cardType === "knight" || cardType === "queen" || cardType === "king")
    ) {
      return ".png" // ソードスートのコートカードはpng
    }
    return ".jpg" // その他はjpg
  }

  // 数字カードのプリロード
  numbers.forEach((num) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // CORS問題を回避
    const extension = getExtension(suit, num)

    // スートに応じたファイル名の生成
    let fileName = ""
    if (suit === "swords") {
      fileName = `${num}-of-swords${extension}`
    } else if (suit === "pentacles") {
      fileName = `${num}-of-pentacles${extension}`
    } else {
      // cups と wands の場合
      fileName = `${num}-of-${suit.slice(0, -1)}${extension}`
    }

    img.src = `/images/${suit}/${fileName}`
    console.log(`Preloading: /images/${suit}/${fileName}`)

    img.onload = () => {
      console.log(`Successfully preloaded ${suit} card ${num}`)
    }

    img.onerror = (e) => {
      console.warn(`Failed to preload ${suit} card ${num}, trying alternative source: ${e}`)
      // バックアップ画像の読み込み
      img.src = `/placeholder.svg?height=400&width=250&query=tarot%20card%20${num}%20of%20${suit}`
    }
  })

  // コートカードのプリロード
  courts.forEach((court) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // CORS問題を回避
    const extension = getExtension(suit, court)

    // スートに応じたファイル名の生成
    let fileName = ""
    if (suit === "swords") {
      fileName = `${court}-of-swords${extension}`
    } else if (suit === "pentacles") {
      fileName = `${court}-of-pentacles${extension}`
    } else {
      // cups と wands の場合
      fileName = `${court}-of-${suit.slice(0, -1)}${extension}`
    }

    img.src = `/images/${suit}/${fileName}`
    console.log(`Preloading: /images/${suit}/${fileName}`)

    img.onload = () => {
      console.log(`Successfully preloaded ${suit} card ${court}`)
    }

    img.onerror = (e) => {
      console.warn(`Failed to preload ${suit} card ${court}, trying alternative source: ${e}`)
      // バックアップ画像の読み込み
      img.src = `/placeholder.svg?height=400&width=250&query=tarot%20card%20${court}%20of%20${suit}`
    }
  })
}

// ソードスートのプレースホルダー画像を特別にプリロードする関数
export const preloadSwordsPlaceholders = () => {
  console.log("Preloading sword suit placeholder images...")

  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
  const courts = ["page", "knight", "queen", "king"]

  // 数字カードのプレースホルダープリロード
  numbers.forEach((num) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // CORS問題を回避

    // まず実際の画像を読み込み、失敗したらプレースホルダーを使用
    img.src = `/images/swords/${num}-of-swords.jpg`

    img.onload = () => {
      console.log(`Successfully preloaded ${num} of swords`)
    }

    img.onerror = () => {
      console.warn(`Failed to load ${num} of swords, trying placeholder`)
      img.src = `/placeholder.svg?height=400&width=250&query=tarot%20card%20${num}%20of%20swords`
    }
  })

  // コートカードのプレースホルダープリロード
  courts.forEach((court) => {
    const img = new Image()
    img.crossOrigin = "anonymous" // CORS問題を回避

    // まず実際の画像を読み込み、失敗したらプレースホルダーを使用
    img.src = `/images/swords/${court}-of-swords.png`

    img.onload = () => {
      console.log(`Successfully preloaded ${court} of swords`)
    }

    img.onerror = () => {
      console.warn(`Failed to load ${court} of swords, trying placeholder`)
      img.src = `/placeholder.svg?height=400&width=250&query=tarot%20card%20${court}%20of%20swords`
    }
  })
}
