export type QuestionType = 'multiple-choice' | 'slider' | 'yes-no'

export interface QuizQuestion {
  id: string
  question: string
  type: QuestionType
  options?: { value: string; label: string; weights: Record<string, number> }[]
  minLabel?: string
  maxLabel?: string
  category: 'work-style' | 'stress' | 'learning' | 'technical' | 'values'
}

export interface QuizAnswer {
  questionId: string
  answer: string | number
}

export interface QuizResult {
  roleId: string
  matchScore: number
  reasons: string[]
}

// Quiz questions with weighted scoring
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What excites you most about working in tech?',
    type: 'multiple-choice',
    category: 'work-style',
    options: [
      {
        value: 'visual',
        label: 'Building things people can see and interact with',
        weights: {
          'frontend-engineer-developer': 3,
          'ux-ui-designer': 3,
          'mobile-developer': 2,
          'game-developer': 2,
          'ar-vr-developer': 2,
        },
      },
      {
        value: 'data',
        label: 'Analyzing data to find patterns and insights',
        weights: {
          'data-scientist': 3,
          'data-analyst': 3,
          'machine-learning-engineer': 2,
          'ai-engineer': 2,
          'business-analyst-technical': 2,
        },
      },
      {
        value: 'systems',
        label: 'Building robust, scalable backend systems',
        weights: {
          'backend-engineer-developer': 3,
          'devops-engineer': 2,
          'site-reliability-engineer': 2,
          'cloud-engineer-architect': 2,
          'platform-engineer': 2,
        },
      },
      {
        value: 'security',
        label: 'Finding vulnerabilities and protecting systems',
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
    question: 'How do you feel about working with visual design and aesthetics?',
    type: 'multiple-choice',
    category: 'work-style',
    options: [
      {
        value: 'love',
        label: 'I love it - design and UX are fascinating',
        weights: {
          'frontend-engineer-developer': 3,
          'ux-ui-designer': 3,
          'mobile-developer': 2,
          'game-developer': 2,
        },
      },
      {
        value: 'appreciate',
        label: 'I appreciate good design but prefer building logic',
        weights: {
          'full-stack-engineer-developer': 2,
          'product-manager-technical': 2,
          'software-engineer-general': 2,
        },
      },
      {
        value: 'neutral',
        label: "I'm neutral - I focus more on functionality",
        weights: {
          'backend-engineer-developer': 2,
          'data-engineer': 2,
          'devops-engineer': 2,
        },
      },
      {
        value: 'avoid',
        label: "I prefer to avoid design work entirely",
        weights: {
          'data-scientist': 2,
          'machine-learning-engineer': 2,
          'infrastructure-it-engineer': 2,
          'security-engineer': 2,
        },
      },
    ],
  },
  {
    id: 'q3',
    question: 'How comfortable are you with mathematics and statistics?',
    type: 'multiple-choice',
    category: 'technical',
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
    options: [
      {
        value: 'thrive',
        label: 'I thrive under pressure - it motivates me',
        weights: {
          'site-reliability-engineer': 3,
          'devops-engineer': 2,
          'penetration-tester': 2,
          'startup-founder': 3,
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
    options: [
      {
        value: 'team',
        label: 'I love collaborating with teams',
        weights: {
          'product-manager-technical': 3,
          'technical-program-manager': 3,
          'developer-advocate': 2,
          'full-stack-engineer-developer': 2,
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
    options: [
      {
        value: 'love',
        label: 'I love it - tech evolution excites me',
        weights: {
          'frontend-engineer-developer': 3,
          'devops-engineer': 2,
          'ai-engineer': 2,
          'blockchain-developer': 2,
          'ar-vr-developer': 2,
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
        label: 'I prefer roles with minimal tech churn',
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
    options: [
      {
        value: 'user',
        label: 'Direct user impact - I want people to use what I build',
        weights: {
          'frontend-engineer-developer': 3,
          'mobile-developer': 3,
          'product-manager-technical': 2,
          'ux-ui-designer': 3,
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
        },
      },
    ],
  },
  {
    id: 'q9',
    question: 'How important is salary/compensation in your career decision?',
    type: 'multiple-choice',
    category: 'values',
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
          'game-developer': 2,
        },
      },
    ],
  },
  {
    id: 'q10',
    question: 'Do you enjoy communicating and presenting to others?',
    type: 'multiple-choice',
    category: 'work-style',
    options: [
      {
        value: 'love',
        label: 'Yes! I love presenting and public speaking',
        weights: {
          'developer-advocate': 3,
          'product-manager-technical': 3,
          'technical-program-manager': 2,
          'sales-engineer': 3,
        },
      },
      {
        value: 'comfortable',
        label: 'Comfortable when needed, not my focus',
        weights: {
          'solution-architect': 2,
          'business-analyst-technical': 2,
          'ux-researcher': 2,
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
    question: 'What kind of problems do you enjoy solving?',
    type: 'multiple-choice',
    category: 'technical',
    options: [
      {
        value: 'creative',
        label: 'Creative problems - design, UX, visual solutions',
        weights: {
          'frontend-engineer-developer': 3,
          'ux-ui-designer': 3,
          'game-developer': 3,
          'ar-vr-developer': 2,
        },
      },
      {
        value: 'analytical',
        label: 'Analytical problems - data, patterns, optimization',
        weights: {
          'data-scientist': 3,
          'data-analyst': 3,
          'machine-learning-engineer': 3,
        },
      },
      {
        value: 'systems',
        label: 'Systems problems - architecture, scalability, reliability',
        weights: {
          'backend-engineer-developer': 3,
          'devops-engineer': 3,
          'site-reliability-engineer': 3,
          'cloud-engineer-architect': 3,
        },
      },
      {
        value: 'security',
        label: 'Security problems - vulnerabilities, protection',
        weights: {
          'cybersecurity-analyst': 3,
          'security-engineer': 3,
          'penetration-tester': 3,
        },
      },
    ],
  },
]

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
  const maxPossibleScore = quizQuestions.length * 3 // Max weight of 3 per question
  const results: QuizResult[] = Object.entries(roleScores)
    .map(([roleId, score]) => ({
      roleId,
      matchScore: Math.round((score / maxPossibleScore) * 100),
      reasons: roleReasons[roleId]?.slice(0, 3) || [],
    }))
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
