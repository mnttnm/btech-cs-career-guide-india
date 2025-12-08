'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Target, Clock, Lock, Zap, PartyPopper, Trophy, Medal, Award, Check, PlayCircle, TrendingUp, AlertTriangle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { quizQuestions, calculateQuizResults } from '@/data/quiz'
import { useQuizStore } from '@/stores/useQuizStore'
import { getRoleById, categoryLabels } from '@/data/roles'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getRoleIcon } from '@/lib/icons'
import { springs, stagger, easings } from '@/lib/motion'

// Explicit question order: start from high-level values, then work style, then technical fit
const QUESTION_ORDER = [
  // 1. High-level Career Direction (The "North Star")
  'q2',  // Broad career path shape (Standard vs Hybrid/Business vs Specialized)
  'q1',  // Domain interest (Visual vs Data vs Systems vs Security)
  'q8',  // Impact type (User vs Business vs Technical)

  // 2. Cognitive & Hard Skills (The "Toolbox")
  'q12', // Natural thinking style (Creative vs Analytical vs Systems)
  'q3',  // Math/Stats comfort (Critical constraint for Data/AI)
  'q7',  // Continuous learning (Pace of technology change)

  // 3. Work Style & Personality (The "Environment")
  'q5',  // Team vs Independent work
  'q10', // Communication/Presentation comfort
  'q4',  // Handling pressure and deadlines

  // 4. Practical Constraints & Future (The "Guardrails")
  'q6',  // Work-life balance
  'q9',  // Salary/compensation importance
  'q11', // Leadership interest
] as const

const orderedQuestions = QUESTION_ORDER
  .map((id) => quizQuestions.find((q) => q.id === id))
  .filter((q) => Boolean(q))

