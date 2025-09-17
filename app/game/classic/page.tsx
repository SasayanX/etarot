"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { cn } from "@/lib/utils"
import { getCardImageUrl } from "@/utils/image-utils"
import { addScore } from "@/utils/score-utils"

// useShopをインポートする
import { useShop } from "@/contexts/shop-context"
import { useRouter } from "next/navigation"

// カードバックマネージャーをインポート
import { getCurrentCardBackUrl } from "@/utils/card-back-manager"

// 除外するカードのID
const EXCLUDED_CARD_IDS = [36, 49] // エースオブカップ(36)とキングオブカップ(49)のみを除外

// カード名を取得する関数
function getCardName(cardId: number): string {
  const cardNames: Record<number, string> = {
    0: "愚者",
    1: "魔術師",
    2: "女教皇",
    3: "女帝",
    4: "皇帝",
    5: "教皇",
    6: "恋人",
    7: "戦車",
    8: "力",
    9: "隠者",
    10: "運命の輪",
    11: "正義",
    12: "吊るされた男",
    13: "死神",
    14: "節制",
    15: "悪魔",
    16: "塔",
    17: "星",
    18: "月",
    19: "太陽",
    20: "審判",
    21: "世界",
  }
  return cardNames[cardId] || `カード ${cardId}`
}

// カードの詳細情報を取得する関数
function getCardDescription(cardId: number): string {
  const descriptions: Record<number, string> = {
    // 大アルカナ
    0: "新しい始まり、冒険、自由な精神を表します。純粋な心と無限の可能性を持つカードです。",
    1: "意志力、創造力、実現力を表します。目標に向かって行動する力と、物事を形にする能力を示しています。",
    2: "直感、神秘、内なる知恵を表します。静寂の中で真実を見つめ、内面の声に耳を傾けることの大切さを示しています。",
    3: "豊穣、母性、創造性を表します。愛情深く、育む力と、美しいものを生み出す能力を象徴しています。",
    4: "権威、安定、責任感を表します。強いリーダーシップと、物事を統制する力を示しています。",
    5: "伝統、教え、精神的指導を表します。知識の伝承と、精神的な成長への導きを象徴しています。",
    6: "愛、調和、選択を表します。人との絆と、重要な決断を迫られる状況を示しています。",
    7: "意志力、勝利、前進を表します。困難を乗り越え、目標に向かって突き進む力を象徴しています。",
    8: "内なる力、勇気、忍耐を表します。精神的な強さと、困難に立ち向かう勇気を示しています。",
    9: "内省、探求、指導を表します。静かな瞑想と自己探求を通じて得られる知恵を象徴しています。",
    10: "運命、変化、転機を表します。人生の大きな転換点と、運命の流れを示しています。",
    11: "公正、バランス、正義を表します。公平な判断と、道徳的な正しさを象徴しています。",
    12: "犠牲、忍耐、新たな視点を表します。一時的な停滞から得られる新しい洞察を示しています。",
    13: "終わり、変容、再生を表します。古いものの終わりと、新しい始まりへの変化を象徴しています。",
    14: "調和、バランス、節制を表します。対立するものの調和と、適度なバランスの重要性を示しています。",
    15: "誘惑、束縛、物質的欲望を表します。欲望に囚われることの危険性と、自由への渇望を象徴しています。",
    16: "破壊、突然の変化、解放を表します。古い構造の崩壊と、真実の露呈を示しています。",
    17: "希望、インスピレーション、導きを表します。暗闇の中の光と、未来への希望を象徴しています。",
    18: "幻想、不安、潜在意識を表します。隠された真実と、内面の不安や恐れを示しています。",
    19: "成功、喜び、活力を表します。明るい未来と、生命力に満ちた状態を象徴しています。",
    20: "覚醒、再生、最終判断を表します。過去の清算と、新しい人生への目覚めを示しています。",
    21: "完成、達成、統合を表します。目標の達成と、すべてが調和した完全な状態を象徴しています。",

    // ワンド（22-35）
    22: "新しいプロジェクトの始まり、創造的なエネルギー、純粋な情熱を表します。",
    23: "計画と準備、将来への展望、個人的な力を表します。",
    24: "探求、拡張、長期的な視野を表します。",
    25: "安定、基盤、調和のとれた環境を表します。",
    26: "競争、挑戦、困難の克服を表します。",
    27: "勝利、成功、公的な認知を表します。",
    28: "防御、挑戦への準備、勇気を表します。",
    29: "迅速な行動、変化、進歩を表します。",
    30: "重荷、責任、最後の努力を表します。",
    31: "圧倒的な責任、ストレス、重圧を表します。",
    32: "学習、努力、技術の習得を表します。",
    33: "冒険、衝動、自由な精神を表します。",
    34: "成熟した女性、育成、実用的な創造性を表します。",
    35: "リーダーシップ、ビジョン、起業家精神を表します。",

    // カップ（36-49）
    37: "新しい関係、感情の始まり、愛の可能性を表します。",
    38: "パートナーシップ、協力、相互理解を表します。",
    39: "友情、祝福、社交性を表します。",
    40: "無関心、退屈、感情的な停滞を表します。",
    41: "失望、後悔、感情的な混乱を表します。",
    42: "懐かしさ、過去への憧れ、幼少期の思い出を表します。",
    43: "幻想、選択肢の多さ、現実逃避を表します。",
    44: "受容、流れに身を任せる、感情的な理解を表します。",
    45: "願いの成就、満足、感情的な充足を表します。",
    46: "感情的な満足、家族の幸せ、調和を表します。",
    47: "感受性、直感、芸術的才能を表します。",
    48: "ロマンス、理想主義、感情的な探求を表します。",
    49: "感情的な成熟、思いやり、直感的な理解を表します。",

    // ソード（50-63）
    50: "新しいアイデア、明晰さ、真実の発見を表します。",
    51: "決断の困難、バランス、選択の必要性を表します。",
    52: "心の痛み、悲しみ、感情的な傷を表します。",
    53: "休息、瞑想、平和な状態を表します。",
    54: "敗北、屈辱、失望を表します。",
    55: "移行、変化、新しい環境への移動を表します。",
    56: "制限、束縛、無力感を表します。",
    57: "罪悪感、自己批判、精神的な束縛を表します。",
    58: "不安、恐怖、悪夢を表します。",
    59: "裏切り、終わり、最悪の状況を表します。",
    60: "学習、集中、知識の習得を表します。",
    61: "衝動、無謀、未熟な行動を表します。",
    62: "知性、独立、鋭い洞察力を表します。",
    63: "権威、規律、厳格な判断を表します。",

    // ペンタクル（64-77）
    64: "新しい機会、物質的な始まり、実用的なスタートを表します。",
    65: "バランス、多様性、優先順位の管理を表します。",
    66: "協力、チームワーク、技術の共有を表します。",
    67: "ケチ、所有欲、物質への執着を表します。",
    68: "失業、経済的困難、物質的な不安を表します。",
    69: "寛大さ、慈善、物質的な支援を表します。",
    70: "投資、忍耐、長期的な成果を表します。",
    71: "技術、職人技、専門知識を表します。",
    72: "利益、成果、物質的な成功を表します。",
    73: "豊かさ、遺産、物質的な安定を表します。",
    74: "勤勉、努力、実用的な学習を表します。",
    75: "冒険、実用性、物質的な探求を表します。",
    76: "実用性、安全、物質的な安定を表します。",
    77: "成功、豊かさ、物質的な達成を表します。",
  }
  return descriptions[cardId] || "このカードは実用的な知恵と日常生活における重要な教訓を表しています。"
}

