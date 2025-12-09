import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  QuizAnswer,
  QuizResult,
  TieredQuizResults,
  getActiveQuestions,
  canShowEarlyResults as checkEarlyResults,
} from '@/data/quiz'

interface QuizStore {
  answers: QuizAnswer[]
  results: QuizResult[] | null
  tieredResults: TieredQuizResults | null
  currentQuestion: number
  isCompleted: boolean

  // Early exit state
  earlyExitOffered: boolean
  earlyExitDismissed: boolean

  // Actions
  setAnswer: (questionId: string, answer: string | number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  goToQuestion: (index: number) => void
  setResults: (results: QuizResult[]) => void
  setTieredResults: (results: TieredQuizResults) => void
  resetQuiz: () => void
  getAnswer: (questionId: string) => string | number | undefined
  dismissEarlyExit: () => void

  // Computed helpers (call these as functions)
  getActiveQuestionList: () => ReturnType<typeof getActiveQuestions>
  hasMinimumAnswers: () => boolean
  canEarlyExit: () => { eligible: boolean; strongCount: number }
}

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      answers: [],
      results: null,
      tieredResults: null,
      currentQuestion: 0,
      isCompleted: false,
      earlyExitOffered: false,
      earlyExitDismissed: false,

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

      setTieredResults: (tieredResults) =>
        set({ tieredResults, isCompleted: true }),

      resetQuiz: () =>
        set({
          answers: [],
          results: null,
          tieredResults: null,
          currentQuestion: 0,
          isCompleted: false,
          earlyExitOffered: false,
          earlyExitDismissed: false,
        }),

      getAnswer: (questionId) =>
        get().answers.find((a) => a.questionId === questionId)?.answer,

      dismissEarlyExit: () =>
        set({ earlyExitOffered: true, earlyExitDismissed: true }),

      // Computed helpers
      getActiveQuestionList: () => getActiveQuestions(get().answers),

      hasMinimumAnswers: () => {
        const actualAnswers = get().answers.filter(
          (a) => a.questionId !== 'start'
        )
        return actualAnswers.length >= 5
      },

      canEarlyExit: () => {
        const state = get()
        // Don't offer if already dismissed
        if (state.earlyExitDismissed) {
          return { eligible: false, strongCount: 0 }
        }
        const result = checkEarlyResults(state.answers)
        return { eligible: result.eligible, strongCount: result.strongMatchCount }
      },
    }),
    {
      name: 'quiz-storage',
    }
  )
)
