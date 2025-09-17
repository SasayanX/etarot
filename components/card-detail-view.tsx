"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getCardDescription,
  getCardUpright,
  getCardReversed,
  getCardPositiveMeaning,
  getCardNegativeMeaning,
  getCardKeywords,
} from "@/utils/card-utils"
import { useLanguage } from "@/contexts/language-context"

// カードの詳細情報（大アルカナ）
const cardDetails = {
  // 大アルカナ
  0: {
    description:
      "愚者は新しい旅の始まりを表します。無邪気さ、自由、冒険心、そして未知への一歩を踏み出す勇気を象徴しています。",
    keywords: "冒険, 新しい始まり, 自由, 無邪気さ, 自発性",
    upright: "新しい始まり、冒険、自由な精神、無邪気さ、自発性、可能性",
    reversed: "無謀、軽率さ、リスク、無計画、愚かさ",
    positive: "新しい可能性に対して開かれた心を持ち、自由に冒険する勇気があります。",
    negative: "計画性がなく、危険を顧みない無謀さが問題を引き起こす可能性があります。",
  },
  1: {
    description: "魔術師は創造力と意志力を表します。自分の能力を活かして現実を形作る力を持っています。",
    keywords: "創造力, 意志力, 熟練, 自信, 集中",
    upright: "創造力、熟練、自信、意志力、集中、才能の発揮",
    reversed: "操作、不誠実、才能の無駄遣い、自己疑念",
    positive: "あなたの才能と能力を最大限に活用して、望む現実を創造することができます。",
    negative: "自分の能力を誤った方向に使ったり、才能を無駄にしたりする危険性があります。",
  },
  2: {
    description: "女教皇は直感と潜在意識を表します。表面的なものを超えた深い知恵と洞察力を持っています。",
    keywords: "直感, 潜在意識, 神秘, 内なる声, 知恵",
    upright: "直感、潜在意識、神秘、内なる声、知恵、秘密",
    reversed: "秘密の隠蔽、混乱、表面的な理解、無視された直感",
    positive: "内なる声に耳を傾け、直感的な知恵を信頼することで深い洞察を得られます。",
    negative: "重要な情報を見逃したり、直感を無視したりすることで判断を誤る可能性があります。",
  },
  3: {
    description: "女帝は豊かさと創造性を表します。自然との調和、感情の豊かさ、そして育む力を象徴しています。",
    keywords: "豊かさ, 創造性, 調和, 育む, 自然",
    upright: "豊かさ、創造性、調和、育む力、自然との繋がり",
    reversed: "依存、過保護、創造性の欠如、自己表現の妨げ",
    positive: "豊かさと創造性を育み、周囲の人々や環境と調和して繁栄することができます。",
    negative: "過度な依存や過保護な態度が、自分や他者の成長を妨げる可能性があります。",
  },
  4: {
    description: "皇帝は権威と安定を表します。リーダーシップ、秩序、そして構造を象徴しています。",
    keywords: "権威, 安定, リーダーシップ, 秩序, 構造",
    upright: "権威、安定、リーダーシップ、秩序、構造、保護",
    reversed: "支配、過度な制御、頑固さ、柔軟性の欠如",
    positive: "強いリーダーシップと安定した基盤を築き、秩序と構造をもたらすことができます。",
    negative: "過度な支配欲や柔軟性の欠如が、関係性や状況を硬直させる可能性があります。",
  },
  5: {
    description: "教皇は伝統と信念を表します。精神的な指導、道徳的な価値観、そして教えを象徴しています。",
    keywords: "伝統, 信念, 精神的指導, 道徳, 教え",
    upright: "伝統、信念、精神的指導、道徳的価値観、教え",
    reversed: "反抗、非伝統的、不寛容、過度な信仰",
    positive: "伝統的な知恵と精神的な指導を通じて、より深い理解と信念を得ることができます。",
    negative: "過度に厳格な信念や不寛容さが、新しい視点や成長の機会を制限する可能性があります。",
  },
  6: {
    description: "恋人は関係性と選択を表します。愛、調和、そして価値観に基づいた決断を象徴しています。",
    keywords: "関係性, 選択, 愛, 調和, 価値観",
    upright: "関係性、選択、愛、調和、価値観に基づいた決断",
    reversed: "不調和、不均衡、価値観の相違、誤った選択",
    positive: "心からの愛と調和に基づいた関係性を築き、価値観に沿った選択をすることができます。",
    negative: "価値観の衝突や不均衡な関係性が、誤った選択や不調和をもたらす可能性があります。",
  },
  7: {
    description: "戦車は意志力と勝利を表します。決意、自己制御、そして障害を乗り越える力を象徴しています。",
    keywords: "意志力, 勝利, 決意, 自己制御, 前進",
    upright: "意志力、勝利、決意、自己制御、前進、集中",
    reversed: "自己中心的、方向性の欠如、攻撃性、無力感",
    positive: "強い意志と決意を持って障害を乗り越え、目標に向かって前進することができます。",
    negative: "方向性の欠如や過度な攻撃性が、進むべき道を見失わせる可能性があります。",
  },
  8: {
    description: "力は内なる強さと勇気を表します。情熱、自信、そして忍耐を象徴しています。",
    keywords: "内なる強さ, 勇気, 情熱, 自信, 忍耐",
    upright: "内なる強さ、勇気、情熱、自信、忍耐、自己制御",
    reversed: "自信の欠如、弱さ、支配、怒り、エネルギーの浪費",
    positive: "内なる強さと勇気を持って情熱を制御し、忍耐強く目標に向かうことができます。",
    negative: "自信の欠如や感情のコントロールを失うことで、エネルギーを無駄にする可能性があります。",
  },
  9: {
    description: "隠者は内省と孤独を表します。自己探求、内なる導き、そして真実の探求を象徴しています。",
    keywords: "内省, 孤独, 自己探求, 内なる導き, 真実",
    upright: "内省、孤独、自己探求、内なる導き、真実の探求",
    reversed: "孤立、拒絶、引きこもり、社会的孤立",
    positive: "静かな内省と自己探求を通じて、深い真実と内なる導きを見つけることができます。",
    negative: "過度な引きこもりや社会的孤立が、重要な人間関係や機会を失わせる可能性があります。",
  },
  10: {
    description: "運命の輪は変化と運命を表します。循環、転機、そして新しい可能性を象徴しています。",
    keywords: "変化, 運命, 循環, 転機, 可能性",
    upright: "変化、運命、循環、転機、新しい可能性、運",
    reversed: "抵抗、不運、外部からの制御、運命への抵抗",
    positive: "人生の循環と変化を受け入れ、新しい可能性に開かれた心を持つことができます。",
    negative: "変化への抵抗や運命に対する無力感が、成長や前進を妨げる可能性があります。",
  },
  11: {
    description: "正義は公正さと真実を表します。バランス、調和、そして因果関係を象徴しています。",
    keywords: "公正さ, 真実, バランス, 調和, 因果関係",
    upright: "公正さ、真実、バランス、調和、因果関係、法",
    reversed: "不公平、不均衡、偏見、不正義、法的問題",
    positive: "公正さとバランスを保ち、真実に基づいた判断と決断をすることができます。",
    negative: "不均衡や偏見が、不公平な状況や法的問題を引き起こす可能性があります。",
  },
  12: {
    description:
      "吊るされた男は犠牲と新しい視点を表します。放棄、一時停止、そして異なる角度からの見方を象徴しています。",
    keywords: "犠牲, 新しい視点, 放棄, 一時停止, 異なる角度",
    upright: "犠牲、新しい視点、放棄、一時停止、異なる角度からの見方",
    reversed: "抵抗、無駄な犠牲、執着、停滞",
    positive: "一時的な犠牲や休止を受け入れ、新しい視点から状況を見ることで洞察を得られます。",
    negative: "無駄な犠牲や執着が、前進を妨げ停滞をもたらす可能性があります。",
  },
  13: {
    description: "死神は変容と終わりを表します。変化、移行、そして古いものを手放すことを象徴しています。",
    keywords: "変容, 終わり, 変化, 移行, 手放す",
    upright: "変容、終わり、変化、移行、古いものを手放す",
    reversed: "抵抗、変化への恐れ、停滞、不可避な変化",
    positive: "古いものを手放し、変化を受け入れることで、新しい始まりと変容を経験できます。",
    negative: "変化への恐れや抵抗が、必要な成長や移行を妨げる可能性があります。",
  },
  14: {
    description: "節制はバランスと調和を表します。中庸、自制心、そして異なる要素の融合を象徴しています。",
    keywords: "バランス, 調和, 中庸, 自制心, 融合",
    upright: "バランス、調和、中庸、自制心、異なる要素の融合",
    reversed: "不均衡、過剰、不調和、衝突",
    positive: "バランスと調和を保ち、異なる要素を融合させることで、穏やかな流れを作り出せます。",
    negative: "過剰や不均衡が、調和を乱し衝突や不調和をもたらす可能性があります。",
  },
  15: {
    description: "悪魔は束縛と欲望を表します。執着、誘惑、そして物質主義を象徴しています。",
    keywords: "束縛, 欲望, 執着, 誘惑, 物質主義",
    upright: "束縛、欲望、執着、誘惑、物質主義、依存",
    reversed: "解放、独立、自由への欲求、制約からの脱出",
    positive: "自分の欲望や執着を認識し、それらから解放されることで真の自由を見つけられます。",
    negative: "物質主義や依存が、精神的な成長や自由を制限する可能性があります。",
  },
  16: {
    description: "塔は突然の変化と啓示を表します。混乱、崩壊、そして古い構造の破壊を象徴しています。",
    keywords: "突然の変化, 啓示, 混乱, 崩壊, 破壊",
    upright: "突然の変化、啓示、混乱、崩壊、古い構造の破壊",
    reversed: "変化への恐れ、避けられる災難、段階的な変化",
    positive: "突然の変化や崩壊を通じて、真実の啓示と新しい始まりの機会を得ることができます。",
    negative: "予期せぬ混乱や破壊が、安定性や安心感を脅かす可能性があります。",
  },
  17: {
    description: "星は希望と霊感を表します。楽観主義、信頼、そして導きを象徴しています。",
    keywords: "希望, 霊感, 楽観主義, 信頼, 導き",
    upright: "希望、霊感、楽観主義、信頼、導き、平和",
    reversed: "失望、悲観主義、希望の喪失、信頼の欠如",
    positive: "希望と信頼を持ち、宇宙からの導きに従うことで、霊感と平和を見つけられます。",
    negative: "失望や悲観主義が、前向きな可能性や機会を見逃させる可能性があります。",
  },
  18: {
    description: "月は幻想と直感を表します。不確かさ、恐れ、そして潜在意識を象徴しています。",
    keywords: "幻想, 直感, 不確かさ, 恐れ, 潜在意識",
    upright: "幻想、直感、不確かさ、恐れ、潜在意識、夢",
    reversed: "混乱の解消、恐怖の克服、真実の発見",
    positive: "潜在意識と直感を信頼し、不確かさの中でも内なる導きを見つけることができます。",
    negative: "幻想や恐れに囚われ、現実と幻想の区別がつかなくなる可能性があります。",
  },
  19: {
    description: "太陽は成功と喜びを表します。活力、明るさ、そして達成感を象徴しています。",
    keywords: "成功, 喜び, 活力, 明るさ, 達成感",
    upright: "成功、喜び、活力、明るさ、達成感、真実",
    reversed: "一時的な落胆、成功の遅れ、過度な楽観主義",
    positive: "明るさと活力に満ち、成功と喜びを経験し、真の達成感を味わうことができます。",
    negative: "過度な楽観主義や現実の無視が、期待外れや落胆をもたらす可能性があります。",
  },
  20: {
    description: "審判は再生と目覚めを表します。反省、評価、そして新たな始まりを象徴しています。",
    keywords: "再生, 目覚め, 反省, 評価, 新たな始まり",
    upright: "再生、目覚め、反省、評価、新たな始まり、呼びかけ",
    reversed: "自己疑念、決断の先延ばし、恐れによる判断",
    positive: "過去を振り返り評価することで、新たな目覚めと再生を経験することができます。",
    negative: "自己疑念や恐れが、重要な決断や変化を先延ばしにさせる可能性があります。",
  },
  21: {
    description: "世界は完成と達成を表します。統合、旅の終わり、そして新しいサイクルの始まりを象徴しています。",
    keywords: "完成, 達成, 統合, 旅の終わり, 新しいサイクル",
    upright: "完成、達成、統合、旅の終わり、新しいサイクルの始まり",
    reversed: "未完成、遅延、未達成の目標",
    positive: "目標の達成と完成を祝い、すべての経験を統合して新しいサイクルを始めることができます。",
    negative: "未完成や遅延が、達成感や完結を妨げる可能性があります。",
  },
}

