// タロットカードの基本データ
export const majorArcanaNames = [
  "愚者",
  "魔術師",
  "女教皇",
  "女帝",
  "皇帝",
  "教皇",
  "恋人",
  "戦車",
  "力",
  "隠者",
  "運命の輪",
  "正義",
  "吊るされた男",
  "死神",
  "節制",
  "悪魔",
  "塔",
  "星",
  "月",
  "太陽",
  "審判",
  "世界",
]

export const majorArcanaEnglishNames = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World",
]

// 安全なカードIDの配列
export const safeCardIds = Array.from({ length: 22 }, (_, i) => i)

// ランダムな安全なカードを取得する関数
export function getRandomSafeCards(count: number, language: string): any[] {
  const shuffled = [...safeCardIds].sort(() => 0.5 - Math.random())
  const selectedIds = shuffled.slice(0, count)

  return selectedIds.map((id) => ({
    id,
    name:
      id >= 0 && id < 22
        ? language === "en"
          ? majorArcanaEnglishNames[id]
          : majorArcanaNames[id]
        : language === "en"
          ? `Card ${id}`
          : `カード${id}`,
  }))
}

// ラッキーアイテムのデータ
export function getLuckyItems(cardId: number, language: string): string[] {
  const luckyItems: { [key: number]: { ja: string[]; en: string[] } } = {
    0: {
      ja: [
        "白いスニーカー",
        "小さなリュック",
        "コンパス",
        "地図",
        "日記帳",
        "オパール",
        "旅行ガイドブック",
        "新しい手帳",
      ],
      en: ["White sneakers", "Small backpack", "Compass", "Map", "Diary", "Opal", "Travel guidebook", "New notebook"],
    },
    1: {
      ja: ["赤いペン", "クリスタル", "キャンドル", "タロットカード", "魔法の杖", "シトリン", "万年筆", "創作ノート"],
      en: ["Red pen", "Crystal", "Candle", "Tarot cards", "Magic wand", "Citrine", "Fountain pen", "Creative notebook"],
    },
    2: {
      ja: [
        "月のアクセサリー",
        "青い石",
        "瞑想クッション",
        "インセンス",
        "鏡",
        "ムーンストーン",
        "アロマキャンドル",
        "日記帳",
      ],
      en: [
        "Moon accessory",
        "Blue stone",
        "Meditation cushion",
        "Incense",
        "Mirror",
        "Moonstone",
        "Aroma candle",
        "Diary",
      ],
    },
    3: {
      ja: ["緑の植物", "ピンクのバラ", "真珠", "ハート型のペンダント", "香水", "エメラルド", "美容グッズ", "花の種"],
      en: [
        "Green plant",
        "Pink rose",
        "Pearl",
        "Heart pendant",
        "Perfume",
        "Emerald",
        "Beauty products",
        "Flower seeds",
      ],
    },
    4: {
      ja: ["赤いネクタイ", "金の時計", "革の手帳", "印鑑", "スーツ", "ルビー", "ビジネス書", "高級ペン"],
      en: ["Red tie", "Gold watch", "Leather notebook", "Seal", "Suit", "Ruby", "Business book", "Luxury pen"],
    },
    5: {
      ja: ["十字架", "聖書", "数珠", "白い服", "鐘", "サファイア", "哲学書", "瞑想ベル"],
      en: ["Cross", "Bible", "Prayer beads", "White clothes", "Bell", "Sapphire", "Philosophy book", "Meditation bell"],
    },
    6: {
      ja: [
        "ペアリング",
        "赤いバラ",
        "ハート型のチョコレート",
        "香水",
        "ラブレター",
        "ローズクォーツ",
        "カップル写真",
        "愛の詩集",
      ],
      en: [
        "Pair rings",
        "Red rose",
        "Heart chocolate",
        "Perfume",
        "Love letter",
        "Rose quartz",
        "Couple photo",
        "Love poetry",
      ],
    },
    7: {
      ja: ["青い車", "星のアクセサリー", "勝利の月桂樹", "剣", "盾", "サファイア", "スポーツ用品", "勝利のトロフィー"],
      en: [
        "Blue car",
        "Star accessory",
        "Victory laurel",
        "Sword",
        "Shield",
        "Sapphire",
        "Sports equipment",
        "Victory trophy",
      ],
    },
    8: {
      ja: [
        "ライオンのアクセサリー",
        "黄色い花",
        "太陽のペンダント",
        "勇気の石",
        "金色のブレスレット",
        "トパーズ",
        "筋トレグッズ",
        "勇気の象徴",
      ],
      en: [
        "Lion accessory",
        "Yellow flower",
        "Sun pendant",
        "Courage stone",
        "Gold bracelet",
        "Topaz",
        "Workout gear",
        "Symbol of courage",
      ],
    },
    9: {
      ja: ["ランタン", "杖", "茶色のローブ", "瞑想の石", "古い本", "アメジスト", "知恵の書", "隠者のランプ"],
      en: [
        "Lantern",
        "Staff",
        "Brown robe",
        "Meditation stone",
        "Old book",
        "Amethyst",
        "Book of wisdom",
        "Hermit's lamp",
      ],
    },
    10: {
      ja: [
        "ルーレット",
        "幸運のコイン",
        "四つ葉のクローバー",
        "宝くじ",
        "金の輪",
        "ターコイズ",
        "運命の書",
        "幸運のお守り",
      ],
      en: [
        "Roulette",
        "Lucky coin",
        "Four-leaf clover",
        "Lottery ticket",
        "Golden ring",
        "Turquoise",
        "Book of fate",
        "Lucky charm",
      ],
    },
    11: {
      ja: ["天秤", "紫の服", "法律書", "正義の剣", "白い羽根", "ラピスラズリ", "裁判官の槌", "正義の女神像"],
      en: [
        "Scales",
        "Purple clothes",
        "Law book",
        "Sword of justice",
        "White feather",
        "Lapis lazuli",
        "Judge's gavel",
        "Statue of justice",
      ],
    },
    12: {
      ja: [
        "逆さまの時計",
        "瞑想用ロープ",
        "水色の石",
        "忍耐の象徴",
        "静寂のベル",
        "アクアマリン",
        "瞑想マット",
        "時の砂時計",
      ],
      en: [
        "Upside-down clock",
        "Meditation rope",
        "Light blue stone",
        "Symbol of patience",
        "Bell of silence",
        "Aquamarine",
        "Meditation mat",
        "Hourglass of time",
      ],
    },
    13: {
      ja: ["白い花", "黒曜石", "浄化の塩", "新しい種", "蝶のアクセサリー", "オニキス", "変容の石", "再生のシンボル"],
      en: [
        "White flower",
        "Obsidian",
        "Purifying salt",
        "New seeds",
        "Butterfly accessory",
        "Onyx",
        "Stone of transformation",
        "Symbol of rebirth",
      ],
    },
    14: {
      ja: [
        "天使の羽根",
        "調和の石",
        "バランスボール",
        "癒しの音楽",
        "虹色のクリスタル",
        "フローライト",
        "調和のベル",
        "天使の置物",
      ],
      en: [
        "Angel feather",
        "Harmony stone",
        "Balance ball",
        "Healing music",
        "Rainbow crystal",
        "Fluorite",
        "Harmony bell",
        "Angel figurine",
      ],
    },
    15: {
      ja: [
        "解放の鍵",
        "黒い石",
        "浄化のセージ",
        "自由の象徴",
        "切断のハサミ",
        "ヘマタイト",
        "束縛を断つ剣",
        "自由の鳥",
      ],
      en: [
        "Liberation key",
        "Black stone",
        "Purifying sage",
        "Symbol of freedom",
        "Cutting scissors",
        "Hematite",
        "Sword that cuts bonds",
        "Bird of freedom",
      ],
    },
    16: {
      ja: [
        "避雷針",
        "再建の道具",
        "新しい設計図",
        "解放の鍵",
        "真実の鏡",
        "クリアクォーツ",
        "破壊と再生の石",
        "新しい基盤",
      ],
      en: [
        "Lightning rod",
        "Rebuilding tools",
        "New blueprint",
        "Liberation key",
        "Mirror of truth",
        "Clear quartz",
        "Stone of destruction and rebirth",
        "New foundation",
      ],
    },
    17: {
      ja: [
        "星のアクセサリー",
        "希望の石",
        "癒しの水",
        "青い服",
        "平和の象徴",
        "セレスタイト",
        "希望の光",
        "星座の地図",
      ],
      en: [
        "Star accessory",
        "Stone of hope",
        "Healing water",
        "Blue clothes",
        "Symbol of peace",
        "Celestite",
        "Light of hope",
        "Star map",
      ],
    },
    18: {
      ja: [
        "月のランプ",
        "直感の石",
        "夢日記",
        "銀のアクセサリー",
        "潜在意識の鍵",
        "ラブラドライト",
        "夢のキャッチャー",
        "月光の水",
      ],
      en: [
        "Moon lamp",
        "Intuition stone",
        "Dream diary",
        "Silver accessory",
        "Key to subconscious",
        "Labradorite",
        "Dream catcher",
        "Moonlight water",
      ],
    },
    19: {
      ja: [
        "太陽のペンダント",
        "黄色い服",
        "ひまわりの種",
        "金色のアクセサリー",
        "成功の証",
        "シトリン",
        "太陽の石",
        "勝利の冠",
      ],
      en: [
        "Sun pendant",
        "Yellow clothes",
        "Sunflower seeds",
        "Gold accessory",
        "Proof of success",
        "Citrine",
        "Sunstone",
        "Crown of victory",
      ],
    },
    20: {
      ja: [
        "天使の像",
        "復活の象徴",
        "新しい名刺",
        "再生の石",
        "覚醒のベル",
        "アンジェライト",
        "新生の証",
        "審判のラッパ",
      ],
      en: [
        "Angel statue",
        "Symbol of resurrection",
        "New business card",
        "Stone of rebirth",
        "Bell of awakening",
        "Angelite",
        "Certificate of rebirth",
        "Trumpet of judgment",
      ],
    },
    21: {
      ja: [
        "地球儀",
        "完成の証",
        "統合の石",
        "成功のトロフィー",
        "調和の音楽",
        "ダイヤモンド",
        "世界の地図",
        "完成の王冠",
      ],
      en: [
        "Globe",
        "Certificate of completion",
        "Stone of integration",
        "Trophy of success",
        "Music of harmony",
        "Diamond",
        "World map",
        "Crown of completion",
      ],
    },
  }

  // カードIDに対応するアイテムがない場合はデフォルトのアイテムを返す
  const items = luckyItems[cardId] || {
    ja: ["クリスタル", "幸運のお守り", "タロットカード", "瞑想グッズ", "パワーストーン", "水晶玉", "癒しのアイテム"],
    en: ["Crystal", "Lucky charm", "Tarot cards", "Meditation goods", "Power stone", "Crystal ball", "Healing items"],
  }

  const itemList = language === "en" ? items.en : items.ja
  return itemList
}

