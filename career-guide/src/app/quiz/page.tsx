'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { quizQuestions, calculateQuizResults } from '@/data/quiz'
import { useQuizStore } from '@/stores/useQuizStore'
import { getRoleById, categoryLabels } from '@/data/roles'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function QuizPage() {
  const router = useRouter()
  const {
    answers,
    results,
    currentQuestion,
    isCompleted,
    setAnswer,
    nextQuestion,
    prevQuestion,
    setResults,
    resetQuiz,
    getAnswer,
  } = useQuizStore()

  const [isCalculating, setIsCalculating] = useState(false)

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const currentAnswer = question ? getAnswer(question.id) : undefined

  const handleSelectOption = (value: string) => {
    if (!question) return
    setAnswer(question.id, value)

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        nextQuestion()
      }
    }, 300)
  }

  const handleFinishQuiz = async () => {
    setIsCalculating(true)

    // Simulate calculation time for effect
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const results = calculateQuizResults(answers)
    setResults(results)
    setIsCalculating(false)
  }

  const handleRetakeQuiz = () => {
    resetQuiz()
  }

  // Quiz intro screen
  if (currentQuestion === 0 && !currentAnswer && answers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Find Your Perfect Tech Role
          </h1>
          <p className="text-muted-foreground mb-6">
            Answer 12 quick questions about your interests, work style, and values.
            We&apos;ll match you with the best career paths.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>2-3 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span>100% private</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setAnswer('start', 'true')}
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Quiz
          </Button>

          <p className="mt-6 text-sm text-muted-foreground">
            15,000+ students found their path
          </p>
        </motion.div>
      </div>
    )
  }

  // Calculating results screen
  if (isCalculating) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-6"
          >
            ⚡
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">
            Analyzing your responses...
          </h2>
          <p className="text-muted-foreground">
            Matching you with the best career paths
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (isCompleted && results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Confetti effect */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Your Top Role Matches
            </h1>
            <p className="text-muted-foreground">
              Based on your personality and preferences
            </p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {results.slice(0, 3).map((result, index) => {
              const role = getRoleById(result.roleId)
              if (!role) return null

              const medals = ['🥇', '🥈', '🥉']

              return (
                <motion.div
                  key={result.roleId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={cn(
                    'p-6 rounded-2xl border bg-card',
                    index === 0 && 'border-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20'
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{medals[index]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{role.icon}</span>
                        <h2 className="text-xl font-semibold">{role.roleName}</h2>
                      </div>
                      <Badge variant="secondary" className="mb-3">
                        {categoryLabels[role.category]}
                      </Badge>

                      {/* Match Score */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">
                            Match Score
                          </span>
                          <span className="font-semibold text-primary">
                            {result.matchScore}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.matchScore}%` }}
                            transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                            className={cn(
                              'h-full rounded-full',
                              result.matchScore >= 80
                                ? 'bg-green-500'
                                : result.matchScore >= 60
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            )}
                          />
                        </div>
                      </div>

                      {/* Why it fits */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Why it fits you:
                        </h4>
                        <ul className="space-y-1">
                          {role.personalityFit?.thriveIf
                            ?.slice(0, 3)
                            .map((reason, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="text-green-600">✓</span>
                                {reason}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <Button asChild className="mt-4" variant="outline">
                        <Link href={`/role/${result.roleId}`}>
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button onClick={handleRetakeQuiz} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button asChild className="flex-1">
              <Link href="/browse">Explore All Roles</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Quiz questions
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} of {quizQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          {question && (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mb-8"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options?.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectOption(option.value)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border transition-all',
                      currentAnswer === option.value
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className="font-medium">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <div />
          {currentQuestion === quizQuestions.length - 1 && currentAnswer ? (
            <Button onClick={handleFinishQuiz} className="gap-2">
              See Results
              <Sparkles className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!currentAnswer}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