// 英語版のカード詳細情報
const cardDetailsEn = {
  0: {
    description:
      "The Fool represents the beginning of a new journey. It symbolizes innocence, freedom, adventurous spirit, and the courage to take the first step into the unknown.",
    keywords: "Adventure, New beginnings, Freedom, Innocence, Spontaneity",
    upright: "New beginnings, adventure, free spirit, innocence, spontaneity, potential",
    reversed: "Recklessness, carelessness, risk, lack of planning, foolishness",
    positive: "You have an open heart to new possibilities and the courage to adventure freely.",
    negative: "Lack of planning and reckless disregard for danger may cause problems.",
  },
  1: {
    description:
      "The Magician represents creativity and willpower. It has the power to shape reality by utilizing one's abilities.",
    keywords: "Creativity, Willpower, Skill, Confidence, Focus",
    upright: "Creativity, skill, confidence, willpower, focus, manifestation of talent",
    reversed: "Manipulation, dishonesty, waste of talent, self-doubt",
    positive: "You can create the reality you desire by making the most of your talents and abilities.",
    negative: "There is a risk of using your abilities in the wrong direction or wasting your talents.",
  },
  2: {
    description:
      "The High Priestess represents intuition and mystery. It symbolizes deep wisdom, inner knowledge, and the ability to perceive what is hidden.",
    keywords: "Intuition, Mystery, Wisdom, Inner knowledge, Secrets",
    upright: "Intuition, sacred knowledge, divine feminine, secrets, mystery",
    reversed: "Suppressed intuition, secrets, withdrawal, silence",
    positive: "Trust your intuition and inner wisdom to guide you.",
    negative: "Ignoring your intuition may lead to confusion or missed opportunities.",
  },
  3: {
    description:
      "The Empress represents abundance and nurturing. It symbolizes fertility, creativity, and the power of nature.",
    keywords: "Abundance, Nurturing, Fertility, Creativity, Nature",
    upright: "Abundance, fertility, nurturing, sensuality, pleasure",
    reversed: "Dependence, smothering, lack of growth, infertility",
    positive: "Embrace your creativity and nurture your relationships.",
    negative: "Avoid being overly dependent or smothering in your relationships.",
  },
  4: {
    description:
      "The Emperor represents authority and structure. It symbolizes control, stability, and the establishment of order.",
    keywords: "Authority, Structure, Control, Stability, Order",
    upright: "Authority, control, stability, leadership, structure",
    reversed: "Tyranny, rigidity, lack of control, weakness",
    positive: "Take control of your life and establish a stable foundation.",
    negative: "Avoid being overly rigid or tyrannical in your approach.",
  },
  5: {
    description:
      "The Hierophant represents tradition and guidance. It symbolizes institutions, beliefs, and the search for meaning.",
    keywords: "Tradition, Guidance, Beliefs, Institutions, Meaning",
    upright: "Tradition, conformity, institutions, education, guidance",
    reversed: "Rebellion, nonconformity, challenging tradition, unconventionality",
    positive: "Seek guidance from established institutions and traditions.",
    negative: "Be cautious of blindly following tradition without questioning it.",
  },
  6: {
    description:
      "The Lovers represent relationships and choices. It symbolizes love, harmony, and decisions based on values.",
    keywords: "Relationships, Choices, Love, Harmony, Values",
    upright: "Relationships, choices, love, harmony, value-based decisions",
    reversed: "Disharmony, imbalance, value conflicts, poor choices",
    positive: "Build relationships based on love and harmony, and make choices aligned with your values.",
    negative: "Value conflicts or imbalanced relationships may lead to poor choices and disharmony.",
  },
  7: {
    description:
      "The Chariot represents willpower and victory. It symbolizes determination, self-control, and the power to overcome obstacles.",
    keywords: "Willpower, Victory, Determination, Self-control, Progress",
    upright: "Willpower, victory, determination, self-control, progress, focus",
    reversed: "Self-centeredness, lack of direction, aggression, powerlessness",
    positive: "With strong will and determination, you can overcome obstacles and move forward toward your goals.",
    negative: "Lack of direction or excessive aggression may cause you to lose sight of your path.",
  },
  8: {
    description: "Strength represents inner strength and courage. It symbolizes passion, confidence, and patience.",
    keywords: "Inner strength, Courage, Passion, Confidence, Patience",
    upright: "Inner strength, courage, passion, confidence, patience, self-control",
    reversed: "Lack of confidence, weakness, domination, anger, energy waste",
    positive: "With inner strength and courage, you can control your passion and patiently work toward your goals.",
    negative: "Lack of confidence or loss of emotional control may waste your energy.",
  },
  9: {
    description:
      "The Hermit represents introspection and solitude. It symbolizes self-exploration, inner guidance, and the search for truth.",
    keywords: "Introspection, Solitude, Self-exploration, Inner guidance, Truth",
    upright: "Introspection, solitude, self-exploration, inner guidance, search for truth",
    reversed: "Isolation, rejection, withdrawal, social isolation",
    positive: "Through quiet introspection and self-exploration, you can find deep truth and inner guidance.",
    negative:
      "Excessive withdrawal or social isolation may cause you to lose important relationships or opportunities.",
  },
  10: {
    description:
      "The Wheel of Fortune represents change and destiny. It symbolizes cycles, turning points, and new possibilities.",
    keywords: "Change, Destiny, Cycles, Turning points, Possibilities",
    upright: "Change, destiny, cycles, turning points, new possibilities, luck",
    reversed: "Resistance, bad luck, external control, resistance to fate",
    positive: "Accept the cycles and changes of life and keep an open heart to new possibilities.",
    negative: "Resistance to change or feelings of powerlessness against fate may hinder growth and progress.",
  },
  11: {
    description:
      "Justice represents fairness and truth. It symbolizes balance, harmony, and cause and effect relationships.",
    keywords: "Fairness, Truth, Balance, Harmony, Cause and effect",
    upright: "Fairness, truth, balance, harmony, cause and effect, law",
    reversed: "Unfairness, imbalance, prejudice, injustice, legal problems",
    positive: "Maintain fairness and balance, and make judgments and decisions based on truth.",
    negative: "Imbalance or prejudice may cause unfair situations or legal problems.",
  },
  12: {
    description:
      "The Hanged Man represents sacrifice and new perspective. It symbolizes surrender, suspension, and seeing things from a different angle.",
    keywords: "Sacrifice, New perspective, Surrender, Suspension, Different angle",
    upright: "Sacrifice, new perspective, surrender, suspension, seeing from a different angle",
    reversed: "Resistance, useless sacrifice, attachment, stagnation",
    positive: "Accept temporary sacrifice or pause and gain insight by seeing the situation from a new perspective.",
    negative: "Useless sacrifice or attachment may hinder progress and cause stagnation.",
  },
  13: {
    description:
      "Death represents transformation and endings. It symbolizes change, transition, and letting go of the old.",
    keywords: "Transformation, Endings, Change, Transition, Letting go",
    upright: "Transformation, endings, change, transition, letting go of the old",
    reversed: "Resistance, fear of change, stagnation, inevitable change",
    positive: "By letting go of the old and accepting change, you can experience new beginnings and transformation.",
    negative: "Fear of or resistance to change may hinder necessary growth or transition.",
  },
  14: {
    description:
      "Temperance represents balance and harmony. It symbolizes moderation, self-control, and the fusion of different elements.",
    keywords: "Balance, Harmony, Moderation, Self-control, Fusion",
    upright: "Balance, harmony, moderation, self-control, fusion of different elements",
    reversed: "Imbalance, excess, disharmony, conflict",
    positive: "Maintain balance and harmony, and create a peaceful flow by fusing different elements.",
    negative: "Excess or imbalance may disrupt harmony and cause conflict or disharmony.",
  },
  15: {
    description: "The Devil represents bondage and desire. It symbolizes attachment, temptation, and materialism.",
    keywords: "Bondage, Desire, Attachment, Temptation, Materialism",
    upright: "Bondage, desire, attachment, temptation, materialism, addiction",
    reversed: "Liberation, independence, desire for freedom, escape from constraints",
    positive: "Recognize your desires and attachments, and find true freedom by being liberated from them.",
    negative: "Materialism or addiction may limit spiritual growth or freedom.",
  },
  16: {
    description:
      "The Tower represents sudden change and revelation. It symbolizes chaos, collapse, and the destruction of old structures.",
    keywords: "Sudden change, Revelation, Chaos, Collapse, Destruction",
    upright: "Sudden change, revelation, chaos, collapse, destruction of old structures",
    reversed: "Fear of change, avoidable disaster, gradual change",
    positive: "Through sudden change or collapse, you can gain true revelation and opportunities for new beginnings.",
    negative: "Unexpected chaos or destruction may threaten stability or peace of mind.",
  },
  17: {
    description: "The Star represents hope and inspiration. It symbolizes optimism, trust, and guidance.",
    keywords: "Hope, Inspiration, Optimism, Trust, Guidance",
    upright: "Hope, inspiration, optimism, trust, guidance, peace",
    reversed: "Disappointment, pessimism, loss of hope, lack of trust",
    positive: "With hope and trust, follow the guidance from the universe to find inspiration and peace.",
    negative: "Disappointment or pessimism may cause you to miss positive possibilities or opportunities.",
  },
  18: {
    description: "The Moon represents illusion and intuition. It symbolizes uncertainty, fear, and the subconscious.",
    keywords: "Illusion, Intuition, Uncertainty, Fear, Subconscious",
    upright: "Illusion, intuition, uncertainty, fear, subconscious, dreams",
    reversed: "Clearing confusion, overcoming fear, discovering truth",
    positive: "Trust your subconscious and intuition to find inner guidance even in uncertainty.",
    negative: "Being trapped by illusions or fears may make it difficult to distinguish between reality and fantasy.",
  },
  19: {
    description: "The Sun represents success and joy. It symbolizes vitality, brightness, and a sense of achievement.",
    keywords: "Success, Joy, Vitality, Brightness, Achievement",
    upright: "Success, joy, vitality, brightness, achievement, truth",
    reversed: "Temporary disappointment, delayed success, excessive optimism",
    positive: "Full of brightness and vitality, you can experience success and joy and taste true achievement.",
    negative: "Excessive optimism or ignoring reality may bring disappointment or letdown.",
  },
  20: {
    description:
      "Judgement represents rebirth and awakening. It symbolizes reflection, evaluation, and new beginnings.",
    keywords: "Rebirth, Awakening, Reflection, Evaluation, New beginnings",
    upright: "Rebirth, awakening, reflection, evaluation, new beginnings, calling",
    reversed: "Self-doubt, postponing decisions, fear-based judgment",
    positive: "By reflecting on and evaluating the past, you can experience new awakening and rebirth.",
    negative: "Self-doubt or fear may cause you to postpone important decisions or changes.",
  },
  21: {
    description:
      "The World represents completion and achievement. It symbolizes integration, the end of a journey, and the beginning of a new cycle.",
    keywords: "Completion, Achievement, Integration, End of journey, New cycle",
    upright: "Completion, achievement, integration, end of journey, beginning of new cycle",
    reversed: "Incompletion, delay, unachieved goals",
    positive: "Celebrate the achievement and completion of goals, integrate all experiences, and begin a new cycle.",
    negative: "Incompletion or delay may hinder the sense of achievement or closure.",
  },
}