// カードバックのマッピング
export const CARD_SUITS = {
  default: "/default-tarot-card-back.png",
  moonlight: "/moonlight-tarot-card-back.png",
  golden: "/golden-tarot-back.png",
  crystal: "/crystal-tarot-card-back.png",
  mystic: "/mystic-tarot-back.png",
  royal: "/royal-tarot-card-back.png",
  dragon: "/dragon-tarot-back.png",
  cosmic: "/cosmic-tarot-back.png",
  elemental: "/four-symbols-tarot-back.png",
  "four-symbols": "/four-symbols-tarot-back.png",
  fourSymbols: "/four-symbols-tarot-back.png",
  sakura: "/cardback-sakura.png",
  halloween: "/cardback-halloween.png",
  winter: "/cardback-winter.png",
  "snow-queen": "/snow-queen-tarot-back.png",
  snowQueen: "/snow-queen-tarot-back.png",
  "golden-dragon": "/golden-dragon-tarot-back.jpg",
  goldenDragon: "/golden-dragon-tarot-back.jpg",
}

export const normalizeCardBackId = (id: string): string => {
  if (id === "fourSymbols") return "four-symbols"
  if (id === "snowQueen") return "snow-queen"
  if (id === "goldenDragon") return "golden-dragon"
  return id
}

