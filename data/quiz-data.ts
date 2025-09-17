import type { QuizQuestion, ResultMessages } from "@/types/quiz"
import { quizQuestionsPart1 } from "./quiz-questions-part1"
import { quizQuestionsPart2 } from "./quiz-questions-part2"
import { quizQuestionsPart3 } from "./quiz-questions-part3"
import { quizQuestionsPart4 } from "./quiz-questions-part4"

// 全てのクイズ質問を結合
export const quizQuestions: QuizQuestion[] = [
  ...quizQuestionsPart1,
  ...quizQuestionsPart2,
  ...quizQuestionsPart3,
  ...quizQuestionsPart4,
]

// 選択肢と正解インデックスをシャッフルする関数
function shuffleOptionsAndCorrectAnswer(question: QuizQuestion): QuizQuestion {
  try {
    // options の構造を確認
    if (!question.options) {
      console.error("Question options is undefined:", question)
      return question
    }

    // options が言語ごとのオブジェクトかどうかを確認
    if (
      typeof question.options === "object" &&
      !Array.isArray(question.options) &&
      question.options.ja &&
      question.options.en
    ) {
      // 言語ごとのオブジェクトの場合
      const originalJaOptions = Array.isArray(question.options.ja) ? [...question.options.ja] : []
      const originalEnOptions = Array.isArray(question.options.en) ? [...question.options.en] : []

      if (originalJaOptions.length === 0 || originalEnOptions.length === 0) {
        console.error("Empty options arrays:", question.options)
        return question
      }

      // 元の正解オプション
      const originalCorrectOptionJa = originalJaOptions[question.correctAnswer]
      const originalCorrectOptionEn = originalEnOptions[question.correctAnswer]

      // インデックスの配列を作成してシャッフル
      const indices = Array.from({ length: originalJaOptions.length }, (_, i) => i)
      const shuffledIndices = indices.sort(() => 0.5 - Math.random())

      // シャッフルされたインデックスに基づいて選択肢を並び替え
      const shuffledJa = shuffledIndices.map((i) => originalJaOptions[i])
      const shuffledEn = shuffledIndices.map((i) => originalEnOptions[i])

      // シャッフル後の正解インデックスを見つける
      const newCorrectAnswer = shuffledJa.findIndex((option) => option === originalCorrectOptionJa)

      return {
        ...question,
        options: {
          ja: shuffledJa,
          en: shuffledEn,
        },
        correctAnswer: newCorrectAnswer,
      }
    } else if (Array.isArray(question.options)) {
      // 単純な配列の場合
      const originalOptions = [...question.options]
      const originalCorrectOption = originalOptions[question.correctAnswer]

      // 選択肢をシャッフル
      const shuffledOptions = [...originalOptions].sort(() => 0.5 - Math.random())

      // シャッフル後の正解インデックスを見つける
      const newCorrectAnswer = shuffledOptions.findIndex((option) => option === originalCorrectOption)

      return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer,
      }
    } else {
      console.error("Unknown options structure:", question.options)
      return question
    }
  } catch (error) {
    console.error("Error in shuffleOptionsAndCorrectAnswer:", error, question)
    return question
  }
}

// ランダムなクイズ質問を取得する関数
export function getRandomQuizQuestions(count: number): QuizQuestion[] {
  try {
    // 問題をランダムに選択
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length))

    // 各問題の選択肢と正解インデックスをシャッフル
    return selectedQuestions.map((question) => {
      try {
        return shuffleOptionsAndCorrectAnswer(question)
      } catch (error) {
        console.error("Error shuffling question:", error, question)
        return question // エラーが発生した場合は元の問題をそのまま返す
      }
    })
  } catch (error) {
    console.error("Error in getRandomQuizQuestions:", error)
    return []
  }
}

export const resultMessages: ResultMessages = {
  excellent: {
    ja: [
      "素晴らしい！タロットの知識が非常に豊富ですね。あなたはまさにタロットマスターです。",
      "完璧です！タロットに関する深い理解がありますね。どんな質問にも答えられるでしょう。",
      "驚くべき知識です！タロットのエキスパートとして、その才能を活かしてください。",
    ],
    en: [
      "Excellent! You have extensive knowledge of Tarot. You are truly a Tarot master.",
      "Perfect! You have a deep understanding of Tarot. You can answer any question.",
      "Amazing knowledge! As a Tarot expert, please make use of your talents.",
    ],
  },
  good: {
    ja: [
      "よくできました！タロットの知識が豊富ですね。さらに学習を重ねれば、より深く理解できるでしょう。",
      "素晴らしい！タロットの理解度が高いですね。この調子で学習を続けてください。",
      "良い結果です！タロットの知識が十分にあります。実践でさらに経験を積んでください。",
    ],
    en: [
      "Well done! You have extensive Tarot knowledge. With further study, you can understand even deeper.",
      "Excellent! Your understanding of Tarot is high. Keep up this level of learning.",
      "Good results! You have sufficient Tarot knowledge. Gain more experience through practice.",
    ],
  },
  average: {
    ja: [
      "まずまずの結果です。タロットの基本的な知識はありますが、さらに学習が必要です。",
      "平均的な結果です。タロットの知識を深めるために、もっと学習しましょう。",
      "もう少し頑張りましょう！タロットの知識を向上させるために、積極的に学習してください。",
    ],
    en: [
      "Fair results. You have basic Tarot knowledge, but more study is needed.",
      "Average results. Let's study more to deepen your Tarot knowledge.",
      "Try a little harder! Please study actively to improve your Tarot knowledge.",
    ],
  },
  poor: {
    ja: [
      "残念ながら、あまり良い結果ではありませんでした。タロットの学習を始めることをお勧めします。",
      "もう少し学習が必要です。タロットの知識を身につけて、再度挑戦してみてください。",
      "頑張りましょう！タロットの学習を始めることで、より良い結果が得られるはずです。",
    ],
    en: [
      "Unfortunately, the results were not very good. We recommend starting to study Tarot.",
      "A little more study is needed. Acquire Tarot knowledge and try again.",
      "Let's work hard! By starting to study Tarot, you should get better results.",
    ],
  },
}