// 正位置の意味を取得する関数
function getCardUpright(cardId: number): string {
  const upright: Record<number, string> = {
    // 大アルカナ
    0: "新しい始まり、冒険心、自由",
    1: "創造力、意志力、集中力",
    2: "直感、神秘性、内なる知恵",
    3: "豊穣、母性愛、創造性",
    4: "権威、安定、責任感",
    5: "伝統、教育、精神的指導",
    6: "愛、調和、重要な選択",
    7: "勝利、意志力、前進",
    8: "内なる力、勇気、忍耐",
    9: "内省、探求、賢明な指導",
    10: "幸運、転機、運命の変化",
    11: "公正、バランス、正義",
    12: "犠牲、忍耐、新しい視点",
    13: "変容、再生、新しい始まり",
    14: "調和、節制、バランス",
    15: "束縛、誘惑、物質的欲望",
    16: "突然の変化、破壊、解放",
    17: "希望、インスピレーション、導き",
    18: "幻想、不安、潜在意識",
    19: "成功、喜び、活力",
    20: "覚醒、再生、最終判断",
    21: "完成、達成、統合",

    // ワンド
    22: "創造的エネルギー、新しい始まり",
    23: "計画、将来への展望",
    24: "探求、拡張、長期的視野",
    25: "安定、調和、基盤",
    26: "競争、挑戦、克服",
    27: "勝利、成功、認知",
    28: "防御、準備、勇気",
    29: "迅速な行動、変化",
    30: "重荷、責任、努力",
    31: "圧倒的責任、重圧",
    32: "学習、努力、技術習得",
    33: "冒険、衝動、自由",
    34: "育成、実用的創造性",
    35: "リーダーシップ、ビジョン",

    // カップ
    37: "新しい愛、感情の始まり",
    38: "パートナーシップ、協力",
    39: "友情、祝福、社交性",
    40: "無関心、感情的停滞",
    41: "失望、後悔、混乱",
    42: "懐かしさ、過去への憧れ",
    43: "幻想、選択肢、現実逃避",
    44: "受容、流れに身を任せる",
    45: "願いの成就、満足",
    46: "感情的満足、家族の幸せ",
    47: "感受性、直感、芸術的才能",
    48: "ロマンス、理想主義",
    49: "感情的成熟、思いやり",

    // ソード
    50: "新しいアイデア、明晰さ",
    51: "決断の困難、バランス",
    52: "心の痛み、悲しみ",
    53: "休息、瞑想、平和",
    54: "敗北、屈辱、失望",
    55: "移行、変化、移動",
    56: "制限、束縛、無力感",
    57: "罪悪感、自己批判",
    58: "不安、恐怖、悪夢",
    59: "裏切り、終わり、最悪の状況",
    60: "学習、集中、知識習得",
    61: "衝動、無謀、未熟",
    62: "知性、独立、洞察力",
    63: "権威、規律、厳格な判断",

    // ペンタクル
    64: "新しい機会、物質的始まり",
    65: "バランス、多様性、管理",
    66: "協力、チームワーク",
    67: "ケチ、所有欲、執着",
    68: "失業、経済的困難",
    69: "寛大さ、慈善、支援",
    70: "投資、忍耐、長期的成果",
    71: "技術、職人技、専門知識",
    72: "利益、成果、物質的成功",
    73: "豊かさ、遺産、安定",
    74: "勤勉、努力、実用的学習",
    75: "冒険、実用性、探求",
    76: "実用性、安全、安定",
    77: "成功、豊かさ、達成",
  }
  return upright[cardId] || "ポジティブなエネルギー、成長"
}

// 逆位置の意味を取得する関数
function getCardReversed(cardId: number): string {
  const reversed: Record<number, string> = {
    // 大アルカナ
    0: "軽率、無責任、未熟",
    1: "意志薄弱、集中力不足、操作",
    2: "直感の欠如、秘密、隠蔽",
    3: "不毛、依存、創造性の欠如",
    4: "独裁、頑固、権力の乱用",
    5: "反抗、非伝統、精神的混乱",
    6: "不調和、誤った選択、関係の悪化",
    7: "敗北、意志薄弱、方向性の喪失",
    8: "弱さ、自信喪失、内面の混乱",
    9: "孤立、頑固、助言の拒否",
    10: "不運、停滞、悪い変化",
    11: "不公正、偏見、バランスの欠如",
    12: "無駄な犠牲、頑固、視野の狭さ",
    13: "停滞、変化への抵抗、執着",
    14: "不調和、極端、バランスの欠如",
    15: "解放、自由、束縛からの脱出",
    16: "災害の回避、内面の混乱、抵抗",
    17: "失望、希望の喪失、方向性の欠如",
    18: "真実の発覚、不安の解消、明晰さ",
    19: "失敗、エネルギー不足、悲観",
    20: "判断力の欠如、後悔、過去への執着",
    21: "未完成、達成の遅れ、不調和",

    // ワンド
    22: "創造性の欠如、エネルギー不足",
    23: "計画不足、短期的思考",
    24: "視野の狭さ、探求心の欠如",
    25: "不安定、不調和、基盤の欠如",
    26: "敗北、挫折、競争の回避",
    27: "失敗、認知されない、敗北",
    28: "無防備、準備不足、臆病",
    29: "遅延、停滞、変化への抵抗",
    30: "責任の放棄、諦め",
    31: "責任からの解放、重圧の軽減",
    32: "学習不足、技術の未熟",
    33: "無謀、衝動的、方向性の欠如",
    34: "過保護、実用性の欠如",
    35: "独裁的、ビジョンの欠如",

    // カップ
    37: "感情の枯渇、愛の終わり",
    38: "不調和、協力の欠如",
    39: "孤立、社交性の欠如",
    40: "感情の復活、新しい関心",
    41: "受容、前向きな変化",
    42: "現実への回帰、前進",
    43: "現実的な選択、明晰さ",
    44: "抵抗、流れに逆らう",
    45: "不満、願いの未達成",
    46: "家族の不調和、不満",
    47: "感受性の欠如、現実的",
    48: "現実的な愛、地に足のついた関係",
    49: "感情的未熟、思いやりの欠如",

    // ソード
    50: "混乱、不明瞭、真実の隠蔽",
    51: "決断、バランスの回復",
    52: "回復、癒し、痛みの軽減",
    53: "不安、休息の欠如",
    54: "回復、名誉の回復",
    55: "停滞、変化への抵抗",
    56: "解放、自由、制限からの脱出",
    57: "解放、自己受容",
    58: "希望、不安の解消",
    59: "回復、新しい始まり",
    60: "学習の困難、集中力不足",
    61: "慎重さ、計画性",
    62: "感情的、依存的",
    63: "独裁的、厳格すぎる",

    // ペンタクル
    64: "機会の逃失、物質的困難",
    65: "不均衡、優先順位の混乱",
    66: "協力の欠如、孤立",
    67: "寛大さ、分かち合い",
    68: "経済的回復、安定",
    69: "ケチ、支援の拒否",
    70: "短期的思考、忍耐不足",
    71: "技術不足、未熟",
    72: "利益の減少、成果の不足",
    73: "貧困、不安定、遺産の喪失",
    74: "怠惰、努力不足",
    75: "無謀、実用性の欠如",
    76: "不安定、安全性の欠如",
    77: "失敗、豊かさの喪失",
  }
  return reversed[cardId] || "ネガティブなエネルギー、課題"
}

