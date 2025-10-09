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
      ja: ["赤いペン", "クリスタル", "キャンドル", "タロットカード", "木製の杖", "シトリン", "万年筆", "創作ノート"],
      en: ["Red pen", "Crystal", "Candle", "Tarot cards", "Wooden staff", "Citrine", "Fountain pen", "Creative notebook"],
    },
    2: {
      ja: [
        "月のペンダント",
        "ムーンストーン",
        "瞑想クッション",
        "お香",
        "手鏡",
        "ラブラドライト",
        "アロマキャンドル",
        "日記帳",
      ],
      en: [
        "Moon pendant",
        "Moonstone",
        "Meditation cushion",
        "Incense",
        "Hand mirror",
        "Labradorite",
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
      ja: ["星のペンダント", "サファイア", "勝利のメダル", "装飾用の剣", "スポーツタオル", "トレーニングウェア", "スポーツ用品", "トロフィー置物"],
      en: [
        "Star pendant",
        "Sapphire",
        "Victory medal",
        "Decorative sword",
        "Sports towel",
        "Training wear",
        "Sports equipment",
        "Trophy figurine",
      ],
    },
    8: {
      ja: [
        "ライオンのペンダント",
        "黄色い花",
        "太陽のペンダント",
        "タイガーアイ",
        "金色のブレスレット",
        "トパーズ",
        "筋トレグッズ",
        "ライオンの置物",
      ],
      en: [
        "Lion pendant",
        "Yellow flower",
        "Sun pendant",
        "Tiger's eye",
        "Gold bracelet",
        "Topaz",
        "Workout gear",
        "Lion figurine",
      ],
    },
    9: {
      ja: ["LEDランタン", "木製の杖", "茶色のガウン", "アメジスト", "古書", "スモーキークォーツ", "哲学書", "キャンドルランタン"],
      en: [
        "LED lantern",
        "Wooden staff",
        "Brown robe",
        "Amethyst",
        "Antique book",
        "Smoky quartz",
        "Philosophy book",
        "Candle lantern",
      ],
    },
    10: {
      ja: [
        "ルーレット置物",
        "ゴールドコイン",
        "四つ葉クローバーアクセサリー",
        "金の指輪",
        "ターコイズ",
        "ジェイド（翡翠）",
        "占いカード",
        "幸運のお守り",
      ],
      en: [
        "Roulette figurine",
        "Gold coin",
        "Four-leaf clover accessory",
        "Gold ring",
        "Turquoise",
        "Jade",
        "Fortune cards",
        "Lucky charm",
      ],
    },
    11: {
      ja: ["天秤置物", "紫の服", "法律書", "装飾用の剣", "羽根ペン", "ラピスラズリ", "木製ガベル", "女神像"],
      en: [
        "Scale figurine",
        "Purple clothes",
        "Law book",
        "Decorative sword",
        "Feather pen",
        "Lapis lazuli",
        "Wooden gavel",
        "Goddess statue",
      ],
    },
    12: {
      ja: [
        "砂時計",
        "ヨガロープ",
        "アクアマリン",
        "瞑想ベル",
        "ティンシャ（チベタンベル）",
        "セレナイト",
        "ヨガマット",
        "瞑想クッション",
      ],
      en: [
        "Hourglass",
        "Yoga rope",
        "Aquamarine",
        "Meditation bell",
        "Tingsha (Tibetan bell)",
        "Selenite",
        "Yoga mat",
        "Meditation cushion",
      ],
    },
    13: {
      ja: ["白い花", "オブシディアン", "浄化の塩", "花の種", "蝶のペンダント", "オニキス", "モルダバイト", "蝶の置物"],
      en: [
        "White flower",
        "Obsidian",
        "Purifying salt",
        "Flower seeds",
        "Butterfly pendant",
        "Onyx",
        "Moldavite",
        "Butterfly figurine",
      ],
    },
    14: {
      ja: [
        "天使の置物",
        "フローライト",
        "ヨガボール",
        "ヒーリング音楽CD",
        "レインボークリスタル",
        "アベンチュリン",
        "チベタンベル",
        "天使のペンダント",
      ],
      en: [
        "Angel figurine",
        "Fluorite",
        "Yoga ball",
        "Healing music CD",
        "Rainbow crystal",
        "Aventurine",
        "Tibetan bell",
        "Angel pendant",
      ],
    },
    15: {
      ja: [
        "アンティークキー",
        "ヘマタイト",
        "ホワイトセージ",
        "黒曜石",
        "鳥のペンダント",
        "ブラックトルマリン",
        "装飾用の鎖",
        "鳥の置物",
      ],
      en: [
        "Antique key",
        "Hematite",
        "White sage",
        "Obsidian",
        "Bird pendant",
        "Black tourmaline",
        "Decorative chain",
        "Bird figurine",
      ],
    },
    16: {
      ja: [
        "工具セット",
        "ノートブック",
        "クリアクォーツ",
        "鏡",
        "スモーキークォーツ",
        "水晶クラスター",
        "塔の置物",
        "建築模型",
      ],
      en: [
        "Tool set",
        "Notebook",
        "Clear quartz",
        "Mirror",
        "Smoky quartz",
        "Crystal cluster",
        "Tower figurine",
        "Architectural model",
      ],
    },
    17: {
      ja: [
        "星のペンダント",
        "セレスタイト",
        "アロマウォーター",
        "青い服",
        "平和の鳩の置物",
        "アクアオーラ",
        "LEDキャンドル",
        "星座早見盤",
      ],
      en: [
        "Star pendant",
        "Celestite",
        "Aroma water",
        "Blue clothes",
        "Peace dove figurine",
        "Aqua aura",
        "LED candle",
        "Star chart",
      ],
    },
    18: {
      ja: [
        "月のランプ",
        "ラブラドライト",
        "夢日記",
        "シルバーアクセサリー",
        "ムーンストーン",
        "セレナイト",
        "ドリームキャッチャー",
        "ムーンウォーター",
      ],
      en: [
        "Moon lamp",
        "Labradorite",
        "Dream diary",
        "Silver accessory",
        "Moonstone",
        "Selenite",
        "Dream catcher",
        "Moon water",
      ],
    },
    19: {
      ja: [
        "太陽のペンダント",
        "黄色い服",
        "ひまわりの種",
        "ゴールドアクセサリー",
        "シトリン",
        "サンストーン",
        "イエロージャスパー",
        "王冠の置物",
      ],
      en: [
        "Sun pendant",
        "Yellow clothes",
        "Sunflower seeds",
        "Gold accessory",
        "Citrine",
        "Sunstone",
        "Yellow jasper",
        "Crown figurine",
      ],
    },
    20: {
      ja: [
        "天使の置物",
        "不死鳥の置物",
        "名刺入れ",
        "アンジェライト",
        "クリスタルベル",
        "ホワイトカルセドニー",
        "新しい手帳",
        "ラッパの置物",
      ],
      en: [
        "Angel figurine",
        "Phoenix figurine",
        "Business card holder",
        "Angelite",
        "Crystal bell",
        "White chalcedony",
        "New planner",
        "Trumpet figurine",
      ],
    },
    21: {
      ja: [
        "地球儀",
        "フォトフレーム",
        "ラピスラズリ",
        "トロフィー置物",
        "ヒーリング音楽CD",
        "ダイヤモンド",
        "世界地図ポスター",
        "王冠の置物",
      ],
      en: [
        "Globe",
        "Photo frame",
        "Lapis Lazuli",
        "Trophy figurine",
        "Healing music CD",
        "Diamond",
        "World map poster",
        "Crown figurine",
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
