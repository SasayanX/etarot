"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "ja" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// 翻訳データ
const translations = {
  ja: {
    // ホームページ
    "home.title": "無料タロット占い",
    "home.subtitle": "占い・辞典・クイズ・ゲームでタロットを学ぼう",
    "home.fortune.title": "今日の運勢を占う",
    "home.fortune.description": "タロットカードがあなたの未来を照らします",
    "home.fortune.button": "占う",
    "home.dictionary.title": "タロット辞典",
    "home.dictionary.description": "78枚のカードの意味を学ぶ",
    "home.dictionary.button": "調べる",
    "home.quiz.title": "タロットクイズ",
    "home.quiz.description": "知識を試そう",
    "home.quiz.button": "挑戦する",
    "home.game.title": "タロットゲーム",
    "home.game.description": "記憶力を試しながらタロットを学ぼう",
    "home.game.button": "プレイする",
    "home.skins.title": "カードバックショップ",
    "home.skins.description": "お気に入りのデザインを選ぼう",
    "home.skins.button": "ショップへ",

    // ボトムナビゲーション
    "nav.home": "ホーム",
    "nav.fortune": "占い",
    "nav.dictionary": "辞典",
    "nav.quiz": "クイズ",
    "nav.game": "ゲーム",
    "nav.skins": "お店",
    "nav.supervisor": "監修者",
    "nav.settings": "設定",

    // 占いページ
    "fortune.title": "タロット占い",
    "fortune.subtitle": "カードがあなたの運命を照らします",
    "fortune.shuffling": "カードをシャッフル中...",
    "fortune.skip": "スキップ",
    "fortune.click.instruction": "カードをクリックしてめくってください",
    "fortune.preparing": "カードを準備しています...",
    "fortune.reading.title": "占い結果を読み解いています...",
    "fortune.reading.description": "カードのメッセージを解読中です。少々お待ちください。",
    "fortune.result.title": "占い結果",
    "fortune.lucky.item": "今日のラッキーアイテム",
    "fortune.amazon.button": "Amazonで探す",
    "fortune.new.reading": "新しい占いを始める",
    "fortune.error.title": "カードの準備中にエラーが発生しました",
    "fortune.error.description": "カードを表示できませんでした。もう一度試してみてください。",
    "fortune.error.details": "エラー詳細:",
    "fortune.error.retry": "再試行",
    "fortune.error.back": "戻る",
    "fortune.error.timeout": "タイムアウトが発生しました。再試行してください。",
    "fortune.error.no.cards": "カードが表示されていません",
    "fortune.error.no.cards.description": "カードの準備中に問題が発生しました。もう一度試してみてください。",
    "fortune.type.daily.name": "今日の運勢（ワンオラクル）",
    "fortune.type.daily.description": "今日のあなたを象徴するカード",
    "fortune.type.love.name": "恋愛占い（スリーカード）",
    "fortune.type.love.description": "過去・現在・未来の恋愛運",
    "fortune.type.career.name": "仕事占い（スリーカード）",
    "fortune.type.career.description": "現状・課題・アドバイス",
    "fortune.type.decision.name": "決断占い",
    "fortune.type.decision.description": "二つの選択肢の行方",
    "fortune.type.money.name": "金運占い（スリーカード）",
    "fortune.type.money.description": "現状・課題・アドバイス",
    "fortune.cards.count": "{count}枚のカードで占います",
    "fortune.select.button": "選択する",

    // 占いポジション
    "fortune.position.daily": "今日の運勢",
    "fortune.position.past": "過去",
    "fortune.position.present": "現在",
    "fortune.position.future": "未来",
    "fortune.position.current": "現状",
    "fortune.position.challenge": "課題",
    "fortune.position.advice": "アドバイス",
    "fortune.position.option.a": "選択肢A",
    "fortune.position.option.b": "選択肢B",
    "fortune.position.upright": "正位置",
    "fortune.position.reversed": "逆位置",

    // 設定ページ
    "settings.title": "設定",
    "settings.language": "言語設定",
    "settings.language.description": "表示言語を選択してください",
    "settings.language.select": "言語を選択",
    "settings.sound": "サウンド設定",
    "settings.sound.description": "効果音と音声読み上げの設定",
    "settings.sound.effects": "効果音",
    "settings.sound.tts": "テキスト読み上げ",
    "settings.sound.test": "読み上げテスト",
    "settings.sound.note": "※環境によっては発声されない場合があります",
    "settings.cards": "カード設定",
    "settings.cards.description": "タロットカードの表示設定",
    "settings.cards.minor.fortune": "占いに小アルカナを含める（現在利用不可）",
    "settings.cards.minor.games": "ゲームに小アルカナを含める",
    "settings.cards.note": "小アルカナを含めると、より多様なカードが表示されます。",
    "settings.back": "ホームに戻る",
    "language.japanese": "🇯🇵 日本語",
    "language.english": "🇺🇸 English",

    // 辞典ページ
    "dictionary.title": "タロット辞典",
    "dictionary.subtitle": "78枚のカードの意味を学ぼう",
    "dictionary.search.placeholder": "カードを検索...",
    "dictionary.loading": "Loading...",
    "dictionary.tab.major": "大アルカナ",
    "dictionary.tab.minor": "小アルカナ（全て）",
    "dictionary.tab.wands": "ワンド",
    "dictionary.tab.cups": "カップ",
    "dictionary.tab.swords": "ソード",
    "dictionary.tab.pentacles": "ペンタクル",

    // カード名（大アルカナ）
    "card.fool": "愚者",
    "card.magician": "魔術師",
    "card.high_priestess": "女教皇",
    "card.empress": "女帝",
    "card.emperor": "皇帝",
    "card.hierophant": "教皇",
    "card.lovers": "恋人",
    "card.chariot": "戦車",
    "card.strength": "力",
    "card.hermit": "隠者",
    "card.wheel_of_fortune": "運命の輪",
    "card.justice": "正義",
    "card.hanged_man": "吊るされた男",
    "card.death": "死神",
    "card.temperance": "節制",
    "card.devil": "悪魔",
    "card.tower": "塔",
    "card.star": "星",
    "card.moon": "月",
    "card.sun": "太陽",
    "card.judgement": "審判",
    "card.world": "世界",

    // 小アルカナのスート
    "suit.wands": "ワンド",
    "suit.cups": "カップ",
    "suit.swords": "ソード",
    "suit.pentacles": "ペンタクル",

    // 小アルカナのランク
    "rank.ace": "エース",
    "rank.page": "ペイジ",
    "rank.knight": "ナイト",
    "rank.queen": "クイーン",
    "rank.king": "キング",

    // カード詳細モーダル
    "card.detail.overview": "概要",
    "card.detail.upright": "正位置",
    "card.detail.reversed": "逆位置",
    "card.detail.positive": "ポジティブ解釈",
    "card.detail.negative": "ネガティブ解釈",
    "card.detail.keywords": "キーワード",
    "card.detail.speak": "読み上げ",
    "card.detail.close": "閉じる",
    "card.detail.image.error": "画像を読み込めませんでした",

    // 小アルカナの接続詞
    "card.connector": "の",

    // カード詳細情報（大アルカナ）
    "card.details.0.description":
      "愚者は、新しい旅の始まりを表しています。無邪気さ、自由、冒険心、そして未知の世界へ第一歩を踏み出す勇気を象徴しています。",
    "card.details.0.keywords": "冒険、新しい始まり、自由、無邪気さ、自発性",
    "card.details.0.upright": "新しい始まり、冒険、自由な精神、無邪気さ、自発性、可能性",
    "card.details.0.reversed": "無謀さ、不注意、リスク、計画性の欠如、愚かさ",
    "card.details.0.positive": "あなたは新しい可能性に対して心を開いており、自由に冒険する勇気を持っています。",
    "card.details.0.negative": "計画性の欠如や危険に対する無謀な無視が問題を引き起こす可能性があります。",

    "card.details.1.description":
      "魔術師は、創造性と意志力を表しています。自分の能力を活用して現実を形作る力を持っています。",
    "card.details.1.keywords": "創造性、意志力、スキル、自信、集中力",
    "card.details.1.upright": "創造性、スキル、自信、意志力、集中力、才能の発揮",
    "card.details.1.reversed": "操作、不正、才能の無駄遣い、自己不信",
    "card.details.1.positive": "あなたは自分の才能と能力を最大限に活用することで、望む現実を創造することができます。",
    "card.details.1.negative": "自分の能力を間違った方向に使ったり、才能を無駄にするリスクがあります。",

    "card.details.2.description":
      "女教皇は直感と潜在意識を表します。表面的なものを超えた深い知恵と洞察力を持っています。",
    "card.details.2.keywords": "直感、潜在意識、神秘、内なる声、知恵",
    "card.details.2.upright": "直感、潜在意識、神秘、内なる声、知恵、秘密",
    "card.details.2.reversed": "秘密の隠蔽、混乱、表面的な理解、無視された直感",
    "card.details.2.positive": "内なる声に耳を傾け、直感的な知恵を信頼することで深い洞察を得られます。",
    "card.details.2.negative": "重要な情報を見逃したり、直感を無視したりすることで判断を誤る可能性があります。",

    "card.details.3.description":
      "女帝は豊かさと創造性を表します。自然との調和、感情の豊かさ、そして育む力を象徴しています。",
    "card.details.3.keywords": "豊かさ、創造性、調和、育む、自然",
    "card.details.3.upright": "豊かさ、創造性、調和、育む力、自然との繋がり",
    "card.details.3.reversed": "依存、過保護、創造性の欠如、自己表現の妨げ",
    "card.details.3.positive": "豊かさと創造性を育み、周囲の人々や環境と調和して繁栄することができます。",
    "card.details.3.negative": "過度な依存や過保護な態度が、自分や他者の成長を妨げる可能性があります。",

    "card.details.4.description": "皇帝は権威と安定を表します。リーダーシップ、秩序、そして構造を象徴しています。",
    "card.details.4.keywords": "権威、安定、リーダーシップ、秩序、構造",
    "card.details.4.upright": "権威、安定、リーダーシップ、秩序、構造、保護",
    "card.details.4.reversed": "支配、過度な制御、頑固さ、柔軟性の欠如",
    "card.details.4.positive": "強いリーダーシップと安定した基盤を築き、秩序と構造をもたらすことができます。",
    "card.details.4.negative": "過度な支配欲や柔軟性の欠如が、関係性や状況を硬直させる可能性があります。",

    "card.details.5.description":
      "教皇は伝統と信念を表します。精神的な指導、道徳的な価値観、そして教えを象徴しています。",
    "card.details.5.keywords": "伝統、信念、精神的指導、道徳、教え",
    "card.details.5.upright": "伝統、信念、精神的指導、道徳的価値観、教え",
    "card.details.5.reversed": "反抗、非伝統的、不寛容、過度な信仰",
    "card.details.5.positive": "伝統的な知恵と精神的な指導を通じて、より深い理解と信念を得ることができます。",
    "card.details.5.negative": "過度に厳格な信念や不寛容さが、新しい視点や成長の機会を制限する可能性があります。",

    "card.details.6.description":
      "恋人は関係性と選択を表します。愛、調和、そして価値観に基づいた決断を象徴しています。",
    "card.details.6.keywords": "関係性、選択、愛、調和、価値観",
    "card.details.6.upright": "関係性、選択、愛、調和、価値観に基づいた決断",
    "card.details.6.reversed": "不調和、不均衡、価値観の衝突、誤った選択",
    "card.details.6.positive": "心からの愛と調和に基づいた関係性を築き、価値観に沿った選択をすることができます。",
    "card.details.6.negative": "価値観の衝突や不均衡な関係性が、誤った選択や不調和をもたらす可能性があります。",

    "card.details.7.description":
      "戦車は意志力と勝利を表します。決意、自己制御、そして障害を乗り越える力を象徴しています。",
    "card.details.7.keywords": "意志力、勝利、決意、自己制御、前進",
    "card.details.7.upright": "意志力、勝利、決意、自己制御、前進、集中",
    "card.details.7.reversed": "自己中心的、方向性の欠如、攻撃性、無力感",
    "card.details.7.positive": "強い意志と決意を持って障害を乗り越え、目標に向かって前進することができます。",
    "card.details.7.negative": "方向性の欠如や過度な攻撃性が、進むべき道を見失わせる可能性があります。",

    "card.details.8.description": "力は内なる強さと勇気を表します。情熱、自信、そして忍耐を象徴しています。",
    "card.details.8.keywords": "内なる強さ、勇気、情熱、自信、忍耐",
    "card.details.8.upright": "内なる強さ、勇気、情熱、自信、忍耐、自己制御",
    "card.details.8.reversed": "自信の欠如、弱さ、支配、怒り、エネルギーの浪費",
    "card.details.8.positive": "内なる強さと勇気を持って情熱を制御し、忍耐強く目標に向かうことができます。",
    "card.details.8.negative": "自信の欠如や感情のコントロールを失うことで、エネルギーを無駄にする可能性があります。",

    "card.details.9.description":
      "隠者は内省と孤独を表します。自己探求、内なる導き、そして真実の探求を象徴しています。",
    "card.details.9.keywords": "内省、孤独、自己探求、内なる導き、真実",
    "card.details.9.upright": "内省、孤独、自己探求、内なる導き、真実の探求",
    "card.details.9.reversed": "孤立、拒絶、引きこもり、社会的孤立",
    "card.details.9.positive": "静かな内省と自己探求を通じて、深い真実と内なる導きを見つけることができます。",
    "card.details.9.negative": "過度な引きこもりや社会的孤立が、重要な人間関係や機会を失わせる可能性があります。",

    "card.details.10.description": "運命の輪は変化と運命を表します。循環、転機、そして新しい可能性を象徴しています。",
    "card.details.10.keywords": "変化、運命、循環、転機、可能性",
    "card.details.10.upright": "変化、運命、循環、転機、新しい可能性、運",
    "card.details.10.reversed": "抵抗、不運、外部からの制御、運命への抵抗",
    "card.details.10.positive": "人生の循環と変化を受け入れ、新しい可能性に開かれた心を持つことができます。",
    "card.details.10.negative": "変化への抵抗や運命に対する無力感が、成長や前進を妨げる可能性があります。",

    "card.details.11.description": "正義は公正さと真実を表します。バランス、調和、そして因果関係を象徴しています。",
    "card.details.11.keywords": "公正さ、真実、バランス、調和、因果関係",
    "card.details.11.upright": "公正さ、真実、バランス、調和、因果関係、法",
    "card.details.11.reversed": "不公平、不均衡、偏見、不正義、法的問題",
    "card.details.11.positive": "公正さとバランスを保ち、真実に基づいた判断と決断をすることができます。",
    "card.details.11.negative": "不均衡や偏見が、不公平な状況や法的問題を引き起こす可能性があります。",

    "card.details.12.description":
      "吊るされた男は犠牲と新しい視点を表します。放棄、一時停止、そして異なる角度からの見方を象徴しています。",
    "card.details.12.keywords": "犠牲、新しい視点、放棄、一時停止、異なる角度",
    "card.details.12.upright": "犠牲、新しい視点、放棄、一時停止、異なる角度からの見方",
    "card.details.12.reversed": "抵抗、無駄な犠牲、執着、停滞",
    "card.details.12.positive": "一時的な犠牲や休止を受け入れ、新しい視点から状況を見ることで洞察を得られます。",
    "card.details.12.negative": "無駄な犠牲や執着が、前進を妨げ停滞をもたらす可能性があります。",

    "card.details.13.description":
      "死神は変容と終わりを表します。変化、移行、そして古いものを手放すことを象徴しています。",
    "card.details.13.keywords": "変容、終わり、変化、移行、手放す",
    "card.details.13.upright": "変容、終わり、変化、移行、古いものを手放す",
    "card.details.13.reversed": "抵抗、変化への恐れ、停滞、不可避な変化",
    "card.details.13.positive": "古いものを手放し、変化を受け入れることで、新しい始まりと変容を経験できます。",
    "card.details.13.negative": "変化への恐れや抵抗が、必要な成長や移行を妨げる可能性があります。",

    "card.details.14.description":
      "節制はバランスと調和を表します。中庸、自制心、そして異なる要素の融合を象徴しています。",
    "card.details.14.keywords": "バランス、調和、中庸、自制心、融合",
    "card.details.14.upright": "バランス、調和、中庸、自制心、異なる要素の融合",
    "card.details.14.reversed": "不均衡、過剰、不調和、衝突",
    "card.details.14.positive": "バランスと調和を保ち、異なる要素を融合させることで、穏やかな流れを作り出せます。",
    "card.details.14.negative": "過剰や不均衡が、調和を乱し衝突や不調和をもたらす可能性があります。",

    "card.details.15.description": "悪魔は束縛と欲望を表します。執着、誘惑、そして物質主義を象徴しています。",
    "card.details.15.keywords": "束縛、欲望、執着、誘惑、物質主義",
    "card.details.15.upright": "束縛、欲望、執着、誘惑、物質主義、依存",
    "card.details.15.reversed": "解放、独立、自由への欲求、制約からの脱出",
    "card.details.15.positive": "自分の欲望や執着を認識し、それらから解放されることで真の自由を見つけられます。",
    "card.details.15.negative": "物質主義や依存が、精神的な成長や自由を制限する可能性があります。",

    "card.details.16.description": "塔は突然の変化と啓示を表します。混乱、崩壊、そして古い構造の破壊を象徴しています。",
    "card.details.16.keywords": "突然の変化、啓示、混乱、崩壊、破壊",
    "card.details.16.upright": "突然の変化、啓示、混乱、崩壊、古い構造の破壊",
    "card.details.16.reversed": "変化への恐れ、避けられる災難、段階的な変化",
    "card.details.16.positive": "突然の変化や崩壊を通じて、真実の啓示と新しい始まりの機会を得ることができます。",
    "card.details.16.negative": "予期せぬ混乱や破壊が、安定性や安心感を脅かす可能性があります。",

    "card.details.17.description": "星は希望と霊感を表します。楽観主義、信頼、そして導きを象徴しています。",
    "card.details.17.keywords": "希望、霊感、楽観主義、信頼、導き",
    "card.details.17.upright": "希望、霊感、楽観主義、信頼、導き、平和",
    "card.details.17.reversed": "失望、悲観主義、希望の喪失、信頼の欠如",
    "card.details.17.positive": "希望と信頼を持ち、宇宙からの導きに従うことで、霊感と平和を見つけられます。",
    "card.details.17.negative": "失望や悲観主義が、前向きな可能性や機会を見逃させる可能性があります。",

    "card.details.18.description": "月は幻想と直感を表します。不確かさ、恐れ、そして潜在意識を象徴しています。",
    "card.details.18.keywords": "幻想、直感、不確かさ、恐れ、潜在意識",
    "card.details.18.upright": "幻想、直感、不確かさ、恐れ、潜在意識、夢",
    "card.details.18.reversed": "混乱の解消、恐怖の克服、真実の発見",
    "card.details.18.positive": "潜在意識と直感を信頼し、不確かさの中でも内なる導きを見つけることができます。",
    "card.details.18.negative": "幻想や恐れに囚われ、現実と幻想の区別がつかなくなる可能性があります。",

    "card.details.19.description": "太陽は成功と喜びを表します。活力、明るさ、そして達成感を象徴しています。",
    "card.details.19.keywords": "成功、喜び、活力、明るさ、達成感",
    "card.details.19.upright": "成功、喜び、活力、明るさ、達成感、真実",
    "card.details.19.reversed": "一時的な落胆、成功の遅れ、過度な楽観主義",
    "card.details.19.positive": "明るさと活力に満ち、成功と喜びを経験し、真の達成感を味わうことができます。",
    "card.details.19.negative": "過度な楽観主義や現実の無視が、期待外れや落胆をもたらす可能性があります。",

    "card.details.20.description": "審判は再生と目覚めを表します。反省、評価、そして新たな始まりを象徴しています。",
    "card.details.20.keywords": "再生、目覚め、反省、評価、新たな始まり",
    "card.details.20.upright": "再生、目覚め、反省、評価、新たな始まり、呼びかけ",
    "card.details.20.reversed": "自己疑念、決断の先延ばし、恐れによる判断",
    "card.details.20.positive": "過去を振り返り評価することで、新たな目覚めと再生を経験することができます。",
    "card.details.20.negative": "自己疑念や恐れが、重要な決断や変化を先延ばしにさせる可能性があります。",

    "card.details.21.description":
      "世界は完成と達成を表します。統合、旅の終わり、そして新しいサイクルの始まりを象徴しています。",
    "card.details.21.keywords": "完成、達成、統合、旅の終わり、新しいサイクル",
    "card.details.21.upright": "完成、達成、統合、旅の終わり、新しいサイクルの始まり",
    "card.details.21.reversed": "未完成、遅延、未達成の目標",
    "card.details.21.positive": "目標の達成と完成を祝い、すべての経験を統合して新しいサイクルを始めることができます。",
    "card.details.21.negative": "未完成や遅延が、達成感や完結を妨げる可能性があります。",

    // ゲームページ
    "game.title": "タロットゲーム",
    "game.subtitle": "記憶力を試しながらタロットを学ぼう",
    "game.mode.classic.title": "クラシックモード",
    "game.mode.classic.description": "制限時間なしで全ペアを探索",
    "game.mode.timeAttack.title": "タイムアタック",
    "game.mode.timeAttack.description": "3分間で最大ペア獲得を競う",
    "game.mode.hard.title": "ハードモード",
    "game.mode.hard.description": "カード位置が5秒ごとにシャッフル",
    "game.difficulty.beginner": "初級",
    "game.difficulty.intermediate": "中級",
    "game.difficulty.advanced": "上級",
    "game.play": "プレイする",
    "game.rules.title": "ゲームルール",
    "game.rules.grid": "4x4グリッド（16枚）のカードから同じペアを見つけよう",
    "game.rules.pairs": "大アルカナから8ペアがランダムに選ばれます",
    "game.rules.tap": "カードをタップして裏返し、2枚一致で消去できます",
    "game.rules.points": "ペアを見つけるごとに「タロットポイント」を獲得",
    "game.rules.unlock": "5000ポイントで限定カードバックが解放されます",

    // スコアボード
    "scoreboard.title": "スコアボード",
    "scoreboard.tab.classic": "クラシック",
    "scoreboard.tab.timeAttack": "タイムアタック",
    "scoreboard.tab.hard": "ハード",
    "scoreboard.mode.classic.title": "クラシックモードのハイスコア",
    "scoreboard.mode.timeAttack.title": "タイムアタックモードのハイスコア",
    "scoreboard.mode.hard.title": "ハードモードのハイスコア",
    "scoreboard.moves": "手",
    "scoreboard.no.scores": "まだスコアがありません。プレイして記録を作りましょう！",

    // ショップページ
    "shop.title": "カードバックショップ",
    "shop.subtitle": "お気に入りのデザインを選ぼう",
    "shop.current.cardback": "現在のカードバック",
    "shop.selected": "選択中",
    "shop.tabs.all": "すべて",
    "shop.tabs.basic": "ベーシック",
    "shop.tabs.premium": "プレミアム",
    "shop.tabs.special": "スペシャル",
    "shop.tabs.seasonal": "シーズン限定",
    "shop.tabs.unlocked": "解放済み",
    "shop.badges.selected": "選択中",
    "shop.badges.new": "新着",
    "shop.badges.premium": "プレミアム",
    "shop.badges.seasonal": "シーズン限定",
    "shop.badges.special": "スペシャル",
    "shop.buttons.select": "選択する",
    "shop.buttons.selected": "選択中",
    "shop.buttons.purchase": "{price}TPで購入",
    "shop.buttons.watch.ad": "広告を見て解放",
    "shop.buttons.check.achievement": "実績を確認",
    "shop.hidden.condition": "隠し条件：",
    "shop.earn.points.title": "ポイントを稼ぐ",
    "shop.earn.points.description": "タロットポイント（TP）はクイズやゲームをプレイすることで獲得できます。",
    "shop.earn.points.how": "ポイントの稼ぎ方",
    "shop.earn.points.fortune": "占い（1 TP）",
    "shop.earn.points.quiz": "クイズの正解（問題あたり10-100 TP）",
    "shop.earn.points.game": "ゲームクリア（難易度により50-200 TP）",
    "shop.earn.points.login": "毎日ログインボーナス（10 TP）",
    "shop.earn.points.events": "特別イベントやチャレンジ（報酬は様々）",
    "shop.disclaimer.note": "※TPはいかなる場合も補償・保証されません。ご理解の上でお楽しみください。",
    "shop.disclaimer.reset": "TPがリセットされる場合：アプリ削除、端末リセット、端末変更など",

    // カードバック名と説明
    "cardback.default.name": "デフォルト",
    "cardback.default.description": "シンプルで使いやすい定番のデザイン",
    "cardback.moonlight.name": "ムーンライト",
    "cardback.moonlight.description": "月の光に照らされた神秘的なデザイン",
    "cardback.golden.name": "ゴールデン",
    "cardback.golden.description": "豪華な金色の装飾が施されたデザイン",
    "cardback.crystal.name": "クリスタル",
    "cardback.crystal.description": "透明感のある美しいクリスタルデザイン",
    "cardback.mystic.name": "ミスティック",
    "cardback.mystic.description": "神秘的な魔法の力を感じさせるデザイン",
    "cardback.royal.name": "ロイヤル",
    "cardback.royal.description": "王族の威厳を感じさせる高貴なデザイン",
    "cardback.dragon.name": "ドラゴン",
    "cardback.dragon.description": "伝説の龍をモチーフにした力強いデザイン",
    "cardback.lydia30.name": "リディア30",
    "cardback.lydia30.description": "30日連続ログインで授かる特別なカードバック",
    "cardback.lydia60.name": "リディア60",
    "cardback.lydia60.description": "60日連続ログインの証として贈られる究極のカードバック",
    "cardback.cosmic.name": "コズミック",
    "cardback.cosmic.description": "宇宙の神秘を表現した壮大なデザイン",
    "cardback.elemental.name": "四神",
    "cardback.elemental.description": "東洋の四神をモチーフにしたデザイン",
    "cardback.sakura.name": "サクラ",
    "cardback.sakura.description": "桜の花びらが舞う和風のデザイン",
    "cardback.halloween.name": "ハロウィン",
    "cardback.halloween.description": "ハロウィンの雰囲気を楽しめるデザイン",
    "cardback.snowQueen.name": "スノークイーン",
    "cardback.snowQueen.description": "雪の女王をイメージした幻想的なデザイン",
    "cardback.custom.name": "カスタム",
    "cardback.custom.description": "あなたのオリジナルデザイン",

    // 解放条件
    "cardback.cosmic.condition": "タイムアタックモードで10,000点以上を達成",
    "cardback.sakura.condition": "桜の季節（3月16日〜4月15日）に7日間ログイン",
    "cardback.lydia30.condition": "30日連続ログインで解放",
    "cardback.lydia60.condition": "60日連続ログインで解放",
    "cardback.cosmic.hint": "タイムアタックで高得点を目指そう！",
    "cardback.sakura.hint": "桜の季節にログインしよう！",
    "cardback.hidden.hint": "隠し条件で解放",

    // トーストメッセージ
    "toast.error": "エラー",
    "toast.cardback.not.unlocked": "このカードバックはまだ解放されていません",
    "toast.cardback.selected": "カードバックを選択しました",
    "toast.cardback.applied": "{name}のカードバックを適用しました",
    "toast.insufficient.points": "ポイント不足",
    "toast.insufficient.points.description": "このカードバックを購入するには、あと{amount}TP必要です",
    "toast.purchase.successful": "購入成功",
    "toast.purchase.failed": "購入失敗",
    "toast.unlock.successful": "解放成功",
    "toast.watch.ad": "広告視聴",
    "toast.watch.ad.description": "広告を視聴中...",
    "toast.condition.check": "条件確認",
    "toast.condition.check.description": "実績条件を確認中...",
    "toast.condition.achieved": "条件達成",
    "toast.condition.not.met": "条件未達成",
    "toast.debug.info": "デバッグ情報",
    "toast.debug.info.description": "デバッグ情報をコンソールに出力しました",
    "toast.createSuccess.title": "作成成功",
    "toast.createSuccess.description": "新しいカードバックが作成されました",

    // ダイアログ
    "dialog.create.cardback": "新しいカードバックを作成",
    "dialog.name": "名前：",
    "dialog.image.url": "画像URL：",
    "dialog.placeholder.name": "カードバック名",
    "dialog.placeholder.image": "カードバック画像URL",
    "dialog.create": "作成",
    "dialog.cancel": "キャンセル",

    // エラーメッセージ
    "error.cardbackNotFound": "カードバック「{id}」が見つかりません",
    "error.cardbackSelectionError": "カードバックの選択中にエラーが発生しました",
    "error.cardbackSelectionFailed": "カードバックの選択に失敗しました",
    "error.cardbackPurchaseFailed": "カードバックの購入に失敗しました",

    // 監修者ページ
    "supervisor.title": "監修者",
    "supervisor.name": "金雨輝龍（かなう きりゅう）",
    "supervisor.greeting.tab": "ごあいさつ",
    "supervisor.profile.tab": "プロフィール",
    "supervisor.greeting.content1":
      "このアプリをご利用いただき、誠にありがとうございます。監修者の金雨輝龍と申します。",
    "supervisor.greeting.content2":
      "タロットカードには、人生の様々な局面や感情、選択肢が象徴的に描かれています。その深遠な知恵は、自己理解や人生の岐路での判断に大きな助けとなるでしょう。",
    "supervisor.greeting.content3":
      "このアプリが、皆様のタロットへの理解を深め、日々の生活に新たな視点をもたらす一助となれば幸いです。占いは絶対的な未来を示すものではなく、可能性の一つを示唆するものです。最終的な選択は、常にあなた自身の手にあることを忘れないでください。",
    "supervisor.greeting.signature": "金雨輝龍",
    "supervisor.profile.title": "プロフィール",
    "supervisor.profile.bio1":
      "1969年横浜生まれ。横浜の名づけ王の異名をもつ占い師。祖母の影響で幼少から占いに興味を持ち、趣味として学ぶ。",
    "supervisor.profile.bio2": "本業はITエンジニアだったが、占いの研究に没頭するあまり、プロの占い師の道へ転身を決意。",
    "supervisor.profile.bio3": "自身のうつ病と不眠症を占いで解決に導いた実績がある。",
    "supervisor.profile.bio4":
      "姓名判断を最も得意とし、四柱推命、タロット、数秘術、手相、六星占術など複数の占術を自在に使いこなす。",
    "supervisor.profile.bio5": "多くの赤ちゃんの命名や、ビジネスネーム考案を手掛ける。",
    "supervisor.qualifications.title": "保有資格",
    "supervisor.qualifications.item1": "日本占術協会認定四柱推命鑑定師",
    "supervisor.titles.title": "その他の肩書",
    "supervisor.titles.item1": "姓名判断鑑定師／開運命名師",
    "supervisor.titles.item2": "個人投資家",
    "supervisor.titles.item3": "AIエンジニア",
    "supervisor.stats.experience": "鑑定歴（年）",
    "supervisor.stats.readings": "鑑定数",
    "supervisor.stats.accuracy": "的中率",
    "supervisor.services.title": "無料占いサービス",
    "supervisor.services.home.title": "住まい運勢診断",
    "supervisor.services.home.description": "あなたの住所に宿る運勢パワーを診断",
    "supervisor.services.car.title": "愛車運勢診断",
    "supervisor.services.car.description": "あなたの愛車のナンバーに宿る運勢パワーと性格を診断",
    "supervisor.services.button": "診断する",
    "supervisor.line.add": "LINE友だち追加",
    "supervisor.line.qr.title": "LINE友だち追加",
    "supervisor.line.qr.instruction": "QRコードをLINEアプリでスキャンして友だち追加してください",
    "supervisor.line.open": "LINEアプリで開く",
    "supervisor.website": "公式サイト",
  },
  en: {
    // ホームページ
    "home.title": "Free Tarot Reading",
    "home.subtitle": "Learn Tarot through Fortune Telling, Dictionary, Quiz & Games",
    "home.fortune.title": "Today's Fortune",
    "home.fortune.description": "Let the Tarot cards illuminate your future",
    "home.fortune.button": "Read Fortune",
    "home.dictionary.title": "Tarot Dictionary",
    "home.dictionary.description": "Learn the meanings of all 78 cards",
    "home.dictionary.button": "Explore",
    "home.quiz.title": "Tarot Quiz",
    "home.quiz.description": "Test your knowledge",
    "home.quiz.button": "Take Quiz",
    "home.game.title": "Tarot Games",
    "home.game.description": "Learn Tarot while testing your memory",
    "home.game.button": "Play Now",
    "home.skins.title": "Card Back Shop",
    "home.skins.description": "Choose your favorite design",
    "home.skins.button": "Shop Now",

    // ボトムナビゲーション
    "nav.home": "Home",
    "nav.fortune": "Fortune",
    "nav.dictionary": "Dictionary",
    "nav.quiz": "Quiz",
    "nav.game": "Games",
    "nav.skins": "Shop",
    "nav.supervisor": "Supervisor",
    "nav.settings": "Settings",

    // 占いページ
    "fortune.title": "Tarot Reading",
    "fortune.subtitle": "Let the cards illuminate your destiny",
    "fortune.shuffling": "Shuffling cards...",
    "fortune.skip": "Skip",
    "fortune.click.instruction": "Click on the cards to reveal them",
    "fortune.preparing": "Preparing cards...",
    "fortune.reading.title": "Interpreting your reading...",
    "fortune.reading.description": "Decoding the card messages. Please wait a moment.",
    "fortune.result.title": "Reading Results",
    "fortune.lucky.item": "Today's Lucky Item",
    "fortune.amazon.button": "Find on Amazon",
    "fortune.new.reading": "Start New Reading",
    "fortune.error.title": "Error occurred while preparing cards",
    "fortune.error.description": "Could not display cards. Please try again.",
    "fortune.error.details": "Error Details:",
    "fortune.error.retry": "Retry",
    "fortune.error.back": "Back",
    "fortune.error.timeout": "Timeout occurred. Please try again.",
    "fortune.error.no.cards": "No cards are displayed",
    "fortune.error.no.cards.description": "A problem occurred while preparing the cards. Please try again.",
    "fortune.type.daily.name": "Daily Fortune (One Oracle)",
    "fortune.type.daily.description": "A card that symbolizes your day",
    "fortune.type.love.name": "Love Reading (Three Cards)",
    "fortune.type.love.description": "Past, Present, and Future of Love",
    "fortune.type.career.name": "Career Reading (Three Cards)",
    "fortune.type.career.description": "Current Situation, Challenge, and Advice",
    "fortune.type.decision.name": "Decision Reading",
    "fortune.type.decision.description": "The path of two choices",
    "fortune.type.money.name": "Money Reading (Three Cards)",
    "fortune.type.money.description": "Current Situation, Challenge, and Advice",
    "fortune.cards.count": "Reading with {count} cards",
    "fortune.select.button": "Select",

    // 占いポジション
    "fortune.position.daily": "Daily Fortune",
    "fortune.position.past": "Past",
    "fortune.position.present": "Present",
    "fortune.position.future": "Future",
    "fortune.position.current": "Current Situation",
    "fortune.position.challenge": "Challenge",
    "fortune.position.advice": "Advice",
    "fortune.position.option.a": "Option A",
    "fortune.position.option.b": "Option B",
    "fortune.position.upright": "Upright",
    "fortune.position.reversed": "Reversed",

    // 設定ページ
    "settings.title": "Settings",
    "settings.language": "Language Settings",
    "settings.language.description": "Select your preferred language",
    "settings.language.select": "Select Language",
    "settings.sound": "Sound Settings",
    "settings.sound.description": "Configure sound effects and text-to-speech",
    "settings.sound.effects": "Sound Effects",
    "settings.sound.tts": "Text-to-Speech",
    "settings.sound.test": "Test Speech",
    "settings.sound.note": "※May not work in some environments",
    "settings.cards": "Card Settings",
    "settings.cards.description": "Tarot card display settings",
    "settings.cards.minor.fortune": "Include Minor Arcana in Fortune (Currently Unavailable)",
    "settings.cards.minor.games": "Include Minor Arcana in Games",
    "settings.cards.note": "Including Minor Arcana will display more diverse cards.",
    "settings.back": "Back to Home",
    "language.japanese": "🇯🇵 日本語",
    "language.english": "🇺🇸 English",

    // 辞典ページ
    "dictionary.title": "Tarot Dictionary",
    "dictionary.subtitle": "Learn the meanings of all 78 cards",
    "dictionary.search.placeholder": "Search cards...",
    "dictionary.loading": "Loading...",
    "dictionary.tab.major": "Major Arcana",
    "dictionary.tab.minor": "Minor Arcana (All)",
    "dictionary.tab.wands": "Wands",
    "dictionary.tab.cups": "Cups",
    "dictionary.tab.swords": "Swords",
    "dictionary.tab.pentacles": "Pentacles",

    // カード名（大アルカナ）
    "card.fool": "The Fool",
    "card.magician": "The Magician",
    "card.high_priestess": "The High Priestess",
    "card.empress": "The Empress",
    "card.emperor": "The Emperor",
    "card.hierophant": "The Hierophant",
    "card.lovers": "The Lovers",
    "card.chariot": "The Chariot",
    "card.strength": "Strength",
    "card.hermit": "The Hermit",
    "card.wheel_of_fortune": "Wheel of Fortune",
    "card.justice": "Justice",
    "card.hanged_man": "The Hanged Man",
    "card.death": "Death",
    "card.temperance": "Temperance",
    "card.devil": "The Devil",
    "card.tower": "The Tower",
    "card.star": "The Star",
    "card.moon": "The Moon",
    "card.sun": "The Sun",
    "card.judgement": "Judgement",
    "card.world": "The World",

    // 小アルカナのスート
    "suit.wands": "Wands",
    "suit.cups": "Cups",
    "suit.swords": "Swords",
    "suit.pentacles": "Pentacles",

    // 小アルカナのランク
    "rank.ace": "Ace",
    "rank.page": "Page",
    "rank.knight": "Knight",
    "rank.queen": "Queen",
    "rank.king": "King",

    // カード詳細モーダル
    "card.detail.overview": "Overview",
    "card.detail.upright": "Upright",
    "card.detail.reversed": "Reversed",
    "card.detail.positive": "Positive Interpretation",
    "card.detail.negative": "Negative Interpretation",
    "card.detail.keywords": "Keywords",
    "card.detail.speak": "Read Aloud",
    "card.detail.close": "Close",
    "card.detail.image.error": "Failed to load image",

    // 小アルカナの接続詞
    "card.connector": " of ",

    // カード詳細情報（大アルカナ）- 英語版
    "card.details.0.description":
      "The Fool represents the beginning of a new journey. It symbolizes innocence, freedom, adventurous spirit, and the courage to take the first step into the unknown.",
    "card.details.0.keywords": "Adventure, New beginnings, Freedom, Innocence, Spontaneity",
    "card.details.0.upright": "New beginnings, adventure, free spirit, innocence, spontaneity, potential",
    "card.details.0.reversed": "Recklessness, carelessness, risk, lack of planning, foolishness",
    "card.details.0.positive": "You have an open heart to new possibilities and the courage to adventure freely.",
    "card.details.0.negative": "Lack of planning and reckless disregard for danger may cause problems.",

    "card.details.1.description":
      "The Magician represents creativity and willpower. You have the power to shape reality by utilizing your abilities.",
    "card.details.1.keywords": "Creativity, Willpower, Skills, Confidence, Concentration",
    "card.details.1.upright": "Creativity, Skills, Confidence, Willpower, Concentration, Talent Display",
    "card.details.1.reversed": "Manipulation, Injustice, Waste of Talent, Self-Doubt",
    "card.details.1.positive":
      "You can create the reality you desire by making the most of your talents and abilities.",
    "card.details.1.negative":
      "There is a risk of using your abilities in the wrong direction or wasting your talents.",

    "card.details.2.description":
      "The High Priestess represents intuition and the subconscious. You have deep wisdom and insight beyond the superficial.",
    "card.details.2.keywords": "Intuition, Subconscious, Mystery, Inner Voice, Wisdom",
    "card.details.2.upright": "Intuition, Subconscious, Mystery, Inner Voice, Wisdom, Secret",
    "card.details.2.reversed": "Concealment of Secrets, Confusion, Superficial Understanding, Ignored Intuition",
    "card.details.2.positive":
      "You can gain deep insight by listening to your inner voice and trusting your intuitive wisdom.",
    "card.details.2.negative": "You may make mistakes by missing important information or ignoring your intuition.",

    "card.details.3.description":
      "The Empress represents abundance and creativity. It symbolizes harmony with nature, emotional richness, and the power to nurture.",
    "card.details.3.keywords": "Abundance, Creativity, Harmony, Nurturing, Nature",
    "card.details.3.upright": "Abundance, Creativity, Harmony, Nurturing Power, Connection with Nature",
    "card.details.3.reversed": "Dependence, Overprotection, Lack of Creativity, Obstruction of Self-Expression",
    "card.details.3.positive":
      "You can nurture abundance and creativity and prosper in harmony with the people and environment around you.",
    "card.details.3.negative":
      "Excessive dependence or overprotective attitudes can hinder the growth of yourself and others.",

    "card.details.4.description":
      "The Emperor represents authority and stability. It symbolizes leadership, order, and structure.",
    "card.details.4.keywords": "Authority, Stability, Leadership, Order, Structure",
    "card.details.4.upright": "Authority, Stability, Leadership, Order, Structure, Protection",
    "card.details.4.reversed": "Domination, Excessive Control, Stubbornness, Lack of Flexibility",
    "card.details.4.positive": "You can build strong leadership and a stable foundation, bringing order and structure.",
    "card.details.4.negative":
      "Excessive desire for domination or lack of flexibility can make relationships and situations rigid.",

    "card.details.5.description":
      "The Hierophant represents tradition and belief. It symbolizes spiritual guidance, moral values, and teachings.",
    "card.details.5.keywords": "Tradition, Belief, Spiritual Guidance, Morality, Teaching",
    "card.details.5.upright": "Tradition, Belief, Spiritual Guidance, Moral Values, Teaching",
    "card.details.5.reversed": "Rebellion, Unconventional, Intolerance, Excessive Faith",
    "card.details.5.positive":
      "You can gain deeper understanding and belief through traditional wisdom and spiritual guidance.",
    "card.details.5.negative":
      "Overly strict beliefs or intolerance can limit new perspectives and opportunities for growth.",

    "card.details.6.description":
      "The Lovers represent relationships and choices. It symbolizes love, harmony, and decisions based on values.",
    "card.details.6.keywords": "Relationship, Choice, Love, Harmony, Values",
    "card.details.6.upright": "Relationship, Choice, Love, Harmony, Decisions Based on Values",
    "card.details.6.reversed": "Disharmony, Imbalance, Conflict of Values, Wrong Choice",
    "card.details.6.positive":
      "You can build relationships based on heartfelt love and harmony and make choices that align with your values.",
    "card.details.6.negative":
      "Conflicts of values or unbalanced relationships can lead to wrong choices and disharmony.",

    "card.details.7.description":
      "The Chariot represents willpower and victory. It symbolizes determination, self-control, and the power to overcome obstacles.",
    "card.details.7.keywords": "Willpower, Victory, Determination, Self-Control, Progress",
    "card.details.7.upright": "Willpower, Victory, Determination, Self-Control, Progress, Concentration",
    "card.details.7.reversed": "Self-Centered, Lack of Direction, Aggression, Powerlessness",
    "card.details.7.positive":
      "You can overcome obstacles with strong willpower and determination and move forward towards your goals.",
    "card.details.7.negative":
      "Lack of direction or excessive aggression can cause you to lose sight of the path you should take.",

    "card.details.8.description":
      "Strength represents inner strength and courage. It symbolizes passion, confidence, and patience.",
    "card.details.8.keywords": "Inner Strength, Courage, Passion, Confidence, Patience",
    "card.details.8.upright": "Inner Strength, Courage, Passion, Confidence, Patience, Self-Control",
    "card.details.8.reversed": "Lack of Confidence, Weakness, Domination, Anger, Waste of Energy",
    "card.details.8.positive":
      "You can control your passion with inner strength and courage and patiently move towards your goals.",
    "card.details.8.negative": "Losing confidence or control of your emotions can waste energy.",

    "card.details.9.description":
      "The Hermit represents introspection and solitude. It symbolizes self-exploration, inner guidance, and the search for truth.",
    "card.details.9.keywords": "Introspection, Solitude, Self-Exploration, Inner Guidance, Truth",
    "card.details.9.upright": "Introspection, Solitude, Self-Exploration, Search for Inner Guidance and Truth",
    "card.details.9.reversed": "Isolation, Rejection, Withdrawal, Social Isolation",
    "card.details.9.positive":
      "You can find deep truth and inner guidance through quiet introspection and self-exploration.",
    "card.details.9.negative":
      "Excessive withdrawal or social isolation can cause you to lose important relationships and opportunities.",

    "card.details.10.description":
      "The Wheel of Fortune represents change and destiny. It symbolizes cycles, turning points, and new possibilities.",
    "card.details.10.keywords": "Change, Destiny, Cycle, Turning Point, Possibility",
    "card.details.10.upright": "Change, Destiny, Cycle, Turning Point, New Possibilities, Luck",
    "card.details.10.reversed": "Resistance, Bad Luck, External Control, Resistance to Destiny",
    "card.details.10.positive":
      "You can accept the cycles and changes of life and have an open mind to new possibilities.",
    "card.details.10.negative": "Resistance to change or powerlessness over destiny can hinder growth and progress.",

    "card.details.11.description":
      "Justice represents fairness and truth. It symbolizes balance, harmony, and cause and effect.",
    "card.details.11.keywords": "Fairness, Truth, Balance, Harmony, Cause and Effect",
    "card.details.11.upright": "Fairness, Truth, Balance, Harmony, Cause and Effect, Law",
    "card.details.11.reversed": "Injustice, Imbalance, Prejudice, Injustice, Legal Issues",
    "card.details.11.positive":
      "You can maintain fairness and balance and make judgments and decisions based on truth.",
    "card.details.11.negative": "Imbalance or prejudice can cause unfair situations or legal problems.",

    "card.details.12.description":
      "The Hanged Man represents sacrifice and new perspectives. It symbolizes abandonment, suspension, and seeing things from a different angle.",
    "card.details.12.keywords": "Sacrifice, New Perspective, Abandonment, Suspension, Different Angle",
    "card.details.12.upright":
      "Sacrifice, New Perspective, Abandonment, Suspension, Seeing Things from a Different Angle",
    "card.details.12.reversed": "Resistance, Useless Sacrifice, Attachment, Stagnation",
    "card.details.12.positive":
      "You can gain insight by accepting temporary sacrifices or pauses and seeing situations from a new perspective.",
    "card.details.12.negative": "Useless sacrifices or attachments can hinder progress and lead to stagnation.",

    "card.details.13.description":
      "Death represents transformation and endings. It symbolizes change, transition, and letting go of the old.",
    "card.details.13.keywords": "Transformation, End, Change, Transition, Letting Go",
    "card.details.13.upright": "Transformation, End, Change, Transition, Letting Go of the Old",
    "card.details.13.reversed": "Resistance, Fear of Change, Stagnation, Inevitable Change",
    "card.details.13.positive":
      "You can experience new beginnings and transformations by letting go of the old and accepting change.",
    "card.details.13.negative": "Fear of change or resistance can hinder necessary growth and transitions.",

    "card.details.14.description":
      "Temperance represents balance and harmony. It symbolizes moderation, self-control, and the fusion of different elements.",
    "card.details.14.keywords": "Balance, Harmony, Moderation, Self-Control, Fusion",
    "card.details.14.upright": "Balance, Harmony, Moderation, Self-Control, Fusion of Different Elements",
    "card.details.14.reversed": "Imbalance, Excess, Disharmony, Conflict",
    "card.details.14.positive":
      "You can create a smooth flow by maintaining balance and harmony and fusing different elements.",
    "card.details.14.negative": "Excess or imbalance can disrupt harmony and cause conflict and disharmony.",

    "card.details.15.description":
      "The Devil represents bondage and desire. It symbolizes attachment, temptation, and materialism.",
    "card.details.15.keywords": "Bondage, Desire, Attachment, Temptation, Materialism",
    "card.details.15.upright": "Bondage, Desire, Attachment, Temptation, Materialism, Dependence",
    "card.details.15.reversed": "Liberation, Independence, Desire for Freedom, Escape from Restrictions",
    "card.details.15.positive":
      "You can find true freedom by recognizing your desires and attachments and freeing yourself from them.",
    "card.details.15.negative": "Materialism or dependence can limit spiritual growth and freedom.",

    "card.details.16.description":
      "The Tower represents sudden change and revelation. It symbolizes chaos, collapse, and the destruction of old structures.",
    "card.details.16.keywords": "Sudden Change, Revelation, Chaos, Collapse, Destruction",
    "card.details.16.upright": "Sudden Change, Revelation, Chaos, Collapse, Destruction of Old Structures",
    "card.details.16.reversed": "Fear of Change, Avoidable Disaster, Gradual Change",
    "card.details.16.positive": "You can gain true revelation and new beginnings through sudden changes and collapses.",
    "card.details.16.negative": "Unexpected chaos and destruction can threaten stability and security.",

    "card.details.17.description":
      "The Star represents hope and inspiration. It symbolizes optimism, trust, and guidance.",
    "card.details.17.keywords": "Hope, Inspiration, Optimism, Trust, Guidance",
    "card.details.17.upright": "Hope, Inspiration, Optimism, Trust, Guidance, Peace",
    "card.details.17.reversed": "Disappointment, Pessimism, Loss of Hope, Lack of Trust",
    "card.details.17.positive":
      "You can find inspiration and peace by having hope and trust and following the guidance from the universe.",
    "card.details.17.negative":
      "Disappointment or pessimism can cause you to miss positive possibilities and opportunities.",

    "card.details.18.description":
      "The Moon represents illusion and intuition. It symbolizes uncertainty, fear, and the subconscious.",
    "card.details.18.keywords": "Illusion, Intuition, Uncertainty, Fear, Subconscious",
    "card.details.18.upright": "Illusion, Intuition, Uncertainty, Fear, Subconscious, Dream",
    "card.details.18.reversed": "Resolution of Confusion, Overcoming Fear, Discovery of Truth",
    "card.details.18.positive":
      "You can trust your subconscious and intuition and find inner guidance even in uncertainty.",
    "card.details.18.negative":
      "You may be trapped in illusions and fears and lose the distinction between reality and illusion.",

    "card.details.19.description":
      "The Sun represents success and joy. It symbolizes vitality, brightness, and a sense of accomplishment.",
    "card.details.19.keywords": "Success, Joy, Vitality, Brightness, Sense of Accomplishment",
    "card.details.19.upright": "Success, Joy, Vitality, Brightness, Sense of Accomplishment, Truth",
    "card.details.19.reversed": "Temporary Discouragement, Delay in Success, Excessive Optimism",
    "card.details.19.positive":
      "You can experience success and joy and feel a true sense of accomplishment, full of brightness and vitality.",
    "card.details.19.negative": "Excessive optimism or ignoring reality can lead to disappointment and discouragement.",

    "card.details.20.description":
      "Judgement represents regeneration and awakening. It symbolizes reflection, evaluation, and new beginnings.",
    "card.details.20.keywords": "Regeneration, Awakening, Reflection, Evaluation, New Beginnings",
    "card.details.20.upright": "Regeneration, Awakening, Reflection, Evaluation, New Beginnings, Calling",
    "card.details.20.reversed": "Self-Doubt, Procrastination of Decisions, Judgment by Fear",
    "card.details.20.positive":
      "You can experience a new awakening and regeneration by reflecting on and evaluating the past.",
    "card.details.20.negative": "Self-doubt or fear can cause you to postpone important decisions and changes.",

    "card.details.21.description":
      "The World represents completion and accomplishment. It symbolizes integration, the end of a journey, and the beginning of a new cycle.",
    "card.details.21.keywords": "Completion, Accomplishment, Integration, End of Journey, New Cycle",
    "card.details.21.upright": "Completion, Accomplishment, Integration, End of Journey, Beginning of New Cycle",
    "card.details.21.reversed": "Incomplete, Delay, Unachieved Goals",
    "card.details.21.positive":
      "You can celebrate the achievement and completion of your goals and integrate all your experiences to begin a new cycle.",
    "card.details.21.negative": "Incompletion or delays can hinder accomplishment and completion.",

    // ゲームページ
    "game.title": "Tarot Game",
    "game.subtitle": "Learn Tarot while testing your memory",
    "game.mode.classic.title": "Classic Mode",
    "game.mode.classic.description": "Find all pairs without time limit",
    "game.mode.timeAttack.title": "Time Attack",
    "game.mode.timeAttack.description": "Find maximum pairs in 3 minutes",
    "game.mode.hard.title": "Hard Mode",
    "game.mode.hard.description": "Cards shuffle every 5 seconds",
    "game.difficulty.beginner": "Beginner",
    "game.difficulty.intermediate": "Intermediate",
    "game.difficulty.advanced": "Advanced",
    "game.play": "Play Now",
    "game.rules.title": "Game Rules",
    "game.rules.grid": "Find matching pairs from a 4x4 grid (16 cards)",
    "game.rules.pairs": "8 pairs are randomly selected from Major Arcana",
    "game.rules.tap": "Tap cards to flip them, matching pairs will be removed",
    "game.rules.points": "Earn Tarot Points for each pair you find",
    "game.rules.unlock": "Unlock exclusive card backs with 5000 points",

    // スコアボード
    "scoreboard.title": "Scoreboard",
    "scoreboard.tab.classic": "Classic",
    "scoreboard.tab.timeAttack": "Time Attack",
    "scoreboard.tab.hard": "Hard",
    "scoreboard.mode.classic.title": "Classic Mode High Scores",
    "scoreboard.mode.timeAttack.title": "Time Attack Mode High Scores",
    "scoreboard.mode.hard.title": "Hard Mode High Scores",
    "scoreboard.moves": " moves",
    "scoreboard.no.scores": "No scores yet. Play to create your first record!",

    // ショップページ
    "shop.title": "Card Back Shop",
    "shop.subtitle": "Choose your favorite design",
    "shop.current.cardback": "Current Card Back",
    "shop.selected": "Selected",
    "shop.tabs.all": "All",
    "shop.tabs.basic": "Basic",
    "shop.tabs.premium": "Premium",
    "shop.tabs.special": "Special",
    "shop.tabs.seasonal": "Seasonal",
    "shop.tabs.unlocked": "Unlocked",
    "shop.badges.selected": "Selected",
    "shop.badges.new": "New",
    "shop.badges.premium": "Premium",
    "shop.badges.seasonal": "Seasonal Limited",
    "shop.badges.special": "Special",
    "shop.buttons.select": "Select",
    "shop.buttons.selected": "Selected",
    "shop.buttons.purchase": "Purchase for {price} TP",
    "shop.buttons.watch.ad": "Unlock by watching ad",
    "shop.buttons.check.achievement": "Check achievement",
    "shop.hidden.condition": "Hidden Condition:",
    "shop.earn.points.title": "Earn Points",
    "shop.earn.points.description": "Tarot Points (TP) can be earned by playing quizzes and games.",
    "shop.earn.points.how": "How to Earn Points",
    "shop.earn.points.fortune": "Fortune telling (1 TP)",
    "shop.earn.points.quiz": "Correct quiz answers (10-100 TP per question)",
    "shop.earn.points.game": "Clear games (50-200 TP depending on difficulty)",
    "shop.earn.points.login": "Daily login bonus (10 TP)",
    "shop.earn.points.events": "Special events and challenges (rewards vary)",
    "shop.disclaimer.note":
      "※TP cannot be compensated or guaranteed under any circumstances. Please enjoy with understanding.",
    "shop.disclaimer.reset": "Cases where TP may be reset: App deletion, device reset, device change, etc.",

    // カードバック名と説明
    "cardback.default.name": "Default",
    "cardback.default.description": "Standard tarot card design",
    "cardback.moonlight.name": "Moonlight",
    "cardback.moonlight.description": "Mystical design illuminated by moonlight",
    "cardback.golden.name": "Golden",
    "cardback.golden.description": "Luxurious design shining in gold",
    "cardback.crystal.name": "Crystal",
    "cardback.crystal.description": "Mystical design with geometric crystal patterns shining in blue and purple light",
    "cardback.mystic.name": "Mystic",
    "cardback.mystic.description": "Design with mystical fog and magical elements",
    "cardback.royal.name": "Royal",
    "cardback.royal.description": "Design featuring royal crests and decorations",
    "cardback.dragon.name": "Dragon",
    "cardback.dragon.description": "Powerful design featuring legendary dragons",
    "cardback.lydia30.name": "Lydia 30-Day",
    "cardback.lydia30.description": "Special back awarded for maintaining a 30-day login streak",
    "cardback.lydia60.name": "Lydia 60-Day",
    "cardback.lydia60.description": "Ultimate back that celebrates 60 consecutive logins",
    "cardback.cosmic.name": "Cosmic",
    "cardback.cosmic.description": "Mystical design with a space theme",
    "cardback.elemental.name": "Four Symbols",
    "cardback.elemental.description":
      "Mystical design featuring the Eastern Four Symbols (Azure Dragon, White Tiger, Vermillion Bird, Black Tortoise)",
    "cardback.sakura.name": "Sakura",
    "cardback.sakura.description": "Japanese-style design featuring cherry blossoms",
    "cardback.halloween.name": "Halloween",
    "cardback.halloween.description": "Seasonal limited design with Halloween theme",
    "cardback.snowQueen.name": "Snow Queen",
    "cardback.snowQueen.description":
      "Mystical design inspired by Andersen's fairy tale, featuring beautiful ice palace and snow crystals",
    "cardback.custom.name": "Custom",
    "cardback.custom.description": "Your original design",

    // 解放条件
    "cardback.cosmic.condition": "Achieve a score of 10,000 or higher in Time Attack mode",
    "cardback.sakura.condition": "Log in for 7 days during cherry blossom season (March 16 - April 15)",
    "cardback.lydia30.condition": "Log in for 30 consecutive days",
    "cardback.lydia60.condition": "Log in for 60 consecutive days",
    "cardback.cosmic.hint": "Aim for high scores in Time Attack!",
    "cardback.sakura.hint": "Log in during cherry blossom season!",
    "cardback.hidden.hint": "Unlock with hidden conditions",

    // トーストメッセージ
    "toast.error": "Error",
    "toast.cardback.not.unlocked": "This card back is not yet unlocked",
    "toast.cardback.selected": "Card back selected",
    "toast.cardback.applied": "Applied {name} card back",
    "toast.insufficient.points": "Insufficient Points",
    "toast.insufficient.points.description": "You need {amount} more TP to purchase this card back",
    "toast.purchase.successful": "Purchase Successful",
    "toast.purchase.failed": "Purchase Failed",
    "toast.unlock.successful": "Unlock Successful",
    "toast.watch.ad": "Watch Ad",
    "toast.watch.ad.description": "Watching advertisement...",
    "toast.condition.check": "Condition Check",
    "toast.condition.check.description": "Checking achievement conditions...",
    "toast.condition.achieved": "Condition Achieved",
    "toast.condition.not.met": "Condition Not Met",
    "toast.debug.info": "Debug Info",
    "toast.debug.info.description": "Debug information output to console",
    "toast.createSuccess.title": "Creation Successful",
    "toast.createSuccess.description": "New card back has been created",

    // ダイアログ
    "dialog.create.cardback": "Create New Card Back",
    "dialog.name": "Name:",
    "dialog.image.url": "Image URL:",
    "dialog.placeholder.name": "Card back name",
    "dialog.placeholder.image": "Card back image URL",
    "dialog.create": "Create",
    "dialog.cancel": "Cancel",

    // エラーメッセージ
    "error.cardbackNotFound": 'Card back "{id}" not found',
    "error.cardbackSelectionError": "Error occurred while selecting card back",
    "error.cardbackSelectionFailed": "Failed to select card back",
    "error.cardbackPurchaseFailed": "Failed to purchase card back",

    // 監修者ページ
    "supervisor.title": "Tarot Supervisor",
    "supervisor.name": "Kanau Kiryuu",
    "supervisor.greeting.tab": "Greeting",
    "supervisor.profile.tab": "Profile",
    "supervisor.greeting.content1":
      "Thank you for using this app. I am Kanau Kiryuu, the tarot supervisor for this application.",
    "supervisor.greeting.content2":
      "Tarot cards symbolically depict various aspects of life, emotions, and choices. Their profound wisdom can greatly assist in self-understanding and decision-making at life's crossroads.",
    "supervisor.greeting.content3":
      "I hope this app deepens your understanding of tarot and brings new perspectives to your daily life. Remember that divination doesn't predict an absolute future, but rather suggests one possibility. The final choice always remains in your hands.",
    "supervisor.greeting.signature": "Kanau Kiryuu",
    "supervisor.profile.title": "Profile",
    "supervisor.profile.bio1":
      "Born in Yokohama in 1969. Known as the 'Naming King of Yokohama', I became interested in divination from a young age due to my grandmother's influence.",
    "supervisor.profile.bio2":
      "My original career was as an IT engineer, but I became so immersed in studying divination that I decided to become a professional fortune teller.",
    "supervisor.profile.bio3": "I successfully used divination to overcome my own depression and insomnia.",
    "supervisor.profile.bio4":
      "I specialize in name analysis and am proficient in various divination methods including Four Pillars of Destiny, Tarot, Numerology, Palm Reading, and Six-Star Astrology.",
    "supervisor.profile.bio5": "I have named many babies and created business names for clients.",
    "supervisor.qualifications.title": "Certifications",
    "supervisor.qualifications.item1": "Certified Four Pillars of Destiny Diviner by the Japan Divination Association",
    "supervisor.titles.title": "Other Titles",
    "supervisor.titles.item1": "Name Analysis Diviner / Auspicious Naming Specialist",
    "supervisor.titles.item2": "Individual Investor",
    "supervisor.titles.item3": "AI Engineer",
    "supervisor.stats.experience": "Years of Experience",
    "supervisor.stats.readings": "Readings",
    "supervisor.stats.accuracy": "Accuracy Rate",
    "supervisor.services.title": "Free Divination Services",
    "supervisor.services.home.title": "Home Fortune Analysis",
    "supervisor.services.home.description": "Analyze the fortune power in your address",
    "supervisor.services.car.title": "Car Fortune Analysis",
    "supervisor.services.car.description": "Analyze the fortune power and personality in your car's license plate",
    "supervisor.services.button": "Analyze",
    "supervisor.line.add": "Add on LINE",
    "supervisor.line.qr.title": "Add on LINE",
    "supervisor.line.qr.instruction": "Scan this QR code with your LINE app to add as a friend",
    "supervisor.line.open": "Open in LINE App",
    "supervisor.website": "Official Website",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ja")

  useEffect(() => {
    // ローカルストレージから言語設定を読み込み
    try {
      const savedLanguage = localStorage.getItem("tarot-language") as Language
      if (savedLanguage && (savedLanguage === "ja" || savedLanguage === "en")) {
        setLanguageState(savedLanguage)
      }
    } catch (error) {
      console.warn("Failed to load language from localStorage:", error)
      setLanguageState("ja")
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("tarot-language", lang)
    } catch (error) {
      console.warn("Failed to save language to localStorage:", error)
    }
  }

  const t = (key: string): string => {
    if (!key) return ""

    try {
      const translation = translations[language][key]
      if (translation) {
        return translation
      }

      // フォールバック: 英語版を試す
      const fallback = translations.en[key]
      if (fallback) {
        return fallback
      }

      // 翻訳が見つからない場合はキーを返す
      return key
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error)
      return key
    }
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