// 小アルカナの名前を取得する関数
function getMinorArcanaName(cardId: number): string {
  if (cardId < 22 || cardId > 77) return `カード ${cardId}`

  const suitIndex = Math.floor((cardId - 22) / 14)
  const valueIndex = (cardId - 22) % 14

  const suits = ["ワンド", "カップ", "ソード", "ペンタクル"]
  const values = ["エース", "2", "3", "4", "5", "6", "7", "8", "9", "10", "ページ", "ナイト", "クイーン", "キング"]

  if (suitIndex >= 0 && suitIndex < suits.length && valueIndex >= 0 && valueIndex < values.length) {
    return `${suits[suitIndex]}の${values[valueIndex]}`
  }

  return `カード ${cardId}`
}

// 小アルカナの画像URLを取得する関数
function getMinorArcanaImageUrl(cardId: number): string {
  if (cardId < 22 || cardId > 77) {
    return `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(`カード ${cardId}`)}`
  }

  const suitIndex = Math.floor((cardId - 22) / 14)
  const valueIndex = (cardId - 22) % 14

  // スートの配列
  const suits = ["wands", "cups", "swords", "pentacles"]
  const values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "page", "knight", "queen", "king"]

  if (suitIndex >= 0 && suitIndex < suits.length && valueIndex >= 0 && valueIndex < values.length) {
    const suit = suits[suitIndex]
    const value = values[valueIndex]

    // 辞典と同じ画像URL設定方式を使用
    let image = ""

    // スートに基づいて画像URLを設定
    if (suit === "wands") {
      if (value === "ace")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-wands.jpg-1pPgS5t2dGOqjkS3N4GkIbLgmSSI87.jpeg"
      else if (value === "2")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-wand.jpg-e1azrTpQTiu35k0oVguk6JaMegRRoA.jpeg"
      else if (value === "3")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-wand.jpg-uGgEzjxHzYqLgrsGdx2itqLqch0ktv.jpeg"
      else if (value === "4")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-wand.jpg-CEnCaef04E0RX6y3HL2YWzMiyx09Cl.jpeg"
      else if (value === "5")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-wand.jpg-3NViw5cuNzuYmrbaes8DH6ubhXtebR.jpeg"
      else if (value === "6")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-wand.jpg-6rYwxii5fJjY1b6nF61zpsETWq3Q9a.jpeg"
      else if (value === "7")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-wand.jpg-POyReivh15Dh1fuNwTWVjMOKBIBC8B.jpeg"
      else if (value === "8")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-wand.jpg-fmFOT86lrSsK7eoe6UAHKA1fZ8AZfC.jpeg"
      else if (value === "9")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-wand.jpg-lzxgJY822vkf4qEMEaSQAotpxCuY9J.jpeg"
      else if (value === "10")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-wand.jpg-Gn7coGdI4gOe9YShWorFzHIzgdLAJB.jpeg"
      else if (value === "page")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-wand.jpg-MlWxZUsmhzZOv8En7rmJ5KzQrFzQhv.jpeg"
      else if (value === "knight")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-wands.jpg-OkWaa0SGCP5AvO9jTovVeGCQocd5Nr.jpeg"
      else if (value === "queen")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-wands.jpg-bAjPDuYLlBAKowtcT2BskSkTCR3Xrj.jpeg"
      else if (value === "king")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-wands.jpg-FaSnZh01XlalPLWM12oSnLAh1WQqJT.jpeg"
    } else if (suit === "cups") {
      if (value === "ace")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-cups.jpg-VdQlUGDd9GSnJ60boD0YML61KU94Z8.jpeg"
      else if (value === "2")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-cups.jpg-uhNsNJYS4QrAve5t4Za9nGcOEYd8yW.jpeg"
      else if (value === "3")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-cups.jpg-oRHYBimxtzuKW8YvHioHORuHor80vR.jpeg"
      else if (value === "4")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-cups.jpg-7OuDpH6Ixsr67IlGzYvc54ZNmVu5oN.jpeg"
      else if (value === "5")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-cups.jpg-EqSd43skY62lAQfdNEZqG8LD7qB412.jpeg"
      else if (value === "6")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-cups.jpg-KEq9KNSBvM7gA0W6tM0YfNv93ygb6V.jpeg"
      else if (value === "7")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-cups.jpg-vmL5EERQuPJEfiyDcQEoDfwDi5tbXk.jpeg"
      else if (value === "8")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-cups.jpg-8wIA9ua8sKHHKRN70U9hgy8HlMEXkW.jpeg"
      else if (value === "9")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-cups.jpg-6Ummn38NN5G3Ko3FXezhwy70ATu542.jpeg"
      else if (value === "10")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-cups.jpg-HxvR7GmKqtY82qhTCsPIIQk0tkHYvi.jpeg"
      else if (value === "page")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-cups.jpg-VDfN69Dd51JoRKiacP22I3JFpg41Td.jpeg"
      else if (value === "knight")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-cups.jpg-XWNThF2JdShb882z4xoe0Ml6Ig512P.jpeg"
      else if (value === "queen")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-cups.jpg-3H2Jy2bCM3UBmlcVBHZcXjPSZlh2Iq.jpeg"
      else if (value === "king")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-cups.jpg-8pSIMwNTDwUDYODInULhoVL5dQqi7U.jpeg"
    } else if (suit === "swords") {
      if (value === "ace")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-swords.jpg-chQNJGHWYsgEdxiSs6lxm0qOHbUZBg.jpeg"
      else if (value === "2")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-swords.jpg-9Y90GTmtafXm8I2usHFONGwbGwOw3G.jpeg"
      else if (value === "3")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-swords.jpg-wU8DRZDJEWpCaCQkq1z0qBaOfOrCDN.jpeg"
      else if (value === "4")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-swords.jpg-rCTihe3IGhTiIGEHNjHDwFmnVsYAXD.jpeg"
      else if (value === "5")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-swords.jpg-Hh1SF2fvD442nNxA1FH7Jqy3QuU2wO.jpeg"
      else if (value === "6")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-swords.jpg-sDaZV3jEsZz9WxGShlVQ7WwjbwquvC.jpeg"
      else if (value === "7")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-swords.jpg-B7vythd4DCsgBFxobBRRg7x67Grg7U.jpeg"
      else if (value === "8")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-swords.jpg-ZuZ3IGXCOTgDKnrvcAfVeEOUfcgHyJ.jpeg"
      else if (value === "9")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-swords.jpg-PT4bbyVRPkQNvQznfpfazgmPDHIZpb.jpeg"
      else if (value === "10")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-swords.jpg-GYnCdRpKiyjA6DDQLa6pB8shYz6Jhp.jpeg"
      else if (value === "page")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-swords.jpg-lP1mllBk5M4opSWf9HY2Omk2xu9fcJ.jpeg"
      else if (value === "knight")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-swords.jpg-6TKK2zvwPWwV9O1URXFrSrkN8wqQks.jpeg"
      else if (value === "queen")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-swords.jpg-noAseTB0yKPSU6Ac0wPUfx1x0PczXT.jpeg"
      else if (value === "king")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-swords.jpg-OtXJA2MtUgtsSCn62CsZMnCr5b39YQ.jpeg"
    } else if (suit === "pentacles") {
      if (value === "ace")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-of-pentacles.jpg-sOIxEMVL7AYzJHFBVZHadwkQNQ5INU.jpeg"
      else if (value === "2")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-of-pentacles.jpg-CYF4Kk57XozbdpMtcEzNqjFKULQEan.jpeg"
      else if (value === "3")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-of-pentacles.jpg-4edW40u19prYAlWLlXTpqLWhtnERrd.jpeg"
      else if (value === "4")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-of-pentacles.jpg-xc3cZEQ5a9W9wpjfR5jx4e9UAGxzoR.jpeg"
      else if (value === "5")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-of-pentacles.jpg-FHrMohEpyQspTW9SiBtZdhjFRWTzZ2.jpeg"
      else if (value === "6")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-of-pentacles.jpg-k1ZccRug9vFuXX8NGzPeNfLnlHhS9N.jpeg"
      else if (value === "7")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-of-pentacles.jpg-Q56TZYMSPr7RkPwfPV3Ax27Kb6BHQe.jpeg"
      else if (value === "8")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-of-pentacles.jpg-gHhaF7l39UimbmTZDDwHkU75xkI8Je.jpeg"
      else if (value === "9")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-of-pentacles.jpg-UZC0QT8V3Ai6DChLf6awGUwbOgi8Yt.jpeg"
      else if (value === "10")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-of-pentcles.jpg-pyvomqOb4EbMBVsC7f8PFMmFGLzYm0.jpeg"
      else if (value === "page")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/page-of-pentacles.jpg-8Y1jttau2zYwoYEXhOK8keTemNUVT2.jpeg"
      else if (value === "knight")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/knight-of-pentacles.jpg-0rJ5zpcRimJrcoOxAvhptXxxJDq8fM.jpeg"
      else if (value === "queen")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-pentacles.jpg-GyZ3HM2SZGZH7xreBIgDBXZzkNVA72.jpeg"
      else if (value === "king")
        image =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/king-of-pentacles.jpg-ieyyz6EdkWCQ9LbJ9aqU8ARyc627QB.jpeg"
    }

    // 画像が設定されている場合はそれを返す、そうでなければフォールバック
    if (image) {
      return image
    }
  }

  // フォールバック
  return `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(getMinorArcanaName(cardId))}`
}

