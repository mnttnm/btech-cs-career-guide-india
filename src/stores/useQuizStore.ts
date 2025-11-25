import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QuizAnswer, QuizResult } from '@/data/quiz'

interface QuizStore {
  answers: QuizAnswer[]
  results: QuizResult[] | null
  currentQuestion: number
  isCompleted: boolean

  setAnswer: (questionId: string, answer: string | number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void
  setResults: (results: QuizResult[]) => void
  resetQuiz: () => void
  getAnswer: (questionId: string) => string | number | undefined
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      answers: [],
      results: null,
      currentQuestion: 0,
      isCompleted: false,

      setAnswer: (questionId, answer) =>
        set((state) => {
          const existingIndex = state.answers.findIndex(
            (a) => a.questionId === questionId
          )
          if (existingIndex >= 0) {
            const newAnswers = [...state.answers]
            newAnswers[existingIndex] = { questionId, answer }
            return { answers: newAnswers }
          }
          return { answers: [...state.answers, { questionId, answer }] }
        }),

      nextQuestion: () =>
        set((state) => ({ currentQuestion: state.currentQuestion + 1 })),

      prevQuestion: () =>
        set((state) => ({
          currentQuestion: Math.max(0, state.currentQuestion - 1),
        })),

      goToQuestion: (index) => set({ currentQuestion: index }),

      setResults: (results) => set({ results, isCompleted: true }),

      resetQuiz: () =>
        set({
          answers: [],
          results: null,
          currentQuestion: 0,
          isCompleted: false,
        }),

      getAnswer: (questionId) =>
        get().answers.find((a) => a.questionId === questionId)?.answer,
    }),
    {
      name: 'quiz-storage',
    }
  )
)
