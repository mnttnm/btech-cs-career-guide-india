export type QuestionType = 'multiple-choice' | 'slider' | 'yes-no'

// Question tiers for ordering and gating
export type QuestionTier = 'direction' | 'cognitive' | 'work-style' | 'values' | 'future'

export interface QuizOption {
  value: string
  label: string
  weights: Record<string, number>
}

export interface QuizQuestion {
  id: string
  question: string
  type: QuestionType
  options?: QuizOption[]
  minLabel?: string
  maxLabel?: string
  category: 'work-style' | 'stress' | 'learning' | 'technical' | 'values'
  tier: QuestionTier
  dependsOn?: {
    questionId: string
    skipIf: string[] // Skip this question if answer is one of these
  }
}

export interface QuizAnswer {
  questionId: string
  answer: string | number
}

// Legacy result type for backwards compatibility
export interface QuizResult {
  roleId: string
  matchScore: number
  reasons: string[]
}

// New tiered result structure
export type MatchTier = 'strong' | 'good' | 'possible'

export interface TieredResult {
  roleId: string
  tier: MatchTier
  signalStrength: number // Internal score (0-100)
  answeredQuestions: number // How many Q's touched this role
  keyReasons: string[]
}

export interface TieredQuizResults {
  strongMatches: TieredResult[]
  goodMatches: TieredResult[]
  possibleMatches: TieredResult[]
  totalAnswered: number
}

