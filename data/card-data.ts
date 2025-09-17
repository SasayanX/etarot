export type Card = {
  id: string
  name: string
  nameJp?: string
  suit: string
  number?: number
  arcana: "major" | "minor"
  description: string
  descriptionJp?: string
  keywords: string[]
  keywordsJp?: string[]
  imageUrl: string
  meaning: {
    upright: string[]
    reversed: string[]
  }
  meaningJp?: {
    upright: string[]
    reversed: string[]
  }
}

export const majorArcana: Card[] = [
  {
    id: "fool",
    name: "The Fool",
    nameJp: "愚者",
    suit: "major",
    number: 0,
    arcana: "major",
    description:
      "The Fool represents new beginnings, faith in the future, and innocence. The Fool encourages you to take a leap of faith and trust your heart.",
    descriptionJp:
      "愚者は新しい始まり、未来への信頼、そして無邪気さを表しています。愚者はあなたに信念の飛躍を促し、あなたの心を信じるよう勧めています。",
    keywords: ["beginnings", "innocence", "adventure", "optimism"],
    keywordsJp: ["始まり", "無邪気さ", "冒険", "楽観主義"],
    imageUrl: "/images/major-arcana/fool.jpg",
    meaning: {
      upright: ["New beginnings", "Adventure", "Optimism", "Trust"],
      reversed: ["Recklessness", "Carelessness", "Distraction", "Naivety"],
    },
    meaningJp: {
      upright: ["新しい始まり", "冒険", "楽観主義", "信頼"],
      reversed: ["無謀", "不注意", "気が散る", "純真"],
    },
  },
]