export const getCardBackImage = (): string => {
  if (typeof window !== "undefined") {
    try {
      const fortuneCardBackUrl = localStorage.getItem("fortuneCardBackUrl")
      if (fortuneCardBackUrl && fortuneCardBackUrl !== "undefined" && fortuneCardBackUrl !== "null") {
        return fortuneCardBackUrl
      }

      const fortuneCardBack = localStorage.getItem("fortuneCardBack")
      if (fortuneCardBack) {
        const normalizedId = normalizeCardBackId(fortuneCardBack)
        if (CARD_SUITS[normalizedId]) {
          return CARD_SUITS[normalizedId]
        }
      }

      const selectedCardBackUrl = localStorage.getItem("selectedCardBack")
      if (selectedCardBackUrl && selectedCardBackUrl !== "undefined" && selectedCardBackUrl !== "null") {
        return selectedCardBackUrl
      }

      const selectedSuitId = localStorage.getItem("selectedSuit")
      if (selectedSuitId) {
        const normalizedId = normalizeCardBackId(selectedSuitId)
        if (CARD_SUITS[normalizedId]) {
          return CARD_SUITS[normalizedId]
        }
      }

      return CARD_SUITS.default
    } catch (error) {
      console.error("カードバック取得エラー:", error)
      return CARD_SUITS.default
    }
  }
  return CARD_SUITS.default
}

export const getCurrentCardBackUrl = (): string => {
  return getCardBackImage()
}