// Quiz questions with weighted scoring
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which part of working with technology sounds most interesting to you?',
    type: 'multiple-choice',
    category: 'work-style',
    tier: 'direction',
    options: [
      {
        value: 'visual',
        label: 'Designing how websites or apps look and feel',
        weights: {
          'frontend-engineer-developer': 3,
          'ux-ui-designer': 3,
          'mobile-developer': 2,
          'game-developer': 2,
          'ar-vr-developer': 2,
          'developer-advocate': 2,
        },
      },
      {
        value: 'data',
        label: 'Working with data and numbers to find patterns',
        weights: {
          'data-scientist': 3,
          'data-analyst': 3,
          'machine-learning-engineer': 2,
          'ai-engineer': 2,
          'business-analyst-technical': 2,
          'data-engineer': 3,
        },
      },
      {
        value: 'systems',
        label: 'Building the behind-the-scenes systems that power apps',
        weights: {
          'backend-engineer-developer': 3,
          'devops-engineer': 2,
          'site-reliability-engineer': 2,
          'cloud-engineer-architect': 2,
          'platform-engineer': 2,
          'startup-founder': 2,
          'solution-architect': 2,
          'sales-engineer': 2,
          'blockchain-developer': 2,
          'developer-advocate': 2,
        },
      },
      {
        value: 'security',
        label: 'Keeping systems and data safe from attacks',
        weights: {
          'cybersecurity-analyst': 3,
          'security-engineer': 3,
          'penetration-tester': 3,
        },
      },
    ],
  },
  {
    id: 'q2',
    question: 'What kind of career path appeals to you most right now?',
    type: 'multiple-choice',
    category: 'values',
    tier: 'direction',
    options: [
      {
        value: 'standard',
        label: 'Building and maintaining software that powers everyday applications',
        weights: {
          'frontend-engineer-developer': 2,
          'backend-engineer-developer': 2,
          'full-stack-engineer-developer': 2,
          'data-scientist': 2,
          'software-engineer-general': 2,
        },
      },
      {
        value: 'specialized',
        label: 'Working on cutting-edge technologies that feel like the future',
        weights: {
          'blockchain-developer': 3,
          'ai-engineer': 3,
          'ar-vr-developer': 3,
          'security-engineer': 2,
          'quantum-computing-engineer': 3,
        },
      },
      {
        value: 'hybrid',
        label: 'Combining technical skills with communication, strategy, or working closely with people',
        weights: {
          'product-manager-technical': 3,
          'technical-program-manager': 3,
          'sales-engineer': 3,
          'developer-advocate': 3,
          'solution-architect': 2,
        },
      },
      {
        value: 'unconventional',
        label: 'Charting my own course with flexibility and independence',
        weights: {
          'startup-founder': 3,
          'freelancer': 3,
          'technical-writer': 3,
          'research-scientist-industry': 3,
        },
      },
    ],
  },
  {
    id: 'q3',
    question: 'How comfortable are you with mathematics and statistics?',
    type: 'multiple-choice',
    category: 'technical',
    tier: 'cognitive',
    // Skip this question if user selected hybrid (business-focused) career path
    dependsOn: {
      questionId: 'q2',
      skipIf: ['hybrid'],
    },
    options: [
      {
        value: 'expert',
        label: 'Very comfortable - I enjoy complex math',
        weights: {
          'data-scientist': 3,
          'machine-learning-engineer': 3,
          'ai-engineer': 3,
          'quantum-computing-engineer': 3,
          'research-scientist-industry': 3,
        },
      },
      {
        value: 'good',
        label: 'Good with basic stats and logic',
        weights: {
          'data-analyst': 2,
          'backend-engineer-developer': 2,
          'software-engineer-general': 2,
          'data-engineer': 2,
        },
      },
      {
        value: 'minimal',
        label: 'I prefer minimal math in my work',
        weights: {
          'frontend-engineer-developer': 2,
          'ux-ui-designer': 2,
          'technical-writer': 2,
          'developer-advocate': 2,
        },
      },
      {
        value: 'avoid',
        label: 'I actively avoid math-heavy roles',
        weights: {
          'product-manager-technical': 1,
          'qa-engineer-sdet': 1,
          'growth-hacker': 1,
        },
      },
    ],
  },
  {
    id: 'q4',
    question: 'How do you handle high-pressure situations and urgent deadlines?',
    type: 'multiple-choice',
    category: 'stress',
    tier: 'work-style',
    options: [
      {
        value: 'thrive',
        label: 'I thrive under pressure - it motivates me',
        weights: {
          'site-reliability-engineer': 3,
          'devops-engineer': 2,
          'penetration-tester': 2,
          'startup-founder': 3,
          'game-developer': 2,
        },
      },
      {
        value: 'handle',
        label: 'I can handle it but prefer steady pace',
        weights: {
          'backend-engineer-developer': 2,
          'software-engineer-general': 2,
          'full-stack-engineer-developer': 2,
        },
      },
      {
        value: 'prefer-calm',
        label: 'I prefer calm, predictable work environments',
        weights: {
          'data-analyst': 2,
          'technical-writer': 3,
          'ux-researcher': 2,
          'academic-researcher': 3,
        },
      },
      {
        value: 'avoid',
        label: 'I actively avoid high-stress situations',
        weights: {
          'qa-engineer-sdet': 2,
          'freelancer': 1,
        },
      },
    ],
  },
  {
    id: 'q5',
    question: 'Do you prefer working independently or in teams?',
    type: 'multiple-choice',
    category: 'work-style',
    tier: 'work-style',
    options: [
      {
        value: 'team',
        label: 'I love collaborating with teams',
        weights: {
          'product-manager-technical': 2,
          'technical-program-manager': 2,
          'developer-advocate': 2,
          'full-stack-engineer-developer': 2,
          'sales-engineer': 3,
          'solution-architect': 3,
        },
      },
      {
        value: 'balanced',
        label: 'Mix of both - teamwork with focused solo time',
        weights: {
          'software-engineer-general': 2,
          'frontend-engineer-developer': 2,
          'backend-engineer-developer': 2,
          'data-scientist': 2,
        },
      },
      {
        value: 'independent',
        label: 'I prefer working independently most of the time',
        weights: {
          'research-scientist-industry': 2,
          'data-analyst': 2,
          'security-engineer': 2,
          'freelancer': 3,
        },
      },
      {
        value: 'solo',
        label: 'I strongly prefer solo work',
        weights: {
          'freelancer': 3,
          'open-source-maintainer': 2,
          'academic-researcher': 2,
        },
      },
    ],
  },
  {
    id: 'q6',
    question: 'How important is work-life balance to you?',
    type: 'multiple-choice',
    category: 'values',
    tier: 'values',
    options: [
      {
        value: 'critical',
        label: 'Critical - I need clear boundaries',
        weights: {
          'data-analyst': 2,
          'technical-writer': 3,
          'qa-engineer-sdet': 2,
          'frontend-engineer-developer': 2,
        },
      },
      {
        value: 'important',
        label: 'Important but flexible when needed',
        weights: {
          'software-engineer-general': 2,
          'product-manager-technical': 2,
          'ux-ui-designer': 2,
        },
      },
      {
        value: 'flexible',
        label: "Flexible - I don't mind occasional long hours",
        weights: {
          'devops-engineer': 2,
          'backend-engineer-developer': 2,
          'startup-founder': 1,
        },
      },
      {
        value: 'secondary',
        label: 'Career growth matters more right now',
        weights: {
          'startup-founder': 3,
          'machine-learning-engineer': 2,
          'site-reliability-engineer': 2,
        },
      },
    ],
  },
  {
    id: 'q7',
    question: 'How do you feel about continuously learning new technologies?',
    type: 'multiple-choice',
    category: 'learning',
    tier: 'future',
    options: [
      {
        value: 'love',
        label: 'I love it - tech evolution excites me',
        weights: {
          'frontend-engineer-developer': 3,
          'devops-engineer': 2,
          'ai-engineer': 2,
          'ar-vr-developer': 1,
        },
      },
      {
        value: 'comfortable',
        label: 'Comfortable with steady learning pace',
        weights: {
          'backend-engineer-developer': 2,
          'software-engineer-general': 2,
          'data-engineer': 2,
        },
      },
      {
        value: 'selective',
        label: 'I prefer to master a few stable technologies',
        weights: {
          'embedded-systems-engineer': 2,
          'security-engineer': 2,
          'solution-architect': 2,
        },
      },
      {
        value: 'minimal',
        label: "I prefer roles where tools and technologies don't change often",
        weights: {
          'business-analyst-technical': 2,
          'technical-writer': 2,
          'sales-engineer': 2,
        },
      },
    ],
  },
  {
    id: 'q8',
    question: 'What type of impact do you want your work to have?',
    type: 'multiple-choice',
    category: 'values',
    tier: 'values',
    options: [
      {
        value: 'user',
        label: 'Direct user impact - I want people to use what I build',
        weights: {
          'frontend-engineer-developer': 3,
          'mobile-developer': 3,
          'product-manager-technical': 2,
          'ux-ui-designer': 3,
          'developer-advocate': 2,
        },
      },
      {
        value: 'business',
        label: 'Business impact - driving decisions and strategy',
        weights: {
          'data-scientist': 2,
          'data-analyst': 2,
          'business-analyst-technical': 3,
          'growth-hacker': 3,
          'startup-founder': 3,
          'sales-engineer': 3,
          'solution-architect': 2,
        },
      },
      {
        value: 'technical',
        label: 'Technical impact - building robust infrastructure',
        weights: {
          'backend-engineer-developer': 2,
          'devops-engineer': 3,
          'site-reliability-engineer': 3,
          'platform-engineer': 2,
          'solution-architect': 2,
        },
      },
      {
        value: 'innovation',
        label: 'Innovation - pushing boundaries of technology',
        weights: {
          'ai-engineer': 3,
          'machine-learning-engineer': 3,
          'research-scientist-industry': 3,
          'quantum-computing-engineer': 3,
          'startup-founder': 2,
        },
      },
    ],
  },
  {
    id: 'q9',
    question: 'How important is salary/compensation in your career decision?',
    type: 'multiple-choice',
    category: 'values',
    tier: 'values',
    options: [
      {
        value: 'top',
        label: 'Very important - I want maximum earning potential',
        weights: {
          'machine-learning-engineer': 2,
          'ai-engineer': 2,
          'solution-architect': 2,
          'startup-founder': 1,
        },
      },
      {
        value: 'important',
        label: 'Important but not the only factor',
        weights: {
          'software-engineer-general': 2,
          'backend-engineer-developer': 2,
          'data-scientist': 2,
        },
      },
      {
        value: 'balanced',
        label: 'Balanced with job satisfaction and growth',
        weights: {
          'frontend-engineer-developer': 2,
          'product-manager-technical': 2,
          'ux-ui-designer': 2,
        },
      },
      {
        value: 'secondary',
        label: 'Secondary - passion and interest matter more',
        weights: {
          'developer-advocate': 2,
          'open-source-maintainer': 3,
          'academic-researcher': 2,
          'game-developer': 1,
        },
      },
    ],
  },
  {
    id: 'q10',
    question: 'Do you enjoy communicating and presenting to others?',
    type: 'multiple-choice',
    category: 'work-style',
    tier: 'work-style',
    options: [
      {
        value: 'love',
        label: 'Yes! I love presenting and public speaking',
        weights: {
          'developer-advocate': 3,
          'product-manager-technical': 3,
          'technical-program-manager': 2,
          'sales-engineer': 3,
          'growth-hacker': 3,
          'startup-founder': 2,
        },
      },
      {
        value: 'comfortable',
        label: 'Comfortable when needed, not my focus',
        weights: {
          'solution-architect': 2,
          'business-analyst-technical': 2,
          'ux-researcher': 2,
          'startup-founder': 2,
        },
      },
      {
        value: 'prefer-writing',
        label: 'I prefer written communication',
        weights: {
          'technical-writer': 3,
          'data-analyst': 2,
          'backend-engineer-developer': 2,
        },
      },
      {
        value: 'avoid',
        label: 'I prefer to minimize presentations',
        weights: {
          'data-engineer': 2,
          'devops-engineer': 2,
          'security-engineer': 2,
          'embedded-systems-engineer': 2,
        },
      },
    ],
  },
  {
    id: 'q11',
    question: 'Are you interested in management/leadership roles?',
    type: 'multiple-choice',
    category: 'values',
    tier: 'future',
    options: [
      {
        value: 'yes',
        label: 'Yes - I want to lead teams eventually',
        weights: {
          'product-manager-technical': 3,
          'technical-program-manager': 3,
          'startup-founder': 3,
          'solution-architect': 2,
        },
      },
      {
        value: 'maybe',
        label: 'Maybe later in my career',
        weights: {
          'software-engineer-general': 2,
          'backend-engineer-developer': 2,
          'frontend-engineer-developer': 2,
        },
      },
      {
        value: 'technical',
        label: 'I prefer staying on the technical track',
        weights: {
          'data-scientist': 2,
          'machine-learning-engineer': 2,
          'research-scientist-industry': 3,
        },
      },
      {
        value: 'no',
        label: 'Not interested in management',
        weights: {
          'freelancer': 2,
          'open-source-maintainer': 2,
          'academic-researcher': 2,
        },
      },
    ],
  },
  {
    id: 'q12',
    question: 'When you work on a problem, what style of thinking feels most natural?',
    type: 'multiple-choice',
    category: 'technical',
    tier: 'cognitive',
    options: [
      {
        value: 'creative',
        label: 'Coming up with creative ideas, layouts or experiences people use',
        weights: {
          'frontend-engineer-developer': 3,
          'ux-ui-designer': 3,
          'game-developer': 3,
          'ar-vr-developer': 2,
          'startup-founder': 2,
          'developer-advocate': 2,
        },
      },
      {
        value: 'analytical',
        label: 'Digging into numbers and patterns to understand what is happening',
        weights: {
          'data-scientist': 3,
          'data-analyst': 3,
          'machine-learning-engineer': 3,
          'data-engineer': 2,
        },
      },
      {
        value: 'systems',
        label: 'Figuring out how all the parts of a system should work together reliably',
        weights: {
          'backend-engineer-developer': 3,
          'devops-engineer': 3,
          'site-reliability-engineer': 3,
          'cloud-engineer-architect': 3,
          'startup-founder': 2,
          'solution-architect': 3,
          'data-engineer': 3,
        },
      },
      {
        value: 'security',
        label: 'Thinking like an attacker to find weak spots and keep things safe',
        weights: {
          'cybersecurity-analyst': 3,
          'security-engineer': 3,
          'penetration-tester': 3,
        },
      },
    ],
  },
]