const TOTAL_QUIZ_QUESTIONS = orderedQuestions.length

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

  const question = orderedQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / TOTAL_QUIZ_QUESTIONS) * 100
  const currentAnswer = question ? getAnswer(question.id) : undefined

  // Count actual question answers (excluding 'start')
  const answeredQuestions = answers.filter(a => a.questionId !== 'start').length

  // Calculate live preview after 6 questions
  const livePreview = useMemo(() => {
    const actualAnswers = answers.filter(a => a.questionId !== 'start')
    if (actualAnswers.length < 6) return null

    const previewResults = calculateQuizResults(actualAnswers)
    if (previewResults.length === 0) return null

    // Count potential matches (score >= 60%)
    const potentialMatches = previewResults.filter(r => r.matchScore >= 50)

    return {
      count: potentialMatches.length,
      topScore: potentialMatches[0]?.matchScore || 0
    }
  }, [answers])

  const handleSelectOption = (value: string) => {
    if (!question) return
    setAnswer(question.id, value)

    // Auto-advance after short delay, but not on the last question
    setTimeout(() => {
      if (currentQuestion < TOTAL_QUIZ_QUESTIONS - 1) {
        setDirection('forward')
        nextQuestion()
      }
      // On last question, don't auto-advance - let user click "See Results"
    }, 400)
  }

  // Check if all questions are answered
  const allQuestionsAnswered = answeredQuestions === TOTAL_QUIZ_QUESTIONS

  const handlePrevQuestion = () => {
    setDirection('backward')
    prevQuestion()
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
            You completed {answeredQuestions} of {TOTAL_QUIZ_QUESTIONS} questions.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Your progress was saved automatically.
          </p>

          {/* Progress indicator */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions / TOTAL_QUIZ_QUESTIONS) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((answeredQuestions / TOTAL_QUIZ_QUESTIONS) * 100)}% complete
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

  // Quiz intro screen
  if (currentQuestion === 0 && !currentAnswer && answers.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse" />
            <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-xl shadow-primary/10">
              <Target className="w-12 h-12 text-primary drop-shadow-md" />
          </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 text-balance">
            Find your perfect career fit
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Answer 12 quick questions about your interests, work style, and values.
            We&apos;ll match you with the best career paths in tech.
          </p>

          <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground mb-10 bg-muted/30 p-4 rounded-full w-fit mx-auto border border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>2-3 minutes</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>100% private</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => setAnswer('start', 'true')}
            className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
            Start Career Quiz
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
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 relative"
          >
            <Zap className="w-10 h-10 text-primary absolute" />
            <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-3">
            Analyzing your responses...
          </h2>
          <p className="text-muted-foreground">
            Matching your unique profile with industry roles
          </p>
        </div>
      </div>
    )
  }

  // Results screen
  if (isCompleted && results && !isCalculating) {
    const medalIcons = [Trophy, Medal, Award, Star, Sparkles];
    const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600', 'text-blue-500', 'text-purple-500'];

    return (
      <div className="container relative mx-auto px-4 py-8 overflow-hidden">
        {/* Subtle glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springs.smooth}
          className="relative max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={springs.bouncy}
              className="inline-flex items-center justify-center p-4 mb-6 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-500/5 ring-1 ring-green-500/20 shadow-lg shadow-green-500/10"
            >
              <PartyPopper className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
            >
              Your Perfect Career Matches
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto"
            >
              Based on your personality, cognitive style, and preferences
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 inline-flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-left max-w-xl mx-auto"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                These matches are a starting point. Explore the detailed role pages to fully understand what each path entails.
              </p>
            </motion.div>
          </div>

          {/* Results Grid */}
          <div className="space-y-6">
            {results.slice(0, 5).map((result, index) => {
              const role = getRoleById(result.roleId)
              if (!role) return null

              const MedalIcon = medalIcons[index]
              const RoleIcon = getRoleIcon(role.roleId, role.category)
              const isTopMatch = index === 0

              return (
                <motion.div
                  key={result.roleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className={cn(
                  'group relative p-6 md:p-8 rounded-3xl border transition-all duration-300',
                  isTopMatch
                    ? 'bg-gradient-to-br from-card via-card to-background border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/10'
                    : 'bg-card border-border/50 hover:border-primary/20 hover:shadow-lg'
                )}
                >
                  {isTopMatch && (
                    <div className="absolute -top-3 -right-3 md:-right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                      <Trophy className="w-3 h-3" />
                      TOP MATCH
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left: Score & Icon */}
                    <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-6 md:w-32 shrink-0">
                      <div className={cn(
                        'flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-inner',
                        isTopMatch ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                      )}>
                        {isTopMatch ? (
                          <div className="text-center">
                            <span className="block text-2xl md:text-3xl font-bold">{result.matchScore}%</span>
                        </div>
                        ) : (
                          <RoleIcon className="w-8 h-8 md:w-10 md:h-10" />
                        )}
                      </div>

                      <div className="flex-1 md:w-full md:text-center">
                        <div className="flex items-center md:justify-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
                          <span>Match</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.matchScore}%` }}
                            transition={{ delay: index * 0.15 + 0.5, duration: 1, ease: "circOut" }}
                            className={cn(
                              'h-full rounded-full',
                            result.matchScore >= 80 ? 'bg-green-500' :
                              result.matchScore >= 60 ? 'bg-amber-500' : 'bg-orange-500'
                          )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{role.roleName}</h2>
                          {isTopMatch && <MedalIcon className="w-6 h-6 text-amber-500" />}
                        </div>
                        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium">
                          {categoryLabels[role.category]}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold mb-2 text-foreground/80">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          Why it fits you
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {role.personalityFit?.thriveIf
                            ?.slice(0, 4)
                            .map((reason, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <Button asChild className="w-full sm:w-auto gap-2 group/btn" variant={isTopMatch ? "default" : "outline"}>
                        <Link href={`/role/${result.roleId}?from=quiz`}>
                            Explore Role
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8 justify-center">
            <Button onClick={handleRetakeQuiz} variant="outline" size="lg" className="gap-2 px-8">
              <RotateCcw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button asChild size="lg" className="gap-2 px-8 shadow-lg shadow-primary/20">
              <Link href="/browse">
                Explore All Roles
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Quiz questions
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      {/* Progress Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            Step {currentQuestion + 1} of {TOTAL_QUIZ_QUESTIONS}
          </span>
        </div>
        <QuizProgress current={currentQuestion} total={TOTAL_QUIZ_QUESTIONS} />

        {/* Live Preview Notification */}
        <AnimatePresence>
          {livePreview && livePreview.count > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                <div className="p-1.5 bg-primary/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Live Analysis</span>
                  <p className="text-sm font-medium text-foreground/80">
                    {livePreview.count} potential career matches identified so far
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait" custom={direction}>
          {question && (
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm"
            >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-snug">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options?.map((option, index) => {
                  const isSelected = currentAnswer === option.value
                  return (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, backgroundColor: 'var(--muted)' }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectOption(option.value)}
                      className={cn(
                        'w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 relative overflow-hidden group',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                          : 'border-border/50 hover:border-primary/30 bg-background'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          'flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-300 shrink-0',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/30 group-hover:border-primary/50'
                        )}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={cn(
                          "font-medium  text-lg transition-colors",
                          isSelected ? "text-primary" : "text-foreground"
                        )}>
                          {option.label}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>

            {/* See Results Button - appears when all questions are answered */}
            <AnimatePresence>
              {allQuestionsAnswered && currentAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t"
                >
                  <Button
                    size="lg"
                    onClick={handleFinishQuiz}
                    className="w-full gap-2 shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5" />
                    See Your Results
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    You've answered all {TOTAL_QUIZ_QUESTIONS} questions!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          )}
      </AnimatePresence>
    </div>
  )
}
