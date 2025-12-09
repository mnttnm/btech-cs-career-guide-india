'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Target, Clock, Lock, Zap, PartyPopper, Trophy, Check, PlayCircle, TrendingUp, AlertTriangle, MessageSquare, BarChart3, CircleCheck, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { calculateQuizResults, calculateTieredResults, TieredResult } from '@/data/quiz'
import { useQuizStore } from '@/stores/useQuizStore'
import { getRoleById, categoryLabels } from '@/data/roles'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getRoleIcon } from '@/lib/icons'
import { springs } from '@/lib/motion'

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
    tieredResults,
    currentQuestion,
    isCompleted,
    setAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    setResults,
    setTieredResults,
    resetQuiz,
    getAnswer,
    getActiveQuestionList,
    canEarlyExit,
    dismissEarlyExit,
    earlyExitDismissed,
  } = useQuizStore()

  const [isCalculating, setIsCalculating] = useState(false)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [showEarlyExitPrompt, setShowEarlyExitPrompt] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  // Get dynamic question list based on answers (handles gating)
  const activeQuestions = useMemo(() => getActiveQuestionList(), [getActiveQuestionList])
  const totalQuestions = activeQuestions.length

  // Check if there's saved progress on mount
  useEffect(() => {
    setHasMounted(true)
    // Check for in-progress quiz (has answers but not completed)
    const hasProgress = answers.length > 0 && !isCompleted
    if (hasProgress) {
      setShowResumePrompt(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const question = activeQuestions[currentQuestion]
  const currentAnswer = question ? getAnswer(question.id) : undefined

  // Count actual question answers (excluding 'start')
  const answeredQuestions = answers.filter(a => a.questionId !== 'start').length

  // Check for early exit eligibility
  const earlyExitStatus = useMemo(() => canEarlyExit(), [canEarlyExit])

  // Calculate live preview after 5 questions (updated for tiered results)
  const livePreview = useMemo(() => {
    const actualAnswers = answers.filter(a => a.questionId !== 'start')
    if (actualAnswers.length < 5) return null

    const previewResults = calculateTieredResults(actualAnswers)
    const totalMatches = previewResults.strongMatches.length + previewResults.goodMatches.length

    return {
      strongCount: previewResults.strongMatches.length,
      goodCount: previewResults.goodMatches.length,
      totalCount: totalMatches,
    }
  }, [answers])

  const handleSelectOption = (value: string) => {
    if (!question) return
    setAnswer(question.id, value)

    // Auto-advance after short delay, but not on the last question
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setDirection('forward')
        nextQuestion()
      }
      // On last question, don't auto-advance - let user click "See Results"
    }, 400)
  }

  // Check if all questions are answered
  const allQuestionsAnswered = answeredQuestions >= totalQuestions

  const handlePrevQuestion = () => {
    setDirection('backward')
    prevQuestion()
  }

  const handleFinishQuiz = async () => {
    setIsCalculating(true)

    // Simulate calculation time for effect
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Calculate both legacy and tiered results
    const legacyResults = calculateQuizResults(answers)
    const tiered = calculateTieredResults(answers)
    setResults(legacyResults)
    setTieredResults(tiered)
    setIsCalculating(false)
  }

  const handleEarlyExit = async () => {
    setShowEarlyExitPrompt(false)
    await handleFinishQuiz()
  }

  const handleContinueQuiz = () => {
    setShowEarlyExitPrompt(false)
    dismissEarlyExit()
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

  // Don't render until mounted (prevents hydration mismatch from localStorage)
  if (!hasMounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto text-center">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 animate-pulse" />
          <div className="h-8 w-48 mx-auto bg-muted rounded animate-pulse" />
        </div>
      </div>
    )
  }

  // Resume prompt for returning users with in-progress quiz
  if (showResumePrompt) {
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
            You completed {answeredQuestions} of {totalQuestions} questions.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Your progress was saved automatically.
          </p>

          {/* Progress indicator */}
          <div className="w-full max-w-xs mx-auto mb-8">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((answeredQuestions / totalQuestions) * 100)}% complete
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
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse" />
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-xl shadow-primary/10">
                <Target className="w-12 h-12 text-primary drop-shadow-md" />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 text-balance">
              Let&apos;s find your matches
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
              In 2 minutes, you&apos;ll discover roles that match how you think and what you value.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm font-medium text-muted-foreground mt-6 bg-muted/30 p-4 rounded-full w-fit mx-auto border border-border/50">
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
          </div>

          {/* How It Works */}
          <div className="mb-10">
            <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              How it works
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  step: 1,
                  title: 'Share Preferences',
                  description: 'Tell us about your interests, work style, and what matters to you.',
                  icon: MessageSquare,
                },
                {
                  step: 2,
                  title: 'Get Matched',
                  description: 'We score you against 45+ tech roles based on personality fit.',
                  icon: BarChart3,
                },
                {
                  step: 3,
                  title: 'Explore Results',
                  description: 'See detailed breakdowns with salary, skills, and next steps.',
                  icon: Target,
                },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 rounded-2xl bg-card border"
                  >
                    <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold mb-1 text-sm flex items-center gap-2 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-5 h-5 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {item.step}
                        </span>
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed pl-7">{item.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setAnswer('start', 'true')}
              className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" aria-hidden="true" />
              Start Career Quiz
            </Button>
          </div>
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

  // Results screen with tiered display
  if (isCompleted && tieredResults && !isCalculating) {
    const { strongMatches, goodMatches, possibleMatches, totalAnswered } = tieredResults

    // Tier configuration
    const tierConfig = {
      strong: {
        label: 'Strong Matches',
        description: 'High alignment with your preferences',
        icon: CircleCheck,
        badgeClass: 'bg-green-500/10 text-green-600 border-green-500/30',
        cardClass: 'border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent',
      },
      good: {
        label: 'Good Matches',
        description: 'Solid fit with several key factors',
        icon: Circle,
        badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
        cardClass: 'border-amber-500/20',
      },
      possible: {
        label: 'Worth Exploring',
        description: 'Could be a fit — explore further',
        icon: Circle,
        badgeClass: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
        cardClass: 'border-border/50',
      },
    }

    // Render a single result card
    const renderResultCard = (result: TieredResult, tier: 'strong' | 'good' | 'possible', index: number) => {
      const role = getRoleById(result.roleId)
      if (!role) return null

      const config = tierConfig[tier]
      const RoleIcon = getRoleIcon(role.roleId, role.category)
      const isFirstStrong = tier === 'strong' && index === 0

      return (
        <motion.div
          key={result.roleId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            'group relative p-5 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg',
            config.cardClass,
            isFirstStrong && 'ring-1 ring-green-500/20 shadow-lg shadow-green-500/5'
          )}
        >
          {isFirstStrong && (
            <div className="absolute -top-2.5 -right-2 md:-right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              BEST MATCH
            </div>
          )}

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={cn(
              'flex items-center justify-center w-12 h-12 rounded-xl shrink-0',
              tier === 'strong' ? 'bg-green-500/10' : tier === 'good' ? 'bg-amber-500/10' : 'bg-muted/50'
            )}>
              <RoleIcon className={cn(
                'w-6 h-6',
                tier === 'strong' ? 'text-green-600' : tier === 'good' ? 'text-amber-600' : 'text-muted-foreground'
              )} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{role.roleName}</h3>
                  <Badge variant="outline" className="mt-1.5 text-xs">
                    {categoryLabels[role.category]}
                  </Badge>
                </div>
                <Badge className={cn('shrink-0 text-xs font-medium border', config.badgeClass)}>
                  {tier === 'strong' ? 'Strong' : tier === 'good' ? 'Good' : 'Possible'}
                </Badge>
              </div>

              {/* Key reasons */}
              {role.personalityFit?.thriveIf && role.personalityFit.thriveIf.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {role.personalityFit.thriveIf.slice(0, 2).map((reason, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className={cn(
                        'w-4 h-4 mt-0.5 shrink-0',
                        tier === 'strong' ? 'text-green-500' : tier === 'good' ? 'text-amber-500' : 'text-slate-400'
                      )} />
                      <span className="line-clamp-1">{reason}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Based on answers + CTA */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Based on {result.answeredQuestions} of your answers
                </span>
                <Button asChild size="sm" variant={tier === 'strong' ? 'default' : 'outline'} className="gap-1.5">
                  <Link href={`/role/${result.roleId}?from=quiz`}>
                    Explore
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )
    }

    // Render a tier section
    const renderTierSection = (
      matches: TieredResult[],
      tier: 'strong' | 'good' | 'possible',
      delay: number
    ) => {
      if (matches.length === 0) return null
      const config = tierConfig[tier]
      const TierIcon = config.icon

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg',
              tier === 'strong' ? 'bg-green-500/10' : tier === 'good' ? 'bg-amber-500/10' : 'bg-slate-500/10'
            )}>
              <TierIcon className={cn(
                'w-4 h-4',
                tier === 'strong' ? 'text-green-600' : tier === 'good' ? 'text-amber-600' : 'text-slate-500'
              )} />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{config.label}</h2>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {matches.length} {matches.length === 1 ? 'role' : 'roles'}
            </Badge>
          </div>
          <div className="grid gap-4">
            {matches.map((result, index) => renderResultCard(result, tier, index))}
          </div>
        </motion.div>
      )
    }

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
              Your Career Matches
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-lg mx-auto"
            >
              Based on {totalAnswered} answers about your preferences and style
            </motion.p>

            {/* Summary badges */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              {strongMatches.length > 0 && (
                <Badge className="bg-green-500/10 text-green-600 border border-green-500/30 px-3 py-1">
                  <CircleCheck className="w-3.5 h-3.5 mr-1.5" />
                  {strongMatches.length} Strong
                </Badge>
              )}
              {goodMatches.length > 0 && (
                <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/30 px-3 py-1">
                  {goodMatches.length} Good
                </Badge>
              )}
              {possibleMatches.length > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  {possibleMatches.length} Worth Exploring
                </Badge>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 inline-flex items-start gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-left max-w-xl mx-auto"
            >
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                These matches are a starting point. Explore each role to fully understand what the path entails.
              </p>
            </motion.div>
          </div>

          {/* Tiered Results */}
          <div className="space-y-10">
            {renderTierSection(strongMatches, 'strong', 0.3)}
            {renderTierSection(goodMatches, 'good', 0.5)}
            {renderTierSection(possibleMatches.slice(0, 5), 'possible', 0.7)}
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

  // Early exit prompt
  if (showEarlyExitPrompt && earlyExitStatus.eligible) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-green-500/10">
            <CircleCheck className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            We&apos;ve found {earlyExitStatus.strongCount} Strong Matches!
          </h1>
          <p className="text-muted-foreground mb-2">
            Based on your {answeredQuestions} answers, we&apos;ve identified clear career fits.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            You can see your results now or continue for more precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={handleContinueQuiz}
              className="gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Continue Quiz
            </Button>
            <Button
              size="lg"
              onClick={handleEarlyExit}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <Sparkles className="w-4 h-4" />
              See Results Now
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
            Step {currentQuestion + 1} of {totalQuestions}
          </span>
        </div>
        <QuizProgress current={currentQuestion} total={totalQuestions} />

        {/* Live Preview Notification - Updated for tiered results */}
        <AnimatePresence>
          {livePreview && livePreview.totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
                <div className="p-1.5 bg-green-500/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Live Analysis</span>
                  <p className="text-sm font-medium text-foreground/80">
                    {livePreview.strongCount > 0 && (
                      <span className="text-green-600 font-semibold">{livePreview.strongCount} strong</span>
                    )}
                    {livePreview.strongCount > 0 && livePreview.goodCount > 0 && ' + '}
                    {livePreview.goodCount > 0 && (
                      <span className="text-amber-600">{livePreview.goodCount} good</span>
                    )}
                    {' matches identified'}
                  </p>
                </div>
                {/* Early exit button in preview */}
                {earlyExitStatus.eligible && !earlyExitDismissed && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowEarlyExitPrompt(true)}
                    className="shrink-0 text-green-600 border-green-500/30 hover:bg-green-500/10"
                  >
                    See Results
                  </Button>
                )}
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
                    You&apos;ve answered all {totalQuestions} questions!
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
