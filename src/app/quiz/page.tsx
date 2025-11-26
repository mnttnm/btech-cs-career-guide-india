'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Target, Clock, Lock, Zap, PartyPopper, Trophy, Medal, Award, Check, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { quizQuestions, calculateQuizResults } from '@/data/quiz'
import { useQuizStore } from '@/stores/useQuizStore'
import { getRoleById, categoryLabels } from '@/data/roles'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getRoleIcon } from '@/lib/icons'
import { springs, stagger, easings } from '@/lib/motion'

// Progress dots component
function QuizProgress({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center justify-center gap-1.5"
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Question ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            scale: i === current ? 1.2 : 1,
            backgroundColor: i < current ? 'var(--primary)' : i === current ? 'var(--primary)' : 'var(--muted)',
          }}
          transition={springs.snappy}
          aria-hidden="true"
          className={cn(
            'w-2 h-2 rounded-full',
            i <= current ? 'bg-primary' : 'bg-muted'
          )}
        />
      ))}
    </div>
  )
}

export default function QuizPage() {
  const {
    answers,
    results,
    currentQuestion,
    isCompleted,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    setResults,
    resetQuiz,
    getAnswer,
  } = useQuizStore()

  const [isCalculating, setIsCalculating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  // Check if there's saved progress on mount
  useEffect(() => {
    setHasMounted(true)
    // Check for in-progress quiz (has answers but not completed)
    const hasProgress = answers.length > 0 && !isCompleted
    if (hasProgress) {
      setShowResumePrompt(true)
    }
  }, [])

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100
  const currentAnswer = question ? getAnswer(question.id) : undefined

  // Count actual question answers (excluding 'start')
  const answeredQuestions = answers.filter(a => a.questionId !== 'start').length

  const handleSelectOption = (value: string) => {
    if (!question) return
    setAnswer(question.id, value)

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setDirection('forward')
        nextQuestion()
      }
    }, 400)
  }

  const handlePrevQuestion = () => {
    setDirection('backward')
    prevQuestion()
  }

  const handleNextQuestion = () => {
    setDirection('forward')
    nextQuestion()
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

  // Handle resume or start over
  const handleContinue = () => {
    setShowResumePrompt(false)
    // Go to the next unanswered question
    goToQuestion(answeredQuestions)
  }

  const handleStartOver = () => {
    resetQuiz()
    setShowResumePrompt(false)
  }

  // Resume prompt for returning users with in-progress quiz
  if (showResumePrompt && hasMounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10">
            <PlayCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Continue your quiz?
          </h1>
          <p className="text-muted-foreground mb-2">
            You completed {answeredQuestions} of {quizQuestions.length} questions.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Your progress was saved automatically.
          </p>

          {/* Progress indicator */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions / quizQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((answeredQuestions / quizQuestions.length) * 100)}% complete
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start over
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Continue where I left off
            </Button>
          </div>
        </motion.div>
      </div>
    )
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
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Find the career that fits you
          </h1>
          <p className="text-muted-foreground mb-6">
            Answer 12 quick questions about your interests, work style, and values.
            We&apos;ll match you with the best career paths.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>2-3 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>100% private</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setAnswer('start', 'true')}
            className="gap-2"
          >
            <Sparkles className="w-5 h-5" aria-hidden="true" />
            Find your career match
          </Button>
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
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10"
          >
            <Zap className="w-10 h-10 text-primary" />
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
    const medalIcons = [Trophy, Medal, Award]
    const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600']

    return (
      <div className="container relative mx-auto px-4 py-8 overflow-hidden">
        {/* Subtle glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--brand-subtle),transparent_60%)] opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--success)/0.1,transparent_50%)]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springs.smooth}
          className="relative max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={springs.bouncy}
              className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl bg-success/10"
            >
              <PartyPopper className="w-10 h-10 text-success" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold mb-2"
            >
              Your Top Role Matches
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Based on your personality and preferences
            </motion.p>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {results.slice(0, 3).map((result, index) => {
              const role = getRoleById(result.roleId)
              if (!role) return null

              const MedalIcon = medalIcons[index]
              const RoleIcon = getRoleIcon(role.roleId, role.category)

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
                    <div className={cn('flex items-center justify-center w-12 h-12 rounded-xl', index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-muted')}>
                      <MedalIcon className={cn('w-6 h-6', medalColors[index])} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                          <RoleIcon className="w-4 h-4 text-primary" />
                        </div>
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
                          Explore {role.roleName}
                          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
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

  // Animation variants for directional transitions
  const slideVariants = {
    enter: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? -30 : 30,
      opacity: 0,
    }),
  }

  // Quiz questions
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevQuestion}
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
          <QuizProgress current={currentQuestion} total={quizQuestions.length} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait" custom={direction}>
          {question && (
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: easings.easeOut }}
              className="mb-8"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {question.options?.map((option, index) => {
                  const isSelected = currentAnswer === option.value
                  return (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden',
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={false}
                          animate={{
                            scale: isSelected ? 1 : 0.8,
                            backgroundColor: isSelected ? 'var(--primary)' : 'var(--muted)',
                          }}
                          transition={springs.snappy}
                          className={cn(
                            'flex items-center justify-center w-5 h-5 rounded-full shrink-0',
                            isSelected ? 'bg-primary' : 'bg-muted'
                          )}
                        >
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={springs.bouncy}
                              >
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                        <span className="font-medium">{option.label}</span>
                      </div>
                    </motion.button>
                  )
                })}
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
              onClick={handleNextQuestion}
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