// Wikimedia Commonsのパスを取得するヘルパー関数
function getWikimediaPath(suit: string, value: string): string {
  // 各スートと値に対応するWikimedia Commonsのパス
  const pathMap: Record<string, Record<string>> = {
    Wands: {
      "01": "1/11",
      "02": "2/2b",
      "03": "f/ff",
      "04": "a/a4",
      "05": "9/9d",
      "06": "3/3b",
      "07": "e/e4",
      "08": "6/6b",
      "09": "4/4d",
      "10": "0/0b",
      "11": "e/ec",
      "12": "1/16",
      "13": "0/0d",
      "14": "c/ce",
    },
    Cups: {
      "01": "3/36",
      "02": "f/f8",
      "03": "7/7a",
      "04": "3/35",
      "05": "d/d7",
      "06": "1/17",
      "07": "a/ae",
      "08": "6/60",
      "09": "2/24",
      "10": "8/84",
      "11": "a/ad",
      "12": "f/fa",
      "13": "6/62",
      "14": "0/04",
    },
    Swords: {
      "01": "1/1a",
      "02": "9/9e",
      "03": "0/02",
      "04": "b/bf",
      "05": "2/23",
      "06": "2/2c",
      "07": "3/34",
      "08": "a/a7",
      "09": "2/2f",
      "10": "d/da",
      "11": "4/4c",
      "12": "b/b0",
      "13": "d/d4",
      "14": "3/33",
    },
    Pents: {
      "01": "f/fd",
      "02": "9/9f",
      "03": "4/42",
      "04": "3/35",
      "05": "9/96",
      "06": "a/a6",
      "07": "6/6a",
      "08": "4/49",
      "09": "f/f0",
      "10": "4/42",
      "11": "e/ec",
      "12": "d/d5",
      "13": "8/88",
      "14": "1/1c",
    },
  }

  return pathMap[suit]?.[value] || "0/00"
}

// カードの状態を表すインターフェース
interface GameCard {
  id: number
  cardId: number
  name: string
  image: string
  isFlipped: boolean
  isMatched: boolean
  imageLoaded: boolean
  imageError: boolean // 画像読み込みエラーフラグを追加
  position?: { x: number; y: number } // シャッフルアニメーション用
}

// ゲームの状態を表すインターフェース
interface GameState {
  combo: number
  consecutiveMatches: number
}

// カードコンポーネントをメモ化
const Card = memo(({ card, index, handleCardClick, cardBackImage, currentRound, isWebView, handleImageError }: any) => {
  return (
    <div
      key={card.id}
      className={cn(
        "aspect-[2/3] card-container cursor-pointer transition-all duration-500",
        card.isFlipped ? "card-flipped" : "",
      )}
      onClick={() => handleCardClick(index)}
      style={{
        opacity: card.isMatched ? 0 : 1,
        pointerEvents: card.isMatched ? "none" : "auto",
      }}
    >
      <div className="card-inner">
        {/* カード表面 */}
        <div className="card-front shadow-md">
          <img
            src={
              isWebView
                ? card.image.includes("?")
                  ? card.image
                  : card.image + `?t=${card.id}-${currentRound}`
                : card.image || "/placeholder.svg?height=300&width=200&text=Loading..."
            }
            alt={card.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => handleImageError(e, { name: card.name, cardId: card.cardId })}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900/80 text-center py-1">
            <div className="text-amber-400 text-xs font-medium">{card.name}</div>
          </div>
        </div>

        {/* カード裏面 */}
        <div className="card-back shadow-md">
          <img
            src={cardBackImage || "/default-tarot-card-back.png"}
            alt="カード裏面"
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={(e) => {
              console.warn(`カード裏面画像読み込みエラー: ${e.currentTarget.src}`)
              e.currentTarget.src = "/placeholder.svg?height=300&width=200&text=Card+Back"
            }}
          />
        </div>
      </div>
    </div>
  )
})