export const minorArcana: Card[] = [
  // ワンドスート
  {
    id: "ace-of-wands",
    name: "Ace of Wands",
    nameJp: "ワンドのエース",
    suit: "wands",
    number: 1,
    arcana: "minor",
    description:
      "The Ace of Wands represents creation, willpower, inspiration, and desire. It suggests a spark of inspiration that has the potential to grow into a flame.",
    descriptionJp:
      "ワンドのエースは創造、意志力、インスピレーション、そして欲望を表しています。それは炎に成長する可能性を持つインスピレーションの火花を示唆しています。",
    keywords: ["creation", "willpower", "inspiration", "desire"],
    keywordsJp: ["創造", "意志力", "インスピレーション", "欲望"],
    imageUrl: "/images/wands/1-of-wand.jpg",
    meaning: {
      upright: ["Creation", "Willpower", "Inspiration", "Desire"],
      reversed: ["Lack of energy", "Lack of passion", "Boredom", "Delays"],
    },
    meaningJp: {
      upright: ["創造", "意志力", "インスピレーション", "欲望"],
      reversed: ["エネルギー不足", "情熱の欠如", "退屈", "遅延"],
    },
  },
  {
    id: "two-of-wands",
    name: "Two of Wands",
    nameJp: "ワンドの2",
    suit: "wands",
    number: 2,
    arcana: "minor",
    description:
      "The Two of Wands represents planning, making decisions, and leaving comfort. It suggests a time of planning and moving forward.",
    descriptionJp:
      "ワンドの2は計画、決断、そして快適さからの脱却を表しています。それは計画と前進の時を示唆しています。",
    keywords: ["planning", "decisions", "leaving comfort", "future"],
    keywordsJp: ["計画", "決断", "快適さからの脱却", "未来"],
    imageUrl: "/images/wands/2-of-wand.jpg",
    meaning: {
      upright: ["Planning", "Making decisions", "Leaving comfort", "Future planning"],
      reversed: ["Fear of change", "Playing it safe", "Bad planning", "Lack of foresight"],
    },
    meaningJp: {
      upright: ["計画", "決断", "快適さからの脱却", "将来の計画"],
      reversed: ["変化への恐れ", "安全策", "悪い計画", "先見の明の欠如"],
    },
  },
  {
    id: "three-of-wands",
    name: "Three of Wands",
    nameJp: "ワンドの3",
    suit: "wands",
    number: 3,
    arcana: "minor",
    description:
      "The Three of Wands represents expansion, foresight, and overseas opportunities. It suggests a time of growth and progress.",
    descriptionJp: "ワンドの3は拡大、先見の明、そして海外の機会を表しています。それは成長と進歩の時を示唆しています。",
    keywords: ["expansion", "foresight", "overseas opportunities", "progress"],
    keywordsJp: ["拡大", "先見の明", "海外の機会", "進歩"],
    imageUrl: "/images/wands/3-of-wand.jpg",
    meaning: {
      upright: ["Expansion", "Foresight", "Overseas opportunities", "Progress"],
      reversed: ["Obstacles", "Delays", "Lack of foresight", "Lack of progress"],
    },
    meaningJp: {
      upright: ["拡大", "先見の明", "海外の機会", "進歩"],
      reversed: ["障害", "遅延", "先見の明の欠如", "進歩の欠如"],
    },
  },
  {
    id: "four-of-wands",
    name: "Four of Wands",
    nameJp: "ワンドの4",
    suit: "wands",
    number: 4,
    arcana: "minor",
    description:
      "The Four of Wands represents celebration, harmony, marriage, home, and community. It suggests a time of happiness and harmony in your home and community.",
    descriptionJp:
      "ワンドの4は祝福、調和、結婚、家庭、そしてコミュニティを表しています。それはあなたの家庭とコミュニティにおける幸福と調和の時を示唆しています。",
    keywords: ["celebration", "harmony", "marriage", "home", "community"],
    keywordsJp: ["祝福", "調和", "結婚", "家庭", "コミュニティ"],
    imageUrl: "/images/wands/4-of-wand.jpg",
    meaning: {
      upright: ["Celebration", "Harmony", "Marriage", "Home", "Community"],
      reversed: ["Lack of harmony", "Lack of celebration", "Lack of home", "Lack of community"],
    },
    meaningJp: {
      upright: ["祝福", "調和", "結婚", "家庭", "コミュニティ"],
      reversed: ["調和の欠如", "祝福の欠如", "家庭の欠如", "コミュニティの欠如"],
    },
  },
  {
    id: "five-of-wands",
    name: "Five of Wands",
    nameJp: "ワンドの5",
    suit: "wands",
    number: 5,
    arcana: "minor",
    description:
      "The Five of Wands represents conflict, competition, and disagreements. It suggests a time of conflict and competition in your life.",
    descriptionJp:
      "ワンドの5は対立、競争、そして意見の相違を表しています。それはあなたの人生における対立と競争の時を示唆しています。",
    keywords: ["conflict", "competition", "disagreements", "tension"],
    keywordsJp: ["対立", "競争", "意見の相違", "緊張"],
    imageUrl: "/images/wands/5-of-wand.jpg",
    meaning: {
      upright: ["Conflict", "Competition", "Disagreements", "Tension"],
      reversed: ["End of conflict", "Cooperation", "Agreements", "Harmony"],
    },
    meaningJp: {
      upright: ["対立", "競争", "意見の相違", "緊張"],
      reversed: ["対立の終わり", "協力", "合意", "調和"],
    },
  },
  {
    id: "six-of-wands",
    name: "Six of Wands",
    nameJp: "ワンドの6",
    suit: "wands",
    number: 6,
    arcana: "minor",
    description:
      "The Six of Wands represents victory, success, public recognition, and progress. It suggests a time of victory and success in your life.",
    descriptionJp:
      "ワンドの6は勝利、成功、公的認知、そして進歩を表しています。それはあなたの人生における勝利と成功の時を示唆しています。",
    keywords: ["victory", "success", "public recognition", "progress"],
    keywordsJp: ["勝利", "成功", "公的認知", "進歩"],
    imageUrl: "/images/wands/6-of-wand.jpg",
    meaning: {
      upright: ["Victory", "Success", "Public recognition", "Progress"],
      reversed: ["Lack of recognition", "Lack of success", "Lack of progress", "Lack of victory"],
    },
    meaningJp: {
      upright: ["勝利", "成功", "公的認知", "進歩"],
      reversed: ["認知の欠如", "成功の欠如", "進歩の欠如", "勝利の欠如"],
    },
  },
  {
    id: "seven-of-wands",
    name: "Seven of Wands",
    nameJp: "ワンドの7",
    suit: "wands",
    number: 7,
    arcana: "minor",
    description:
      "The Seven of Wands represents challenge, competition, protection, and perseverance. It suggests a time of challenge and competition in your life.",
    descriptionJp:
      "ワンドの7は挑戦、競争、保護、そして忍耐を表しています。それはあなたの人生における挑戦と競争の時を示唆しています。",
    keywords: ["challenge", "competition", "protection", "perseverance"],
    keywordsJp: ["挑戦", "競争", "保護", "忍耐"],
    imageUrl: "/images/wands/7-of-wand.jpg",
    meaning: {
      upright: ["Challenge", "Competition", "Protection", "Perseverance"],
      reversed: ["Giving up", "Overwhelmed", "Lack of protection", "Lack of perseverance"],
    },
    meaningJp: {
      upright: ["挑戦", "競争", "保護", "忍耐"],
      reversed: ["諦め", "圧倒", "保護の欠如", "忍耐の欠如"],
    },
  },
  {
    id: "eight-of-wands",
    name: "Eight of Wands",
    nameJp: "ワンドの8",
    suit: "wands",
    number: 8,
    arcana: "minor",
    description:
      "The Eight of Wands represents speed, action, air travel, and movement. It suggests a time of rapid action and movement in your life.",
    descriptionJp:
      "ワンドの8は速度、行動、空の旅、そして動きを表しています。それはあなたの人生における迅速な行動と動きの時を示唆しています。",
    keywords: ["speed", "action", "air travel", "movement"],
    keywordsJp: ["速度", "行動", "空の旅", "動き"],
    imageUrl: "/images/wands/8-of-wand.jpg",
    meaning: {
      upright: ["Speed", "Action", "Air travel", "Movement"],
      reversed: ["Delays", "Frustration", "Lack of action", "Lack of movement"],
    },
    meaningJp: {
      upright: ["速度", "行動", "空の旅", "動き"],
      reversed: ["遅延", "欲求不満", "行動の欠如", "動きの欠如"],
    },
  },
  {
    id: "nine-of-wands",
    name: "Nine of Wands",
    nameJp: "ワンドの9",
    suit: "wands",
    number: 9,
    arcana: "minor",
    description:
      "The Nine of Wands represents resilience, courage, persistence, and test of faith. It suggests a time of resilience and courage in your life.",
    descriptionJp:
      "ワンドの9は回復力、勇気、持続性、そして信仰の試練を表しています。それはあなたの人生における回復力と勇気の時を示唆しています。",
    keywords: ["resilience", "courage", "persistence", "test of faith"],
    keywordsJp: ["回復力", "勇気", "持続性", "信仰の試練"],
    imageUrl: "/images/wands/9-of-wand.jpg",
    meaning: {
      upright: ["Resilience", "Courage", "Persistence", "Test of faith"],
      reversed: ["Exhaustion", "Giving up", "Lack of persistence", "Lack of courage"],
    },
    meaningJp: {
      upright: ["回復力", "勇気", "持続性", "信仰の試練"],
      reversed: ["疲労", "諦め", "持続性の欠如", "勇気の欠如"],
    },
  },
  {
    id: "ten-of-wands",
    name: "Ten of Wands",
    nameJp: "ワンドの10",
    suit: "wands",
    number: 10,
    arcana: "minor",
    description:
      "The Ten of Wands represents burden, responsibility, hard work, and stress. It suggests a time of burden and responsibility in your life.",
    descriptionJp:
      "ワンドの10は負担、責任、ハードワーク、そしてストレスを表しています。それはあなたの人生における負担と責任の時を示唆しています。",
    keywords: ["burden", "responsibility", "hard work", "stress"],
    keywordsJp: ["負担", "責任", "ハードワーク", "ストレス"],
    imageUrl: "/images/wands/10-of-wand.jpg",
    meaning: {
      upright: ["Burden", "Responsibility", "Hard work", "Stress"],
      reversed: ["Inability to delegate", "Overstressed", "Burnt out", "Lack of responsibility"],
    },
    meaningJp: {
      upright: ["負担", "責任", "ハードワーク", "ストレス"],
      reversed: ["委任できない", "過度のストレス", "燃え尽き", "責任の欠如"],
    },
  },
  {
    id: "page-of-wands",
    name: "Page of Wands",
    nameJp: "ワンドのページ",
    suit: "wands",
    arcana: "minor",
    description:
      "The Page of Wands represents exploration, excitement, freedom, and adventure. It suggests a time of exploration and excitement in your life.",
    descriptionJp:
      "ワンドのページは探検、興奮、自由、そして冒険を表しています。それはあなたの人生における探検と興奮の時を示唆しています。",
    keywords: ["exploration", "excitement", "freedom", "adventure"],
    keywordsJp: ["探検", "興奮", "自由", "冒険"],
    imageUrl: "/images/wands/page-of-wand.jpg",
    meaning: {
      upright: ["Exploration", "Excitement", "Freedom", "Adventure"],
      reversed: ["Lack of direction", "Procrastination", "Lack of excitement", "Lack of adventure"],
    },
    meaningJp: {
      upright: ["探検", "興奮", "自由", "冒険"],
      reversed: ["方向性の欠如", "先延ばし", "興奮の欠如", "冒険の欠如"],
    },
  },
  {
    id: "knight-of-wands",
    name: "Knight of Wands",
    nameJp: "ワンドのナイト",
    suit: "wands",
    arcana: "minor",
    description:
      "The Knight of Wands represents action, adventure, fearlessness, and energy. It suggests a time of action and adventure in your life.",
    descriptionJp:
      "ワンドのナイトは行動、冒険、恐れのなさ、そしてエネルギーを表しています。それはあなたの人生における行動と冒険の時を示唆しています。",
    keywords: ["action", "adventure", "fearlessness", "energy"],
    keywordsJp: ["行動", "冒険", "恐れのなさ", "エネルギー"],
    imageUrl: "/images/wands/knight-of-wands.jpg",
    meaning: {
      upright: ["Action", "Adventure", "Fearlessness", "Energy"],
      reversed: ["Impulsiveness", "Recklessness", "Lack of energy", "Lack of adventure"],
    },
    meaningJp: {
      upright: ["行動", "冒険", "恐れのなさ", "エネルギー"],
      reversed: ["衝動性", "無謀", "エネルギーの欠如", "冒険の欠如"],
    },
  },
  {
    id: "queen-of-wands",
    name: "Queen of Wands",
    nameJp: "ワンドのクイーン",
    suit: "wands",
    arcana: "minor",
    description:
      "The Queen of Wands represents courage, determination, joy, and vibrancy. It suggests a time of courage and determination in your life.",
    descriptionJp:
      "ワンドのクイーンは勇気、決意、喜び、そして活力を表しています。それはあなたの人生における勇気と決意の時を示唆しています。",
    keywords: ["courage", "determination", "joy", "vibrancy"],
    keywordsJp: ["勇気", "決意", "喜び", "活力"],
    imageUrl: "/images/wands/queen-of-wands.jpg",
    meaning: {
      upright: ["Courage", "Determination", "Joy", "Vibrancy"],
      reversed: ["Selfishness", "Jealousy", "Lack of courage", "Lack of determination"],
    },
    meaningJp: {
      upright: ["勇気", "決意", "喜び", "活力"],
      reversed: ["利己主義", "嫉妬", "勇気の欠如", "決意の欠如"],
    },
  },
  {
    id: "king-of-wands",
    name: "King of Wands",
    nameJp: "ワンドのキング",
    suit: "wands",
    arcana: "minor",
    description:
      "The King of Wands represents leadership, vision, entrepreneur, and honor. It suggests a time of leadership and vision in your life.",
    descriptionJp:
      "ワンドのキングはリーダーシップ、ビジョン、起業家精神、そして名誉を表しています。それはあなたの人生におけるリーダーシップとビジョンの時を示唆しています。",
    keywords: ["leadership", "vision", "entrepreneur", "honor"],
    keywordsJp: ["リーダーシップ", "ビジョン", "起業家精神", "名誉"],
    imageUrl: "/images/wands/king-of-wands.jpg",
    meaning: {
      upright: ["Leadership", "Vision", "Entrepreneur", "Honor"],
      reversed: ["Impulsiveness", "Haste", "Lack of vision", "Lack of leadership"],
    },
    meaningJp: {
      upright: ["リーダーシップ", "ビジョン", "起業家精神", "名誉"],
      reversed: ["衝動性", "性急さ", "ビジョンの欠如", "リーダーシップの欠如"],
    },
  },
  // ペンタクルのカードデータを追加します
  // 既存のカードデータの後に以下のデータを追加してください

  // ペンタクルのエース
  {
    id: "ace-of-pentacles",
    name: "Ace of Pentacles",
    nameJp: "ペンタクルのエース",
    suit: "pentacles",
    number: 1,
    arcana: "minor",
    description:
      "The Ace of Pentacles represents a new financial or career opportunity, manifestation, and abundance. It suggests the beginning of prosperity and security.",
    descriptionJp:
      "ペンタクルのエースは新しい金銭的またはキャリアの機会、実現、そして豊かさを表しています。それは繁栄と安全の始まりを示唆しています。",
    keywords: ["opportunity", "prosperity", "new venture", "abundance"],
    keywordsJp: ["機会", "繁栄", "新しい冒険", "豊かさ"],
    imageUrl: "/images/pentacles/1-of-pentacles.jpg",
    meaning: {
      upright: ["New opportunity", "Prosperity", "Security", "Stability"],
      reversed: ["Missed opportunity", "Scarcity mindset", "Financial issues"],
    },
    meaningJp: {
      upright: ["新しい機会", "繁栄", "安全", "安定"],
      reversed: ["逃した機会", "欠乏マインドセット", "金銭的問題"],
    },
  },
  // ペンタクルの2
  {
    id: "two-of-pentacles",
    name: "Two of Pentacles",
    nameJp: "ペンタクルの2",
    suit: "pentacles",
    number: 2,
    arcana: "minor",
    description:
      "The Two of Pentacles represents balance, adaptability, and juggling priorities. It suggests the need to manage multiple responsibilities effectively.",
    descriptionJp:
      "ペンタクルの2はバランス、適応性、そして優先順位のジャグリングを表しています。それは複数の責任を効果的に管理する必要性を示唆しています。",
    keywords: ["balance", "adaptability", "prioritization", "flexibility"],
    keywordsJp: ["バランス", "適応性", "優先順位付け", "柔軟性"],
    imageUrl: "/images/pentacles/2-of-pentacles.jpg",
    meaning: {
      upright: ["Balance", "Adaptability", "Prioritization", "Flexibility"],
      reversed: ["Imbalance", "Overwhelm", "Disorganization", "Chaos"],
    },
    meaningJp: {
      upright: ["バランス", "適応性", "優先順位付け", "柔軟性"],
      reversed: ["不均衡", "圧倒", "無秩序", "混沌"],
    },
  },
  // ペンタクルの3
  {
    id: "three-of-pentacles",
    name: "Three of Pentacles",
    nameJp: "ペンタクルの3",
    suit: "pentacles",
    number: 3,
    arcana: "minor",
    description:
      "The Three of Pentacles represents teamwork, collaboration, and learning. It suggests working together with others to create something of quality.",
    descriptionJp:
      "ペンタクルの3はチームワーク、協力、そして学習を表しています。それは質の高いものを作るために他者と協力することを示唆しています。",
    keywords: ["teamwork", "collaboration", "learning", "implementation"],
    keywordsJp: ["チームワーク", "協力", "学習", "実装"],
    imageUrl: "/images/pentacles/3-of-pentacles.jpg",
    meaning: {
      upright: ["Teamwork", "Collaboration", "Learning", "Implementation"],
      reversed: ["Lack of teamwork", "Disharmony", "Competition", "Low-quality work"],
    },
    meaningJp: {
      upright: ["チームワーク", "協力", "学習", "実装"],
      reversed: ["チームワークの欠如", "不調和", "競争", "低品質の仕事"],
    },
  },
  // ペンタクルの4
  {
    id: "four-of-pentacles",
    name: "Four of Pentacles",
    nameJp: "ペンタクルの4",
    suit: "pentacles",
    number: 4,
    arcana: "minor",
    description:
      "The Four of Pentacles represents security, control, and conservation. It suggests a focus on maintaining stability, sometimes to the point of being overly cautious.",
    descriptionJp:
      "ペンタクルの4は安全、制御、そして保全を表しています。それは時に過度に慎重になるほど、安定性を維持することに焦点を当てることを示唆しています。",
    keywords: ["security", "control", "conservation", "frugality"],
    keywordsJp: ["安全", "制御", "保全", "倹約"],
    imageUrl: "/images/pentacles/4-of-pentacles.jpg",
    meaning: {
      upright: ["Security", "Control", "Conservation", "Frugality"],
      reversed: ["Greed", "Materialism", "Possessiveness", "Insecurity"],
    },
    meaningJp: {
      upright: ["安全", "制御", "保全", "倹約"],
      reversed: ["貪欲", "物質主義", "所有欲", "不安"],
    },
  },
  // ペンタクルの5
  {
    id: "five-of-pentacles",
    name: "Five of Pentacles",
    nameJp: "ペンタクルの5",
    suit: "pentacles",
    number: 5,
    arcana: "minor",
    description:
      "The Five of Pentacles represents hardship, poverty, and insecurity. It suggests a time of financial or physical struggle, but also reminds us that help is often nearby if we look for it.",
    descriptionJp:
      "ペンタクルの5は困難、貧困、そして不安を表しています。それは金銭的または身体的な苦闘の時を示唆していますが、もし探せば助けがしばしば近くにあることも思い出させます。",
    keywords: ["hardship", "poverty", "insecurity", "worry"],
    keywordsJp: ["困難", "貧困", "不安", "心配"],
    imageUrl: "/images/pentacles/5-of-pentacles.jpg",
    meaning: {
      upright: ["Hardship", "Poverty", "Insecurity", "Worry"],
      reversed: ["Recovery", "Spiritual wealth", "Generosity", "Hope"],
    },
    meaningJp: {
      upright: ["困難", "貧困", "不安", "心配"],
      reversed: ["回復", "精神的な豊かさ", "寛大さ", "希望"],
    },
  },
  // ペンタクルの6
  {
    id: "six-of-pentacles",
    name: "Six of Pentacles",
    nameJp: "ペンタクルの6",
    suit: "pentacles",
    number: 6,
    arcana: "minor",
    description:
      "The Six of Pentacles represents generosity, charity, and giving/receiving. It suggests a time of financial balance where you may either be giving or receiving help.",
    descriptionJp:
      "ペンタクルの6は寛大さ、慈善、そして与える/受け取ることを表しています。それはあなたが助けを与えるか受け取るかのいずれかである可能性がある金銭的バランスの時を示唆しています。",
    keywords: ["generosity", "charity", "giving", "receiving"],
    keywordsJp: ["寛大さ", "慈善", "与えること", "受け取ること"],
    imageUrl: "/images/pentacles/6-of-pentacles.jpg",
    meaning: {
      upright: ["Generosity", "Charity", "Giving", "Receiving"],
      reversed: ["Selfishness", "Debt", "Unequal power dynamics", "Strings attached"],
    },
    meaningJp: {
      upright: ["寛大さ", "慈善", "与えること", "受け取ること"],
      reversed: ["自己中心", "借金", "不平等な力関係", "条件付きの援助"],
    },
  },
  // ペンタクルの7
  {
    id: "seven-of-pentacles",
    name: "Seven of Pentacles",
    nameJp: "ペンタクルの7",
    suit: "pentacles",
    number: 7,
    arcana: "minor",
    description:
      "The Seven of Pentacles represents assessment, patience, and long-term rewards. It suggests a time to evaluate your progress and consider whether your investments of time and energy are yielding the desired results.",
    descriptionJp:
      "ペンタクルの7は評価、忍耐、そして長期的な報酬を表しています。それはあなたの進歩を評価し、時間とエネルギーの投資が望ましい結果をもたらしているかどうかを検討する時を示唆しています。",
    keywords: ["assessment", "patience", "long-term view", "perseverance"],
    keywordsJp: ["評価", "忍耐", "長期的視点", "忍耐強さ"],
    imageUrl: "/images/pentacles/7-of-pentacles.jpg",
    meaning: {
      upright: ["Assessment", "Patience", "Long-term view", "Perseverance"],
      reversed: ["Impatience", "Short-term focus", "Lack of results", "Giving up"],
    },
    meaningJp: {
      upright: ["評価", "忍耐", "長期的視点", "忍耐強さ"],
      reversed: ["焦り", "短期的な焦点", "結果の欠如", "諦め"],
    },
  },
  // ペンタクルの8
  {
    id: "eight-of-pentacles",
    name: "Eight of Pentacles",
    nameJp: "ペンタクルの8",
    suit: "pentacles",
    number: 8,
    arcana: "minor",
    description:
      "The Eight of Pentacles represents diligence, skill development, and attention to detail. It suggests a time of focused work and craftsmanship to master your skills.",
    descriptionJp:
      "ペンタクルの8は勤勉さ、スキル開発、そして細部への注意を表しています。それはあなたのスキルを習得するための集中した作業と職人技の時を示唆しています。",
    keywords: ["diligence", "skill development", "craftsmanship", "quality"],
    keywordsJp: ["勤勉さ", "スキル開発", "職人技", "品質"],
    imageUrl: "/images/pentacles/8-of-pentacles.jpg",
    meaning: {
      upright: ["Diligence", "Skill development", "Craftsmanship", "Quality"],
      reversed: ["Lack of focus", "Shortcuts", "Mediocrity", "Poor workmanship"],
    },
    meaningJp: {
      upright: ["勤勉さ", "スキル開発", "職人技", "品質"],
      reversed: ["集中力の欠如", "近道", "凡庸さ", "粗悪な仕事"],
    },
  },
  // ペンタクルの9
  {
    id: "nine-of-pentacles",
    name: "Nine of Pentacles",
    nameJp: "ペンタクルの9",
    suit: "pentacles",
    number: 9,
    arcana: "minor",
    description:
      "The Nine of Pentacles represents self-sufficiency, luxury, and financial independence. It suggests a time of enjoying the fruits of your labor and the material comforts you have earned.",
    descriptionJp:
      "ペンタクルの9は自給自足、贅沢、そして経済的独立を表しています。それはあなたの労働の成果と、あなたが獲得した物質的な快適さを楽しむ時を示唆しています。",
    keywords: ["self-sufficiency", "luxury", "financial independence", "rewards"],
    keywordsJp: ["自給自足", "贅沢", "経済的独立", "報酬"],
    imageUrl: "/images/pentacles/9-of-pentacles.jpg",
    meaning: {
      upright: ["Self-sufficiency", "Luxury", "Financial independence", "Rewards"],
      reversed: ["Over-dependence", "Superficiality", "Financial setbacks", "Isolation"],
    },
    meaningJp: {
      upright: ["自給自足", "贅沢", "経済的独立", "報酬"],
      reversed: ["過度の依存", "表面性", "金銭的な挫折", "孤立"],
    },
  },
  // ペンタクルの10
  {
    id: "ten-of-pentacles",
    name: "Ten of Pentacles",
    nameJp: "ペンタクルの10",
    suit: "pentacles",
    number: 10,
    arcana: "minor",
    description:
      "The Ten of Pentacles represents wealth, family legacy, and long-term success. It suggests a time of financial security and the establishment of a lasting foundation for generations to come.",
    descriptionJp:
      "ペンタクルの10は富、家族の遺産、そして長期的な成功を表しています。それは経済的安全と、来るべき世代のための永続的な基盤の確立の時を示唆しています。",
    keywords: ["wealth", "legacy", "family", "long-term success"],
    keywordsJp: ["富", "遺産", "家族", "長期的な成功"],
    imageUrl: "/images/pentacles/10-of-pentacles.jpg",
    meaning: {
      upright: ["Wealth", "Legacy", "Family", "Long-term success"],
      reversed: ["Financial failure", "Family disputes", "Fleeting success", "Lack of stability"],
    },
    meaningJp: {
      upright: ["富", "遺産", "家族", "長期的な成功"],
      reversed: ["経済的失敗", "家族の争い", "一時的な成功", "安定性の欠如"],
    },
  },
  // ペンタクルのページ
  {
    id: "page-of-pentacles",
    name: "Page of Pentacles",
    nameJp: "ペンタクルのページ",
    suit: "pentacles",
    arcana: "minor",
    description:
      "The Page of Pentacles represents study, manifestation, and a new opportunity. It suggests a time of learning and developing practical skills with a focus on material goals.",
    descriptionJp:
      "ペンタクルのページは学習、実現、そして新しい機会を表しています。それは物質的な目標に焦点を当てた実用的なスキルの学習と開発の時を示唆しています。",
    keywords: ["study", "manifestation", "opportunity", "practicality"],
    keywordsJp: ["学習", "実現", "機会", "実用性"],
    imageUrl: "/images/pentacles/page-of-pentacles.jpg",
    meaning: {
      upright: ["Study", "Manifestation", "Opportunity", "Practicality"],
      reversed: ["Lack of progress", "Procrastination", "Unrealistic goals", "Impracticality"],
    },
    meaningJp: {
      upright: ["学習", "実現", "機会", "実用性"],
      reversed: ["進歩の欠如", "先延ばし", "非現実的な目標", "非実用性"],
    },
  },
  // ペンタクルのナイト
  {
    id: "knight-of-pentacles",
    name: "Knight of Pentacles",
    nameJp: "ペンタクルのナイト",
    suit: "pentacles",
    arcana: "minor",
    description:
      "The Knight of Pentacles represents hard work, reliability, and routine. It suggests a methodical approach to achieving your goals through consistent effort and patience.",
    descriptionJp:
      "ペンタクルのナイトはハードワーク、信頼性、そしてルーティンを表しています。それは一貫した努力と忍耐を通じてあなたの目標を達成するための体系的なアプローチを示唆しています。",
    keywords: ["hard work", "reliability", "routine", "conservatism"],
    keywordsJp: ["ハードワーク", "信頼性", "ルーティン", "保守主義"],
    imageUrl: "/images/pentacles/knight-of-pentacles.jpg",
    meaning: {
      upright: ["Hard work", "Reliability", "Routine", "Conservatism"],
      reversed: ["Boredom", "Stagnation", "Laziness", "Stubbornness"],
    },
    meaningJp: {
      upright: ["ハードワーク", "信頼性", "ルーティン", "保守主義"],
      reversed: ["退屈", "停滞", "怠惰", "頑固さ"],
    },
  },
  // ペンタクルのクイーン
  {
    id: "queen-of-pentacles",
    name: "Queen of Pentacles",
    nameJp: "ペンタクルのクイーン",
    suit: "pentacles",
    arcana: "minor",
    description:
      "The Queen of Pentacles represents nurturing, practicality, and abundance. It suggests a time of creating a comfortable home environment and providing for others through practical means.",
    descriptionJp:
      "ペンタクルのクイーンは育成、実用性、そして豊かさを表しています。それは快適な家庭環境を作り、実用的な手段を通じて他者に提供する時を示唆しています。",
    keywords: ["nurturing", "practicality", "abundance", "security"],
    keywordsJp: ["育成", "実用性", "豊かさ", "安全"],
    imageUrl: "/images/pentacles/queen-of-pentacles.jpg",
    meaning: {
      upright: ["Nurturing", "Practicality", "Abundance", "Security"],
      reversed: ["Smothering", "Materialism", "Codependency", "Financial insecurity"],
    },
    meaningJp: {
      upright: ["育成", "実用性", "豊かさ", "安全"],
      reversed: ["過保護", "物質主義", "共依存", "経済的不安"],
    },
  },
  // ペンタクルのキング
  {
    id: "king-of-pentacles",
    name: "King of Pentacles",
    nameJp: "ペンタクルのキング",
    suit: "pentacles",
    arcana: "minor",
    description:
      "The King of Pentacles represents wealth, business, leadership, and security. It suggests a time of financial stability and the ability to generate prosperity through disciplined effort and sound judgment.",
    descriptionJp:
      "ペンタクルのキングは富、ビジネス、リーダーシップ、そして安全を表しています。それは経済的安定と、規律ある努力と健全な判断を通じて繁栄を生み出す能力の時を示唆しています。",
    keywords: ["wealth", "business", "leadership", "security"],
    keywordsJp: ["富", "ビジネス", "リーダーシップ", "安全"],
    imageUrl: "/images/pentacles/king-of-pentacles.jpg",
    meaning: {
      upright: ["Wealth", "Business", "Leadership", "Security"],
      reversed: ["Greed", "Corruption", "Poor financial decisions", "Inflexibility"],
    },
    meaningJp: {
      upright: ["富", "ビジネス", "リーダーシップ", "安全"],
      reversed: ["貪欲", "腐敗", "貧弱な金銭的決断", "柔軟性の欠如"],
    },
  },
  // カップのエース
  {
    id: "ace-of-cups",
    name: "Ace of Cups",
    nameJp: "カップのエース",
    suit: "cups",
    number: 1,
    arcana: "minor",
    description:
      "The Ace of Cups represents new feelings, intuition, and emotional fulfillment. It suggests the beginning of emotional experiences, spiritual connections, or creative endeavors.",
    descriptionJp:
      "カップのエースは新しい感情、直感、そして感情的な充実を表しています。それは感情的な経験、精神的なつながり、または創造的な努力の始まりを示唆しています。",
    keywords: ["new feelings", "intuition", "love", "emotional fulfillment"],
    keywordsJp: ["新しい感情", "直感", "愛", "感情的な充実"],
    imageUrl: "/images/cups/1-of-cups.jpg",
    meaning: {
      upright: ["New feelings", "Intuition", "Love", "Emotional fulfillment"],
      reversed: ["Emotional blockage", "Repressed feelings", "Emptiness", "Spilled emotions"],
    },
    meaningJp: {
      upright: ["新しい感情", "直感", "愛", "感情的な充実"],
      reversed: ["感情的なブロック", "抑圧された感情", "空虚さ", "こぼれた感情"],
    },
  },
  // カップの2
  {
    id: "two-of-cups",
    name: "Two of Cups",
    nameJp: "カップの2",
    suit: "cups",
    number: 2,
    arcana: "minor",
    description:
      "The Two of Cups represents partnership, mutual attraction, and harmony. It suggests a balanced relationship or connection between two people, whether romantic, friendship, or business.",
    descriptionJp:
      "カップの2はパートナーシップ、相互の魅力、そして調和を表しています。それは恋愛、友情、またはビジネスにかかわらず、2人の間のバランスの取れた関係やつながりを示唆しています。",
    keywords: ["partnership", "mutual attraction", "harmony", "connection"],
    keywordsJp: ["パートナーシップ", "相互の魅力", "調和", "つながり"],
    imageUrl: "/images/cups/2-of-cups.jpg",
    meaning: {
      upright: ["Partnership", "Mutual attraction", "Harmony", "Connection"],
      reversed: ["Imbalance", "Broken communication", "Tension", "Separation"],
    },
    meaningJp: {
      upright: ["パートナーシップ", "相互の魅力", "調和", "つながり"],
      reversed: ["不均衡", "壊れたコミュニケーション", "緊張", "別離"],
    },
  },
  // ... 他のカップのカードも同様に追加できます
]

export const allCards = [...majorArcana, ...minorArcana]

export function getCardById(id: string): Card | undefined {
  return allCards.find((card) => card.id === id)
}

export function getCardsByArcana(arcana: "major" | "minor"): Card[] {
  return allCards.filter((card) => card.arcana === arcana)
}

export function getCardsBySuit(suit: string): Card[] {
  return allCards.filter((card) => card.suit === suit)
}