interface CardDetailViewProps {
  card: {
    id: number
    name: string
    image: string
    suit?: string
    rank?: string
  }
  onClose: () => void
  textToSpeechEnabled: boolean
}

export default function CardDetailView({ card, onClose, textToSpeechEnabled }: CardDetailViewProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(card.image)
  const { language, t } = useLanguage()

  // カードの詳細情報を取得する関数
  const getCardDetail = (cardId: number) => {
    // 大アルカナの場合
    if (cardId >= 0 && cardId < 22) {
      const detail = language === "en" ? cardDetailsEn[cardId] : cardDetails[cardId]
      if (detail) {
        return detail
      }
    }

    // 小アルカナの場合 - 個別の解釈を提供
    if (cardId >= 22 && cardId <= 77) {
      return {
        description: getCardDescription(cardId, language),
        keywords: getCardKeywords(cardId, language),
        upright: getCardUpright(cardId, language),
        reversed: getCardReversed(cardId, language),
        positive: getCardPositiveMeaning(cardId, language),
        negative: getCardNegativeMeaning(cardId, language),
      }
    }

    // 最終フォールバック
    return {
      description:
        language === "en" ? "Card details not yet available." : "このカードの詳細情報はまだ登録されていません。",
      keywords: language === "en" ? "No information" : "情報なし",
      upright: language === "en" ? "No information" : "情報なし",
      reversed: language === "en" ? "No information" : "情報なし",
      positive:
        language === "en"
          ? "Positive interpretation not yet available."
          : "このカードのポジティブな解釈はまだ登録されていません。",
      negative:
        language === "en"
          ? "Negative interpretation not yet available."
          : "このカードのネガティブな解釈はまだ登録されていません。",
    }
  }

  // 画像エラー時のフォールバック
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true)
      setImageSrc(`/placeholder.svg?height=400&width=300&query=${encodeURIComponent(card.name)}`)
    }
  }

  // 音声読み上げ機能
  const speakText = (text: string) => {
    if (textToSpeechEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = language === "en" ? "en-US" : "ja-JP"
      speechSynthesis.speak(utterance)
    }
  }

  useEffect(() => {
    // カードが変更されたときに画像をリセット
    setImageSrc(card.image)
    setImageError(false)
  }, [card])

  // カードの詳細情報を取得
  const detail = getCardDetail(card.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 md:p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{card.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={t("card.detail.close")}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* カード画像 */}
            <div className="flex-shrink-0 flex justify-center">
              <div className="relative w-48 h-80 bg-gray-900 rounded-lg overflow-hidden border border-purple-600">
                <img
                  src={imageSrc || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-full object-contain"
                  onError={handleImageError}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 text-center p-2">
                    <p className="text-red-300 text-sm">{t("card.detail.image.error")}</p>
                  </div>
                )}
              </div>
            </div>

            {/* カード情報 */}
            <div className="flex-grow">
              <div className="space-y-6">
                <div>
                  <Badge
                    variant="outline"
                    className="bg-purple-900/30 text-purple-300 border-purple-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.overview")}
                  </Badge>
                  <p className="text-gray-300">{detail.description}</p>
                  {textToSpeechEnabled && (
                    <button
                      onClick={() => speakText(detail.description)}
                      className="mt-2 px-3 py-1 bg-purple-700 text-white text-sm rounded hover:bg-purple-600 transition-colors"
                    >
                      {t("card.detail.speak")}
                    </button>
                  )}
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="bg-green-900/30 text-green-300 border-green-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.upright")}
                  </Badge>
                  <p className="text-gray-300">{detail.upright}</p>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="bg-red-900/30 text-red-300 border-red-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.reversed")}
                  </Badge>
                  <p className="text-gray-300">{detail.reversed}</p>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="bg-blue-900/30 text-blue-300 border-blue-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.positive")}
                  </Badge>
                  <p className="text-gray-300">{detail.positive}</p>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="bg-orange-900/30 text-orange-300 border-orange-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.negative")}
                  </Badge>
                  <p className="text-gray-300">{detail.negative}</p>
                </div>

                <div>
                  <Badge
                    variant="outline"
                    className="bg-amber-900/30 text-amber-300 border-amber-600 text-lg font-semibold mb-2"
                  >
                    {t("card.detail.keywords")}
                  </Badge>
                  <div className="flex flex-wrap gap-2">
                    {detail.keywords.split(",").map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-900/50 text-purple-200">
                        {keyword.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