// Pre-compute per-role stats used for scoring and confidence
const roleStats = (() => {
  const maxScores: Record<string, number> = {}
  const coverageCounts: Record<string, number> = {}

  quizQuestions.forEach((question) => {
    if (question.type !== 'multiple-choice' || !question.options) return

    const perQuestionMax: Record<string, number> = {}
    const rolesInQuestion = new Set<string>()

    question.options.forEach((option) => {
      Object.entries(option.weights).forEach(([roleId, weight]) => {
        if (weight > 0) {
          perQuestionMax[roleId] = Math.max(perQuestionMax[roleId] ?? 0, weight)
          rolesInQuestion.add(roleId)
        }
      })
    })

    Object.entries(perQuestionMax).forEach(([roleId, weight]) => {
      maxScores[roleId] = (maxScores[roleId] ?? 0) + weight
    })

    rolesInQuestion.forEach((roleId) => {
      coverageCounts[roleId] = (coverageCounts[roleId] ?? 0) + 1
    })
  })

  return {
    roleMaxScores: maxScores,
    roleCoverageCounts: coverageCounts,
  }
})()

const roleMaxScores = roleStats.roleMaxScores
const roleCoverageCounts = roleStats.roleCoverageCounts

// Calculate quiz results
export function calculateQuizResults(answers: QuizAnswer[]): QuizResult[] {
  const roleScores: Record<string, number> = {}
  const roleReasons: Record<string, string[]> = {}

  // Calculate scores based on answers
  answers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId)
    if (!question || question.type !== 'multiple-choice') return

    const selectedOption = question.options?.find((o) => o.value === answer.answer)
    if (!selectedOption) return

    // Add weights to role scores
    Object.entries(selectedOption.weights).forEach(([roleId, weight]) => {
      roleScores[roleId] = (roleScores[roleId] || 0) + weight

      // Track reasons for high weights
      if (weight >= 2) {
        if (!roleReasons[roleId]) roleReasons[roleId] = []
        // Add reason based on question category
        const reason = getReasonFromAnswer(question, selectedOption.label)
        if (reason && !roleReasons[roleId].includes(reason)) {
          roleReasons[roleId].push(reason)
        }
      }
    })
  })

  // Convert to results array and sort by score
  const results: QuizResult[] = Object.entries(roleScores)
    .map(([roleId, score]) => {
      const maxPossibleScore = roleMaxScores[roleId] || 1
      const normalized = score / maxPossibleScore

      const coverageCount = roleCoverageCounts[roleId] ?? 0
      const coverageFraction = Math.min(1, coverageCount / quizQuestions.length)
      const confidence = 0.8 + 0.2 * coverageFraction // 0.8–1.0 based on how many questions touch this role

      const rawPercent = normalized * 100 * confidence
      const matchScore = Math.min(95, Math.round(rawPercent))

      return {
        roleId,
        matchScore,
        reasons: roleReasons[roleId]?.slice(0, 3) || [],
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5) // Top 5 matches

  return results
}

function getReasonFromAnswer(question: QuizQuestion, answerLabel: string): string {
  const categoryReasons: Record<string, string> = {
    'work-style': `Your preference for ${answerLabel.toLowerCase().slice(0, 50)}...`,
    technical: `Your technical interest in ${answerLabel.toLowerCase().slice(0, 50)}...`,
    values: `Your values around ${answerLabel.toLowerCase().slice(0, 50)}...`,
    stress: `Your comfort with ${answerLabel.toLowerCase().slice(0, 50)}...`,
    learning: `Your approach to ${answerLabel.toLowerCase().slice(0, 50)}...`,
  }
  return categoryReasons[question.category] || ''
}

// Question order for the quiz flow
export const QUESTION_ORDER = [
  // 1. High-level Career Direction (The "North Star")
  'q2', // Broad career path shape
  'q1', // Domain interest
  'q8', // Impact type
  // 2. Cognitive & Hard Skills (The "Toolbox")
  'q12', // Natural thinking style
  'q3', // Math/Stats comfort (conditional)
  'q7', // Continuous learning
  // 3. Work Style & Personality (The "Environment")
  'q5', // Team vs Independent
  'q10', // Communication comfort
  'q4', // Handling pressure
  // 4. Practical Constraints & Future (The "Guardrails")
  'q6', // Work-life balance
  'q9', // Salary importance
  'q11', // Leadership interest
] as const

/**
 * Check if a question should be shown based on previous answers (gating logic)
 */
export function shouldShowQuestion(questionId: string, answers: QuizAnswer[]): boolean {
  const question = quizQuestions.find((q) => q.id === questionId)
  if (!question) return false

  // If no dependencies, always show
  if (!question.dependsOn) return true

  // Find the answer to the dependent question
  const dependentAnswer = answers.find((a) => a.questionId === question.dependsOn!.questionId)

  // If dependent question not answered yet, show this question
  if (!dependentAnswer) return true

  // Skip if answer matches any of the skipIf values
  const shouldSkip = question.dependsOn.skipIf.includes(String(dependentAnswer.answer))
  return !shouldSkip
}

/**
 * Get the list of active questions based on current answers (filters out gated questions)
 */
export function getActiveQuestions(answers: QuizAnswer[]): QuizQuestion[] {
  return QUESTION_ORDER
    .filter((id) => shouldShowQuestion(id, answers))
    .map((id) => quizQuestions.find((q) => q.id === id))
    .filter((q): q is QuizQuestion => q !== undefined)
}

/**
 * Check if early exit is available (minimum questions answered with strong matches)
 */
export function canShowEarlyResults(answers: QuizAnswer[]): {
  eligible: boolean
  strongMatchCount: number
} {
  // Filter out 'start' marker
  const actualAnswers = answers.filter((a) => a.questionId !== 'start')

  // Need at least 5 questions answered
  if (actualAnswers.length < 5) {
    return { eligible: false, strongMatchCount: 0 }
  }

  // Calculate current tiered results
  const results = calculateTieredResults(actualAnswers)

  // Need at least 2 strong matches for early exit
  const strongMatchCount = results.strongMatches.length
  return {
    eligible: strongMatchCount >= 2,
    strongMatchCount,
  }
}

/**
 * Calculate tiered quiz results with Strong/Good/Possible groupings
 */
export function calculateTieredResults(answers: QuizAnswer[]): TieredQuizResults {
  const roleScores: Record<string, number> = {}
  const roleQuestionCount: Record<string, number> = {}
  const roleReasons: Record<string, string[]> = {}

  // Filter out 'start' marker
  const actualAnswers = answers.filter((a) => a.questionId !== 'start')

  // Calculate scores based on answers
  actualAnswers.forEach((answer) => {
    const question = quizQuestions.find((q) => q.id === answer.questionId)
    if (!question || question.type !== 'multiple-choice') return

    const selectedOption = question.options?.find((o) => o.value === answer.answer)
    if (!selectedOption) return

    // Add weights to role scores and track question coverage
    Object.entries(selectedOption.weights).forEach(([roleId, weight]) => {
      roleScores[roleId] = (roleScores[roleId] || 0) + weight
      roleQuestionCount[roleId] = (roleQuestionCount[roleId] || 0) + 1

      // Track reasons for high weights
      if (weight >= 2) {
        if (!roleReasons[roleId]) roleReasons[roleId] = []
        const reason = getReasonFromAnswer(question, selectedOption.label)
        if (reason && !roleReasons[roleId].includes(reason)) {
          roleReasons[roleId].push(reason)
        }
      }
    })
  })

  // Convert to results and categorize into tiers
  const allResults: TieredResult[] = Object.entries(roleScores)
    .map(([roleId, score]) => {
      const maxPossibleScore = roleMaxScores[roleId] || 1
      const normalizedScore = (score / maxPossibleScore) * 100
      const questionsTouched = roleQuestionCount[roleId] || 0

      // Determine tier based on score and question coverage
      let tier: MatchTier
      if (normalizedScore >= 70 && questionsTouched >= 6) {
        tier = 'strong'
      } else if (normalizedScore >= 50 && questionsTouched >= 4) {
        tier = 'good'
      } else if (normalizedScore >= 30) {
        tier = 'possible'
      } else {
        // Below threshold, won't be included
        tier = 'possible'
      }

      return {
        roleId,
        tier,
        signalStrength: Math.round(normalizedScore),
        answeredQuestions: questionsTouched,
        keyReasons: roleReasons[roleId]?.slice(0, 3) || [],
      }
    })
    .filter((r) => r.signalStrength >= 30) // Only include results above threshold
    .sort((a, b) => b.signalStrength - a.signalStrength)

  // Group by tier
  const strongMatches = allResults.filter((r) => r.tier === 'strong')
  const goodMatches = allResults.filter((r) => r.tier === 'good')
  const possibleMatches = allResults.filter((r) => r.tier === 'possible')

  return {
    strongMatches,
    goodMatches,
    possibleMatches,
    totalAnswered: actualAnswers.length,
  }
}