import VictoryCelebration from "@/components/victory-celebration"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ClassicGamePage() {
  const router = useRouter()

  // コンポーネントの先頭（return文の前）に以下のコードを追加
  const [cardBackImage, setCardBackImage] = useState("/default-tarot-card-back.png")

  // カードバック画像の初期化部分を更新
  useEffect(() => {
    // 初期値として現在選択されているカードバックを設定
    const currentCardBack = getCurrentCardBackUrl()
    setCardBackImage(currentCardBack)
    console.log("Classic mode: Initial card back:", currentCardBack)

    // カードスーツ変更イベントのリスナーを追加
    const handleCardSuitChange = (event: Event) => {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail && customEvent.detail.imageUrl) {
          console.log("Classic mode: Card suit changed event received:", customEvent.detail)
          setCardBackImage(customEvent.detail.imageUrl)
        }
      } catch (error) {
        console.error("Card suit change event error:", error)
      }
    }

    window.addEventListener("cardSuitChanged", handleCardSuitChange)
    window.addEventListener("cardSuitRefresh", handleCardSuitChange)

    // 定期的に最新のカードバックを取得
    const refreshInterval = setInterval(() => {
      try {
        const latestCardBack = getCurrentCardBackUrl()
        if (latestCardBack !== cardBackImage) {
          console.log("Classic mode: Refreshing card back:", latestCardBack)
          setCardBackImage(latestCardBack)
        }
      } catch (error) {
        console.error("Error refreshing card back:", error)
      }
    }, 3000) // 3秒ごとに更新

    // クリーンアップ関数
    return () => {
      window.removeEventListener("cardSuitChanged", handleCardSuitChange)
      window.removeEventListener("cardSuitRefresh", handleCardSuitChange)
      clearInterval(refreshInterval)
    }
  }, [cardBackImage])

  // 状態変数
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cardInfoDialog, setCardInfoDialog] = useState<{ open: boolean; card: GameCard | null }>({
    open: false,
    card: null,
  })
  const [shuffleSoundPlayed, setShuffleSoundPlayed] = useState(false)
  // ゲーム進行中かどうかを追跡する状態を追加
  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(true)
  // カード情報ダイアログが閉じられた後の処理を防ぐためのフラグ
  const [isProcessingMatch, setIsProcessingMatch] = useState<boolean>(false)
  // 初期化中かどうかを追跡するフラグ
  const [isInitializing, setIsInitializing] = useState<boolean>(true)
  // 最後のペアを見つけたかどうかのフラグ
  const [foundLastPair, setFoundLastPair] = useState<boolean>(false)

  // 状態変数を追加
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  const [showVictoryDialog, setShowVictoryDialog] = useState<boolean>(false)
  // ゲームが初期化済みかどうかを追跡するフラグを追加
  const [isGameInitialized, setIsGameInitialized] = useState<boolean>(false)
  // 状態変数を追加
  const [showGameOverDialog, setShowGameOverDialog] = useState<boolean>(false)
  // シャッフル中かどうかを追跡するフラグ
  const [isShuffling, setIsShuffling] = useState<boolean>(false)
  // カード画像URLのキャッシュ
  const [cardImageUrls, setCardImageUrls] = useState<Record<number, string>>({})
  // スコア記録後のリセットフラグを追加
  const [showVictoryAfterCardInfo, setShowVictoryAfterCardInfo] = useState<boolean>(false)
  // 現在のラウンド数を追跡
  const [currentRound, setCurrentRound] = useState<number>(1)
  // WebView環境かどうかを検出
  const [isWebView, setIsWebView] = useState<boolean>(false)
  // 画像読み込みエラーの詳細を追跡
  const [imageErrors, setImageErrors] = useState<Record<string, string[]>>({})
  // 状態変数を追加（他の状態変数の近くに）
  const [preventCardClick, setPreventCardClick] = useState<boolean>(false)

  // ゲーム状態をrefで管理（コンボ関連）
  const gameStateRef = useRef<GameState>({
    combo: 1,
    consecutiveMatches: 0,
  })

  // 表示用のコンボ状態
  const [displayCombo, setDisplayCombo] = useState<number>(1)

  const { toast } = useToast()
  const { soundEnabled, textToSpeechEnabled, speak, stopSpeaking, playSound, audioLoaded, includeMinorArcanaInGames } =
    useSettings()

  // useShopを使用する - pointsも取得
  const { addPoints, points } = useShop()

  // 初期化済みのカードIDを追跡する参照
  const initializedCardIds = useRef<Set<number>>(new Set())
  // 画像読み込みの再試行回数を追跡
  const imageRetryCount = useRef<Record<string, number>>({})

  // WebView検出
  useEffect(() => {
    const detectWebView = () => {
      // UserAgentベースの検出
      const ua = navigator.userAgent.toLowerCase()
      const isAndroidWebView = ua.indexOf("wv") > -1 || ua.indexOf("webview") > -1
      const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua)

      // 特定のインターフェースの存在確認
      const hasWebViewBridge =
        typeof window !== "undefined" &&
        (window.ReactNativeWebView !== undefined ||
          window.Android !== undefined ||
          window.webkit?.messageHandlers !== undefined)

      const result = isAndroidWebView || isIOSWebView || hasWebViewBridge
      setIsWebView(result)

      return result
    }

    detectWebView()
  }, [])

  // コンボを更新する関数
  const updateCombo = useCallback(
    (isMatch: boolean) => {
      if (isMatch) {
        // ペアが見つかった場合、コンボを増加
        const newCombo = Math.min(gameStateRef.current.combo + 1, 8) // 最大8倍
        gameStateRef.current.combo = newCombo
        gameStateRef.current.consecutiveMatches += 1

        toast({
          title: `コンボ！${newCombo}回目`,
          description: "連続でペアを見つけました！",
          duration: 2000,
        })

        // 表示用のコンボを更新
        setDisplayCombo(newCombo)
        console.log(`現在のコンボ: ${newCombo}回目`)
      } else {
        // ペアが見つからなかった場合、コンボをリセット
        gameStateRef.current.combo = 1
        gameStateRef.current.consecutiveMatches = 0

        // 表示用のコンボを更新
        setDisplayCombo(1)
        console.log("コンボリセット")
      }

      return gameStateRef.current.combo
    },
    [toast],
  )

  // カードをめくる効果音を再生
  const openCardInfoDialog = (card: GameCard) => {
    setCardInfoDialog({ open: true, card: card })
  }

  // カードめくりアニメーションのCSSを追加
  useEffect(() => {
    // カスタムCSSを追加
    const style = document.createElement("style")
    style.textContent = `
    .card-container {
      perspective: 1000px;
      width: 100%;
      height: 100%;
    }
    
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d;
      will-change: transform; /* アニメーション最適化 */
    }
    
    .card-flipped .card-inner {
      transform: rotateY(180deg);
    }
    
    .card-front, .card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .card-front {
      transform: rotateY(180deg);
      border: 2px solid #f59e0b;
    }
    
    .card-back {
      border: 2px solid #7c3aed;
    }

    /* コンボ表示のアニメーション */
    @keyframes comboScale {
      0% { transform: scale(1); }
      50% { transform: scale(1.5); }
      100% { transform: scale(1); }
    }
    
    .combo-animation {
      animation: comboScale 0.5s ease-in-out;
    }

    /* コンボ表示の色変化 */
    .combo-1 { color: #10b981; }
    .combo-2 { color: #3b82f6; }
    .combo-3 { color: #8b5cf6; }
    .combo-4 { color: #ec4899; }
    .combo-5 { color: #f59e0b; }
    .combo-6 { color: #ef4444; }
    .combo-7 { color: #f97316; }
    .combo-8 { color: #f43f5e; }
  `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // 画像URLをキャッシュする
  useEffect(() => {
    const urls: Record<number, string> = {}
    for (let i = 0; i < 22; i++) {
      urls[i] = getCardImageUrl(i)
    }
    setCardImageUrls(urls)
  }, [])

  // initializeGame関数をuseCallbackでラップして、依存関係を明示的に管理
  const initializeGame = useCallback(() => {
    console.log("=== initializeGame開始 ===")
    console.log("現在の状態:", {
      isGameInitialized,
      isLoading,
      cardsLength: cards.length,
      includeMinorArcanaInGames,
    })
    // 初期化中フラグを設定
    setIsInitializing(true)
    setIsLoading(true)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setScore(0)
    setDisplayCombo(1) // 表示用コンボを1に設定
    setIsGameInProgress(true) // ゲーム進行中フラグをリセット
    setIsProcessingMatch(false) // マッチ処理中フラグをリセット
    setFoundLastPair(false) // 最後のペアを見つけたフラグをリセット
    setIsShuffling(false) // シャッフル中フラグをリセット
    setShowVictoryAfterCardInfo(false) // 勝利ダイアログ表示フラグをリセット
    setCurrentRound(1) // ラウンド数を1にリセット

    // 画像読み込みの再試行回数をリセット
    imageRetryCount.current = {}

    // ゲーム状態の初期化
    gameStateRef.current = {
      combo: 1,
      consecutiveMatches: 0,
    }

    initializedCardIds.current = new Set() // 初期化済みカードIDをリセット

    // シャッフル音を一度だけ再生（初回のみ）
    if (!shuffleSoundPlayed) {
      playSound("shuffle")
      setShuffleSoundPlayed(true)
    }

    // 設定に基づいてカードを選択
    let availableCards = []

    if (includeMinorArcanaInGames) {
      // 小アルカナを含める場合は全カードから選択
      try {
        // 大アルカナカードを確実に取得
        const majorArcanaCards = Array.from({ length: 22 }, (_, i) => {
          const imageUrl = cardImageUrls[i] || getCardImageUrl(i)
          return {
            id: i,
            name: getCardName(i),
            image: imageUrl,
          }
        })

        // 小アルカナカードを直接定義（画像URLも含む）
        const minorArcanaCards = [
          // ワンド（22-35）
          ...Array.from({ length: 14 }, (_, i) => ({
            id: 22 + i,
            name: getMinorArcanaName(22 + i),
            image: getMinorArcanaImageUrl(22 + i),
          })),
          // カップ（36-49）
          ...Array.from({ length: 14 }, (_, i) => ({
            id: 36 + i,
            name: getMinorArcanaName(36 + i),
            image: getMinorArcanaImageUrl(36 + i),
          })),
          // ソード（50-63）
          ...Array.from({ length: 14 }, (_, i) => ({
            id: 50 + i,
            name: getMinorArcanaName(50 + i),
            image: getMinorArcanaImageUrl(50 + i),
          })),
          // ペンタクル（64-77）
          ...Array.from({ length: 14 }, (_, i) => ({
            id: 64 + i,
            name: getMinorArcanaName(64 + i),
            image: getMinorArcanaImageUrl(64 + i),
          })),
        ].filter((card) => !EXCLUDED_CARD_IDS.includes(card.id.valueOf()))

        // 両方を結合
        availableCards = [...majorArcanaCards, ...minorArcanaCards]

        console.log(
          `利用可能なカード数: ${availableCards.length} (大アルカナ: ${majorArcanaCards.length}, 小アルカナ: ${minorArcanaCards.length})`,
        )

        // カードをシャッフルして8枚選択
        const shuffledTarot = [...availableCards].sort(() => 0.5 - Math.random()).slice(0, 8)
        console.log(
          "選択されたカード:",
          shuffledTarot.map((c) => `${c.name}(ID:${c.id})`),
        )

        // 各カードを2枚ずつ（ペア）作成
        let gameCards: GameCard[] = []
        shuffledTarot.forEach((card) => {
          const cardId = card.id
          initializedCardIds.current.add(cardId)

          // 1枚目
          gameCards.push({
            id: gameCards.length,
            cardId: cardId,
            name: card.name,
            image: card.image,
            isFlipped: false,
            isMatched: false,
            imageError: false,
            imageLoaded: false,
          })

          // 2枚目（同じcardIdを持つ）
          gameCards.push({
            id: gameCards.length,
            cardId: cardId,
            name: card.name,
            image: card.image,
            isFlipped: false,
            isMatched: false,
            imageError: false,
            imageLoaded: false,
          })
        })

        // カードをシャッフル
        gameCards = gameCards.sort(() => 0.5 - Math.random())
        setCards(gameCards)
        console.log("カード設定完了:", gameCards.length, "枚")
        console.log(
          "設定されたカード:",
          gameCards.map((c) => `${c.name}(${c.cardId})`),
        )
        setIsLoading(false)
        setIsInitializing(false)
        setIsGameInitialized(true)
        console.log("=== initializeGame完了 ===")
      } catch (error) {
        console.error("小アルカナ含有モードでエラー:", error)
        // エラーが発生した場合は大アルカナのみで続行
        fallbackToMajorArcana()
      }
    } else {
      // 大アルカナのみ
      fallbackToMajorArcana()
    }

    // 大アルカナのみを使用するフォールバック関数
    function fallbackToMajorArcana() {
      // 大アルカナカードを準備
      const majorArcanaCards = Array.from({ length: 22 }, (_, i) => {
        const imageUrl = cardImageUrls[i] || getCardImageUrl(i)
        return {
          id: i,
          name: getCardName(i),
          image: imageUrl,
        }
      })

      // カードをシャッフルして8枚選択
      const shuffledTarot = [...majorArcanaCards].sort(() => 0.5 - Math.random()).slice(0, 8)

      // 各カードを2枚ずつ（ペア）作成
      let gameCards: GameCard[] = []
      shuffledTarot.forEach((card) => {
        const cardId = card.id
        initializedCardIds.current.add(cardId)

        // 1枚目
        gameCards.push({
          id: gameCards.length,
          cardId: cardId,
          name: card.name,
          image: card.image,
          isFlipped: false,
          isMatched: false,
          imageLoaded: false,
          imageError: false,
        })

        // 2枚目
        gameCards.push({
          id: gameCards.length,
          cardId: cardId,
          name: card.name,
          image: card.image,
          isFlipped: false,
          isMatched: false,
          imageLoaded: false,
          imageError: false,
        })
      })

      // カードをシャッフル
      gameCards = gameCards.sort(() => 0.5 - Math.random())
      setCards(gameCards)
      console.log("カード設定完了:", gameCards.length, "枚")
      console.log(
        "設定されたカード:",
        gameCards.map((c) => `${c.name}(${c.cardId})`),
      )
      setIsLoading(false)
      setIsInitializing(false)
      setIsGameInitialized(true)
      console.log("=== initializeGame完了 ===")
    }
  }, [
    playSound,
    shuffleSoundPlayed,
    includeMinorArcanaInGames,
    cardImageUrls,
    setIsLoading,
    setFlippedCards,
    setMatchedPairs,
    setMoves,
    setScore,
    setDisplayCombo,
    setIsGameInProgress,
    setIsProcessingMatch,
    isGameInitialized,
    cards,
  ])

  useEffect(() => {
    if (!isGameInitialized) {
      initializeGame()
    }

    return () => {
      // コンポーネントのアンマウント時に読み上げを停止
      stopSpeaking()
    }
  }, [isGameInitialized, initializeGame, stopSpeaking])

  const resetGame = () => {
    console.log("ゲームリセット")
    // window.location.reload()を使わずに状態をリセット
    setIsGameInitialized(false)
    setIsLoading(true)

    // 少し遅延させて再初期化
    setTimeout(() => {
      initializeGame()
    }, 100)
  }

  // カード情報ダイアログが開いたときにカード名とコンボ倍率を読み上げる
  useEffect(() => {
    if (cardInfoDialog.open && textToSpeechEnabled && audioLoaded) {
      // カード名の読み上げ部分とコンボ倍率の読み上げを削除しました
      return () => {
        stopSpeaking()
      }
    }
  }, [
    cardInfoDialog.open,
    textToSpeechEnabled,
    audioLoaded,
    speak,
    stopSpeaking,
    displayCombo,
    cardInfoDialog.card?.name,
  ])

  // バックアップ画像のURLを取得する関数
  const getBackupImageUrlById = (cardId: number): string => {
    try {
      // 大アルカナの場合
      if (cardId >= 0 && cardId <= 21) {
        // Vercel Blob Storageの画像を優先的に使用
        const blobUrls: Record<number, string> = {
          0: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-the-fool.jpg-qMIhIdJbLFFDcbG6DCuVeJpdMxYYFF.jpeg",
          1: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-the-magician.jpg-PKdG2cPVPYUaSTJyAQy3aKvkCrCLwL.jpeg",
          2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-the-high-priestess.jpg-YraHWJEM3BVr9nUX0DEQVnz75AO4Ju.jpeg",
          3: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-the-empress.jpg-WtFbAgyVTI4gO8RzJkIgq8Clot9a2Z.jpeg",
          4: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4-the-emperor.jpg-QvRCOUbuXLX8J3uLPT3TzAsVAxNL81.jpeg",
          5: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-the-hierophant.jpg-XX882Wenrj2uZI6O2YRhpUDS53puP7.jpeg",
          6: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6-the-lovers.jpg-r5sFSHZJlffXRhawcvLeC1gtUe6wlG.jpeg",
          7: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7-the-chariot.jpg-4ZyGVwUgwF4pJ3io6a4mcguNvVrtKU.jpeg",
          8: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8-strength.jpg-uYkF18PIdhJBnW9aPRFqNmLsVzbyVy.jpeg",
          9: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9-the-hermit.jpg-lSgaW8YCkTfjVeg1PQa1nCA3FBMQFz.jpeg",
          10: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-wheel-of-fortune.jpg-wgeUsJcjpGaFq7H0ZjIgl1yWyxyKFR.jpeg",
          11: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/11-justice.jpg-acM0yRB2NWKdMzpXyctcIYb67gccRc.jpeg",
          12: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/12-the-hanged-man.jpg-I7QImjNEyPcoXcCV2Zr2d35KewHlWq.jpeg",
          13: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/13-death.jpg-J0PTAiPztA6qzlpGQINoO92MaKphrV.jpeg",
          14: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-temperance.jpg-kO6BMsCpNJuJEzAioFgyLOUUQMDGEh.jpeg",
          15: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/15-the-devil.jpg-RoornKKvcHXyJLLY4gXM9XlDqPsWDW.jpeg",
          16: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/16-the-tower.jpg-2qD572YP7T5eLZVCzL4yDW3la44yDL.jpeg",
          17: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/17-the-star.jpg-btLZ7a8dSYhhbNGSuYn85LICydZ7w3.jpeg",
          18: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18-the-moon.jpg-8qr3hzWSQiQ3lKTJX8T4D3P7ECWUb1.jpeg",
          19: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19-the-sun.jpg-DXpvNqh1OFJzpwh1aD0OBUbQkSpbZQ.jpeg",
          20: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20-judgement.jpg-2E1PWIPfjQZXH1qhnpyS6cx18PZUIO.jpeg",
          21: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/21-the-world.jpg-wVVLmPfvFrEUueWlS0jn3xFihvnTm1.jpeg",
        }

        // Vercel Blob Storageの画像があればそれを使用
        if (blobUrls[cardId]) {
          return blobUrls[cardId]
        }

        // Wikimedia Commonsの画像を使用
        const wikiUrls: Record<number, string> = {
          0: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
          1: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
          2: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
          3: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
          4: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
          5: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
          6: "https://upload.wikimedia.org/wikipedia/commons/3/3a/RWS_Tarot_06_Lovers.jpg",
          7: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg",
          8: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
          9: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
          10: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
          11: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg",
          12: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
          13: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
          14: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
          15: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
          16: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
          17: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
          18: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
          19: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
          20: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
          21: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
        }

        if (wikiUrls[cardId]) {
          return wikiUrls[cardId]
        }

        // 特別なケース: ワンドの9
        if (cardId === 30) {
          // ワンドの9のID
          return "https://www.sacred-texts.com/tarot/pkt/img/wa09.jpg"
        }
      }

      // 小アルカナの場合
      // スートと数字を取得
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

        // 小アルカナカードの画像URL
        return `/images/tarot/${suit}/${value}-of-${suit}.png`
      }

      // どちらも該当しない場合はプレースホルダーを生成
      return `/placeholder.svg?height=300&width=200&query=tarot card ${cardId}`
    } catch (error) {
      console.error(`バックアップ画像URLの取得に失敗しました (ID: ${cardId}):`, error)
      return `/placeholder.svg?height=300&width=200&query=tarot card ${cardId}`
    }
  }

  // 画像読み込みエラー時の処理を改善
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>, card: { name: string; cardId: number }) => {
      const target = e.currentTarget
      if (!target) {
        return
      }

      const originalSrc = target.src

      // バックアップ画像を使用
      const backupUrl = getBackupImageUrlById(card.cardId)
      target.src = backupUrl

      // バックアップ画像も失敗した場合のハンドラ
      target.onerror = (event) => {
        const imgElement = event?.currentTarget as HTMLImageElement
        if (!imgElement) return

        // 最終手段としてシンプルなプレースホルダーを使用
        imgElement.src = `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(card.name)}`
        imgElement.onerror = null // これ以上のエラーを防ぐ
      }
    },
    [],
  )

  // カードをクリックしたときの処理
  const handleCardClick = useCallback(
    (index: number) => {
      console.log("Card click attempt:", {
        preventCardClick,
        isShuffling,
        isProcessingMatch,
        isGameInProgress,
        cardInfoDialogOpen: cardInfoDialog.open,
      })

      if (
        preventCardClick ||
        isShuffling ||
        isProcessingMatch ||
        !isGameInProgress ||
        cardInfoDialog.open || // この行を追加
        flippedCards.length >= 2 ||
        cards[index].isFlipped ||
        cards[index].isMatched
      ) {
        console.log("Card click prevented")
        return
      }

      console.log("Card click allowed")

      // カードをめくる効果音を再生
      playSound("flip")

      const newFlippedCards = [...flippedCards, index]
      setFlippedCards(newFlippedCards)

      setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)))
      setMoves((prevMoves) => prevMoves + 1)

      if (newFlippedCards.length === 2) {
        setIsProcessingMatch(true) // マッチ処理中フラグを設定

        setTimeout(() => {
          const [firstIndex, secondIndex] = newFlippedCards
          const firstCard = cards[firstIndex]
          const secondCard = cards[secondIndex]

          if (firstCard.cardId === secondCard.cardId) {
            // ペアが見つかった場合
            playSound("correct")

            // マッチしたペアの数を更新
            setMatchedPairs((prevMatchedPairs) => {
              const newMatchedPairs = prevMatchedPairs + 1
              // すべてのペアを見つけた場合
              if (newMatchedPairs >= 8) {
                setFoundLastPair(true)
                // 最後のペアを見つけた場合は、カード情報ダイアログの後に勝利ダイアログを表示するフラグを設定
                setShowVictoryAfterCardInfo(true)
              }
              return newMatchedPairs
            })

            setCards((prevCards) =>
              prevCards.map((card) => (card.cardId === firstCard.cardId ? { ...card, isMatched: true } : card)),
            )

            // コンボを更新（ペアが見つかった場合）
            const newCombo = updateCombo(true)

            // スコア計算（統一版：100点 + 2のn乗倍コンボボーナス）
            const baseScore = 100
            const comboBonus = newCombo === 1 ? 0 : baseScore * Math.pow(2, newCombo - 1)
            const pairScore = baseScore + comboBonus
            console.log(`スコア計算: ${newCombo}回目, 基本スコア${baseScore}, ボーナス${comboBonus}, 合計${pairScore}`)

            // タロットポイント計算は削除
            setScore((prevScore) => {
              const newScore = prevScore + pairScore
              console.log(`スコア更新: ${prevScore} + ${pairScore} = ${newScore}`)
              return newScore
            })
            // addPoints(tpToAdd) の行を削除
            // setEarnedTarotPoints((prev) => prev + tpToAdd) の行を削除

            // コンボ倍率の読み上げのみ（TPは削除）
            if (textToSpeechEnabled && newCombo > 1) {
              stopSpeaking()
              speak(`${newCombo}倍`)
            }

            // カード情報ダイアログを表示
            openCardInfoDialog(firstCard)
          } else {
            // ペアが見つからなかった場合
            // 不正解音を再生しない（耳障りなため）
            // playSound("wrong") の行を削除

            // コンボをリセット
            updateCombo(false)

            toast({
              title: "残念！",
              description: "もう一度試してください。",
              duration: 2000,
            })

            // カードを裏に戻す
            setTimeout(() => {
              setCards((prevCards) =>
                prevCards.map((card, i) =>
                  newFlippedCards.includes(i) && !card.isMatched ? { ...card, isFlipped: false } : card,
                ),
              )
              setFlippedCards([])
              setIsProcessingMatch(false) // マッチ処理中フラグを解除
            }, 1000)
          }
        }, 1000)
      }
    },
    [
      isShuffling,
      isProcessingMatch,
      isGameInProgress,
      flippedCards,
      cards,
      playSound,
      updateCombo,
      toast,
      textToSpeechEnabled,
      stopSpeaking,
      speak,
      addPoints,
      setCards,
      setFlippedCards,
      setMatchedPairs,
      setMoves,
      setScore,
      preventCardClick,
      cardInfoDialog.open,
    ],
  )

  // カード情報ダイアログを閉じる関数
  const handleCardInfoDialogClose = useCallback(() => {
    console.log("Closing card info dialog")
    setCardInfoDialog({ open: false, card: null })
    stopSpeaking()

    // カードクリックを一時的に無効化（より長い時間）
    setPreventCardClick(true)
    console.log("Card click disabled")

    // 1000ms後にカードクリックを再有効化
    setTimeout(() => {
      setPreventCardClick(false)
      console.log("Card click re-enabled")
    }, 1000)

    // 最後のペアを見つけた後にカード情報ダイアログを閉じた場合
    if (showVictoryAfterCardInfo) {
      setTimeout(() => {
        setShowConfetti(true)
        setShowVictoryDialog(true)
        setIsGameInProgress(false)
      }, 1000)
      setShowVictoryAfterCardInfo(false)
    } else {
      // 通常のペアの場合
      // マッチ処理中フラグを解除
      setTimeout(() => {
        setIsProcessingMatch(false)
        // めくったカードをリセット
        setFlippedCards([])
      }, 500)
    }
  }, [
    setCardInfoDialog,
    stopSpeaking,
    showVictoryAfterCardInfo,
    setShowConfetti,
    setShowVictoryDialog,
    setIsGameInProgress,
    setIsProcessingMatch,
    setFlippedCards,
    setPreventCardClick,
  ])

  // 勝利ダイアログを閉じる関数
  const handleVictoryDialogClose = () => {
    setShowVictoryDialog(false)
    // 直接メニューに戻る\
    setTimeout(() => {
      router.push("/game")
    }, 500)
  }

  const handleSaveScore = useCallback(
    (playerName?: string) => {
      try {
        const finalPlayerName = playerName?.trim() || "プレイヤー"

        // 最終スコアの1/100をタロットポイントとして計算
        const finalTarotPoints = Math.max(1, Math.floor(score / 100))

        const wasAdded = addScore("classic", score, moves, finalPlayerName, finalTarotPoints)

        // タロットポイントを加算
        addPoints(finalTarotPoints)

        if (wasAdded) {
          toast({
            title: "ハイスコアを記録しました！",
            description: `${finalPlayerName}: ${score}点, +${finalTarotPoints}TP獲得！`,
            duration: 3000,
          })
        } else {
          toast({
            title: "スコアを記録しました",
            description: `${finalPlayerName}: ${score}点, +${finalTarotPoints}TP獲得！`,
            duration: 3000,
          })
        }

        // スコア保存後に少し待ってからメニューに戻る
        setTimeout(() => {
          router.push("/game")
        }, 1500)
      } catch (error) {
        console.error("スコア保存エラー:", error)
        toast({
          variant: "destructive",
          title: "スコアの保存に失敗しました",
          description: error.message || "不明なエラーが発生しました",
          duration: 3000,
        })

        // エラーが発生してもメニューに戻る
        setTimeout(() => {
          router.push("/game")
        }, 2000)
      }
    },
    [score, moves, toast, router, addPoints, addScore],
  )

  // コンボ表示用のCSSクラスを取得
  const getComboClass = (combo: number) => {
    return `combo-${Math.min(combo, 8)}`
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="mt-4 text-xl text-purple-300">ゲームを準備中...</p>
        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          ページをリロード
        </button>
        <div className="mt-2 text-sm text-gray-400">
          デバッグ情報: カード数={cards.length}, 初期化済み={isGameInitialized.toString()}
        </div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-6">
      {/* デバッグ情報 */}
      <div className="text-xs text-gray-500 text-center">
        デバッグ: カード数={cards.length}, ゲーム初期化={isGameInitialized.toString()}, ローディング=
        {isLoading.toString()}, preventCardClick={preventCardClick.toString()}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-400">クラシックモード</h1>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-sm text-purple-300">手数</p>
            <p className="text-2xl font-bold text-white">{moves}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-300">見つけたペア</p>
            <p className="text-2xl font-bold text-white">{matchedPairs} / 8</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-300">スコア</p>
            <p className="text-2xl font-bold text-white">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-300">コンボ</p>
            <p className={`text-2xl font-bold ${getComboClass(displayCombo)}`}>{displayCombo}x</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-300">TP</p>
            <p className="text-2xl font-bold text-amber-400">{points}</p>
          </div>
        </div>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 max-w-md mx-auto">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            handleCardClick={handleCardClick}
            cardBackImage={cardBackImage}
            currentRound={currentRound}
            isWebView={isWebView}
            handleImageError={handleImageError}
          />
        ))}
      </div>

      {/* リセットボタン */}
      <div className="text-center">
        <button onClick={resetGame} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
          ゲームをリセット
        </button>
      </div>

      {/* カード情報ダイアログ - ハードモードと同じスタイル */}
      <Dialog
        open={cardInfoDialog.open}
        onOpenChange={(open) => {
          if (!open && cardInfoDialog.open) {
            handleCardInfoDialogClose()
          }
        }}
      >
        <DialogContent className="bg-gray-900 border-purple-700">
          <DialogHeader>
            <DialogTitle className="text-2xl text-amber-400">{cardInfoDialog.card?.name}</DialogTitle>
            <DialogDescription className="text-purple-300">タロットカードの意味</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/3">
              {cardInfoDialog.card && (
                <div
                  className="w-full rounded-lg border-2 border-amber-600 shadow-lg shadow-amber-500/20 overflow-hidden cursor-pointer"
                  onClick={handleCardInfoDialogClose}
                >
                  <img
                    src={cardInfoDialog.card.image || "/placeholder.svg"}
                    alt={cardInfoDialog.card.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      handleImageError(e, { name: cardInfoDialog.card!.name, cardId: cardInfoDialog.card!.cardId })
                    }
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                    <span className="text-white text-opacity-0 hover:text-opacity-100 text-sm">タップして閉じる</span>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full sm:w-2/3 text-white">
              <h3 className="font-bold text-amber-400 mb-2">基本的な意味</h3>
              <p className="mb-4">{getCardDescription(cardInfoDialog.card?.cardId || 0)}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-900/30 p-2 rounded-md">
                  <span className="font-bold text-green-400">正位置:</span>{" "}
                  {getCardUpright(cardInfoDialog.card?.cardId || 0)}
                </div>
                <div className="bg-red-900/30 p-2 rounded-md">
                  <span className="font-bold text-red-400">逆位置:</span>{" "}
                  {getCardReversed(cardInfoDialog.card?.cardId || 0)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              className="bg-purple-700 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
              onClick={handleCardInfoDialogClose}
            >
              閉じる
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 勝利ダイアログ */}
      <VictoryCelebration
        open={showVictoryDialog}
        onClose={handleVictoryDialogClose}
        score={score}
        gameMode="classic"
        moves={moves}
        tarotPoints={Math.max(1, Math.floor(score / 100))}
        onSaveScore={handleSaveScore}
      />
    </div>
  )
}
