import type { QuizQuestion } from "@/types/quiz"

export const quizQuestionsPart1: QuizQuestion[] = [
  {
    id: 1,
    question: {
      ja: "タロットカードの「愚者」のカード番号は何番ですか？",
      en: "What is the card number of 'The Fool' in Tarot?",
    },
    options: {
      ja: ["0番", "1番", "21番", "22番"],
      en: ["0", "1", "21", "22"],
    },
    correctAnswer: 0,
    explanation: {
      ja: "愚者は0番のカードです。タロットの大アルカナの最初のカードとして、新しい始まりや無限の可能性を象徴します。",
      en: "The Fool is card number 0. As the first card of the Major Arcana, it symbolizes new beginnings and infinite possibilities.",
    },
    difficulty: "easy",
    category: "meaning",
    cardId: 0,
  },
  {
    id: 2,
    question: {
      ja: "「魔術師」のカードが象徴する主な意味は何ですか？",
      en: "What is the main meaning symbolized by 'The Magician' card?",
    },
    options: {
      ja: ["創造力と意志力", "愛と調和", "死と再生", "正義と公平"],
      en: ["Creativity and willpower", "Love and harmony", "Death and rebirth", "Justice and fairness"],
    },
    correctAnswer: 0,
    explanation: {
      ja: "魔術師は創造力、意志力、そして目標を実現する力を象徴します。四大元素すべてを操る能力を持つとされています。",
      en: "The Magician symbolizes creativity, willpower, and the power to manifest goals. It is said to have the ability to manipulate all four elements.",
    },
    difficulty: "easy",
    category: "meaning",
    cardId: 1,
  },
  {
    id: 3,
    question: {
      ja: "タロットの大アルカナは全部で何枚ありますか？",
      en: "How many cards are there in the Major Arcana of Tarot?",
    },
    options: {
      ja: ["20枚", "21枚", "22枚", "23枚"],
      en: ["20 cards", "21 cards", "22 cards", "23 cards"],
    },
    correctAnswer: 2,
    explanation: {
      ja: "大アルカナは0番の愚者から21番の世界まで、全部で22枚のカードで構成されています。",
      en: "The Major Arcana consists of 22 cards in total, from 0 (The Fool) to 21 (The World).",
    },
    difficulty: "easy",
    category: "history",
  },
  {
    id: 4,
    question: {
      ja: "「死神」のカードの一般的な意味は何ですか？",
      en: "What is the general meaning of 'Death' card?",
    },
    options: {
      ja: ["物理的な死", "変化と再生", "病気", "不幸"],
      en: ["Physical death", "Change and rebirth", "Illness", "Misfortune"],
    },
    correctAnswer: 1,
    explanation: {
      ja: "死神のカードは物理的な死を意味するのではなく、変化、終わりと新しい始まり、再生を象徴します。",
      en: "The Death card does not signify physical death, but symbolizes change, endings and new beginnings, and rebirth.",
    },
    difficulty: "medium",
    category: "meaning",
    cardId: 13,
  },
  {
    id: 5,
    question: {
      ja: "タロットカードの小アルカナは何つのスートに分かれていますか？",
      en: "How many suits are there in the Minor Arcana of Tarot?",
    },
    options: {
      ja: ["3つ", "4つ", "5つ", "6つ"],
      en: ["3", "4", "5", "6"],
    },
    correctAnswer: 1,
    explanation: {
      ja: "小アルカナは4つのスート（ワンド、カップ、ソード、ペンタクル）に分かれており、各スートは14枚のカードで構成されています。",
      en: "The Minor Arcana is divided into 4 suits (Wands, Cups, Swords, Pentacles), with each suit consisting of 14 cards.",
    },
    difficulty: "easy",
    category: "history",
  },
]
