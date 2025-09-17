export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}
