# Data Schema

> **TypeScript interfaces and JSON structure for role data**

---

## Role Data Structure

### Complete TypeScript Interface

```typescript
// types/role.ts

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Hard'
export type StressLevel = 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type SkillPriority = 'Primary' | 'Secondary' | 'Nice-to-have'

export interface SalaryRange {
  min: number  // in LPA (Lakhs Per Annum)
  max: number
  currency?: string  // default: 'INR'
}

export interface Skill {
  name: string
  level: SkillLevel
  priority: SkillPriority
}

export interface Framework {
  name: string
  popularity: 'High' | 'Medium' | 'Low'
}

export interface CareerLevel {
  level: string  // e.g., 'Entry Level', 'Mid Level', 'Senior Level'
  years: string  // e.g., '0-2', '3-6', '7-10'
  title: string  // e.g., 'Junior Frontend Developer'
  salary: SalaryRange
}

export interface CareerTrack {
  leadership: string[]
  individualContributor: string[]
}

export interface SalaryBreakdown {
  serviceBased: SalaryRange
  productBased: SalaryRange
  topTech?: SalaryRange
  average: SalaryRange
}

export interface TopCompany {
  name: string
  range: SalaryRange
}

export interface YearGoals {
  year: number
  title: string  // e.g., 'Foundation', 'Deepening'
  goals: string[]
}

export interface TechnicalPrep {
  skill: string
  goal: string
}

export interface ApplicationChannel {
  channel: string
  approach: string
}

export interface Role {
  // Basic Info
  roleId: string  // e.g., 'frontend-developer'
  roleName: string  // e.g., 'Frontend Developer'
  description: string
  category: 'software' | 'data' | 'cloud' | 'security' | 'product' | 'specialized'
  icon: string  // emoji or path to icon

  // Job Titles
  jobTitles: {
    fresher: string[]
    experienced: string[]
  }

  // Skills Required
  skills: {
    programmingLanguages: Skill[]
    coreConcepts: string[]
    frameworks: Framework[]
    tools: string[]
  }

  // Day to Day Work
  dailyWork: string[]

  // Career Progression
  careerProgression: {
    timeline: CareerLevel[]
    tracks: CareerTrack
    timelineToSenior: string
    alternativePaths: string[]
  }

  // Salary Breakdown
  salaryRanges: {
    fresher: SalaryBreakdown
    threeYears: SalaryBreakdown
    fivePlus: {
      midLevel: SalaryRange
      senior: SalaryRange
      topCompanies: SalaryRange
    }
    topCompanies: TopCompany[]
  }

  // Learning Curve
  learningCurve: {
    difficulty: DifficultyLevel
    timeToJobReady: string  // e.g., '6-12 months'
    description: string
  }

  // Stress Level
  stressLevel: {
    level: StressLevel
    factors: string[]
    mitigatingFactors: string[]
  }

  // Personality Fit
  personalityFit: {
    thriveIf: string[]
    avoidIf: string[]
  }

  // College Strategy (Year by Year)
  collegeStrategy: YearGoals[]

  // First Job Strategy
  firstJobStrategy: {
    technicalPrep: TechnicalPrep[]
    applicationStrategy: ApplicationChannel[]
    interviewPrep: string[]
    salaryExpectations: SalaryBreakdown
    differentiators: string[]
  }

  // Metadata
  metadata?: {
    lastUpdated: string  // ISO date
    dataSource: string[]
    popularity: number  // 1-10 scale
  }
}
```

---

## Example: Frontend Developer (Complete)

```json
{
  "roleId": "frontend-developer",
  "roleName": "Frontend Developer",
  "description": "Build user-facing web applications and beautiful interfaces that users interact with daily",
  "category": "software",
  "icon": "💻",

  "jobTitles": {
    "fresher": [
      "Junior Frontend Developer",
      "UI Developer",
      "Frontend Developer Trainee",
      "Associate Frontend Engineer"
    ],
    "experienced": [
      "Senior Frontend Developer",
      "Lead Frontend Engineer",
      "Frontend Architect",
      "Engineering Manager - Frontend"
    ]
  },

  "skills": {
    "programmingLanguages": [
      {
        "name": "JavaScript",
        "level": "Advanced",
        "priority": "Primary"
      },
      {
        "name": "TypeScript",
        "level": "Intermediate",
        "priority": "Primary"
      },
      {
        "name": "HTML/CSS",
        "level": "Advanced",
        "priority": "Primary"
      }
    ],
    "coreConcepts": [
      "DOM Manipulation",
      "Responsive Design",
      "Web Performance Optimization",
      "Browser APIs",
      "State Management",
      "Component Architecture"
    ],
    "frameworks": [
      { "name": "React", "popularity": "High" },
      { "name": "Next.js", "popularity": "High" },
      { "name": "Vue.js", "popularity": "Medium" },
      { "name": "Angular", "popularity": "Medium" }
    ],
    "tools": [
      "Git/GitHub",
      "VS Code",
      "Chrome DevTools",
      "Webpack/Vite",
      "Figma",
      "REST APIs"
    ]
  },

  "dailyWork": [
    "Build and maintain user interfaces using React/Vue/Angular",
    "Collaborate with designers to implement pixel-perfect designs",
    "Optimize application performance and loading times",
    "Write unit tests and conduct code reviews",
    "Debug cross-browser compatibility issues",
    "Participate in daily standups and sprint planning",
    "Learn new frontend technologies and best practices"
  ],

  "careerProgression": {
    "timeline": [
      {
        "level": "Entry Level",
        "years": "0-2",
        "title": "Junior Frontend Developer",
        "salary": { "min": 3, "max": 8 }
      },
      {
        "level": "Mid Level",
        "years": "3-6",
        "title": "Senior Frontend Developer",
        "salary": { "min": 8, "max": 18 }
      },
      {
        "level": "Senior Level",
        "years": "7-10",
        "title": "Lead Frontend Engineer / Frontend Architect",
        "salary": { "min": 18, "max": 40 }
      }
    ],
    "tracks": {
      "leadership": [
        "Senior Developer",
        "Tech Lead",
        "Engineering Manager",
        "Director of Engineering",
        "VP Engineering",
        "CTO"
      ],
      "individualContributor": [
        "Senior Developer",
        "Staff Engineer",
        "Principal Engineer",
        "Distinguished Engineer"
      ]
    },
    "timelineToSenior": "5-7 years with consistent learning and project experience",
    "alternativePaths": [
      "Full Stack Developer (learn backend)",
      "UI/UX Designer (design-focused)",
      "DevOps Engineer (infrastructure)",
      "Mobile Developer (React Native)"
    ]
  },

  "salaryRanges": {
    "fresher": {
      "serviceBased": { "min": 3, "max": 5 },
      "productBased": { "min": 6, "max": 12 },
      "topTech": { "min": 15, "max": 25 },
      "average": { "min": 4.5, "max": 8 }
    },
    "threeYears": {
      "serviceBased": { "min": 6, "max": 10 },
      "productBased": { "min": 10, "max": 18 },
      "average": { "min": 8, "max": 14 }
    },
    "fivePlus": {
      "midLevel": { "min": 12, "max": 20 },
      "senior": { "min": 18, "max": 35 },
      "topCompanies": { "min": 30, "max": 60 }
    },
    "topCompanies": [
      { "name": "Google", "range": { "min": 25, "max": 45 } },
      { "name": "Microsoft", "range": { "min": 22, "max": 40 } },
      { "name": "Amazon", "range": { "min": 20, "max": 38 } },
      { "name": "Flipkart", "range": { "min": 18, "max": 35 } }
    ]
  },

  "learningCurve": {
    "difficulty": "Moderate",
    "timeToJobReady": "6-12 months",
    "description": "Frontend development has a gentle initial learning curve with HTML/CSS, but steepens as you dive into modern frameworks, state management, and performance optimization. The ecosystem changes rapidly, requiring continuous learning."
  },

  "stressLevel": {
    "level": "Medium",
    "factors": [
      "Tight design deadlines and pixel-perfect requirements",
      "Browser compatibility and device testing challenges",
      "Frequent framework updates and learning new tools",
      "Debugging complex UI bugs",
      "Balancing aesthetics with performance"
    ],
    "mitigatingFactors": [
      "Visual feedback makes debugging more intuitive",
      "Large community support and resources",
      "Flexible remote work opportunities",
      "Clear separation between work and personal time",
      "Immediate gratification from seeing your work live"
    ]
  },

  "personalityFit": {
    "thriveIf": [
      "You enjoy visual, creative problem-solving",
      "You have an eye for design and user experience",
      "You like seeing immediate results of your work",
      "You're comfortable with constant learning and change",
      "You enjoy collaborating with designers and product teams",
      "You care about how things look and feel",
      "You like building things people interact with daily"
    ],
    "avoidIf": [
      "You prefer working on deep algorithmic problems",
      "You find UI/UX details tedious or unimportant",
      "You dislike dealing with browser quirks and compatibility",
      "You want a slowly-evolving tech stack",
      "You prefer working in isolation without design feedback",
      "You're frustrated by subjective design feedback"
    ]
  },

  "collegeStrategy": [
    {
      "year": 1,
      "title": "Foundation",
      "goals": [
        "Master HTML, CSS, and JavaScript fundamentals",
        "Build 3-5 simple static websites (portfolio, clone sites)",
        "Learn Git and GitHub basics",
        "Join coding clubs and attend frontend workshops",
        "Start following frontend developers on Twitter/YouTube"
      ]
    },
    {
      "year": 2,
      "title": "Deepening",
      "goals": [
        "Learn React or Vue.js framework",
        "Build 2-3 dynamic web apps with API integration",
        "Participate in hackathons (focus on UI quality)",
        "Contribute to open source frontend projects",
        "Learn responsive design and CSS frameworks (Tailwind)",
        "Start a technical blog about your learnings"
      ]
    },
    {
      "year": 3,
      "title": "Specialization",
      "goals": [
        "Master one framework deeply (React + Next.js or Vue + Nuxt)",
        "Secure a frontend development internship",
        "Build a polished portfolio website showcasing 5+ projects",
        "Learn TypeScript, testing, and performance optimization",
        "Practice interview questions on JavaScript and React",
        "Network with frontend developers on LinkedIn"
      ]
    },
    {
      "year": 4,
      "title": "Job Hunt",
      "goals": [
        "Complete 1-2 production-quality capstone projects",
        "Polish resume with quantified achievements",
        "Apply to 50+ companies (campus + off-campus)",
        "Practice frontend interview questions daily",
        "Attend career fairs and recruitment drives",
        "Have backup offers before placement season ends"
      ]
    }
  ],

  "firstJobStrategy": {
    "technicalPrep": [
      {
        "skill": "JavaScript/React",
        "goal": "Build 3 complex projects with advanced React patterns (hooks, context, custom hooks)"
      },
      {
        "skill": "Data Structures & Algorithms",
        "goal": "Solve 100+ LeetCode Easy/Medium problems"
      },
      {
        "skill": "Projects",
        "goal": "3-5 portfolio projects: 1 full-stack, 1 with real API, 1 complex UI"
      },
      {
        "skill": "Resume",
        "goal": "1-page, ATS-friendly, quantified impact (e.g., 'Improved load time by 40%')"
      }
    ],
    "applicationStrategy": [
      {
        "channel": "Campus Placements",
        "approach": "Prioritize—easier process, batch hiring, better support"
      },
      {
        "channel": "Off-Campus",
        "approach": "Use AngelList, Instahyre, Naukri for startups and product companies"
      },
      {
        "channel": "Referrals",
        "approach": "Network on LinkedIn, cold email developers, attend meetups"
      },
      {
        "channel": "Startups",
        "approach": "Pros: faster growth, diverse work. Cons: lower initial pay, instability"
      }
    ],
    "interviewPrep": [
      "JavaScript fundamentals (closures, promises, async/await)",
      "React concepts (lifecycle, hooks, state management)",
      "CSS (flexbox, grid, positioning)",
      "Build a project live during interview (take-home assignments)",
      "Behavioral questions: teamwork, handling feedback, learning new tech"
    ],
    "salaryExpectations": {
      "serviceBased": { "min": 3, "max": 5 },
      "productBased": { "min": 6, "max": 12 },
      "topTech": { "min": 15, "max": 25 },
      "average": { "min": 4.5, "max": 8 }
    },
    "differentiators": [
      "Polished, responsive portfolio website",
      "Active GitHub with well-documented projects",
      "Technical blog showing deep understanding",
      "Open source contributions",
      "Hackathon wins or notable projects",
      "Strong fundamentals (can explain your code in detail)"
    ]
  },

  "metadata": {
    "lastUpdated": "2024-11-23",
    "dataSource": [
      "Glassdoor India",
      "PayScale India",
      "GeeksforGeeks",
      "AmbitionBox"
    ],
    "popularity": 9
  }
}
```

---

## File Structure

```
data/
├── roles.json                    # Array of all roles (metadata only)
└── roles/
    ├── frontend-developer.json   # Full data
    ├── backend-developer.json
    ├── data-analyst.json
    └── ...
```

### roles.json (Index File)
```json
[
  {
    "roleId": "frontend-developer",
    "roleName": "Frontend Developer",
    "category": "software",
    "icon": "💻",
    "difficulty": "Moderate",
    "averageSalary": { "min": 4.5, "max": 8 },
    "popularity": 9
  },
  {
    "roleId": "backend-developer",
    "roleName": "Backend Developer",
    "category": "software",
    "icon": "⚙️",
    "difficulty": "Moderate",
    "averageSalary": { "min": 4.5, "max": 7 },
    "popularity": 8
  }
  // ... more roles
]
```

---

## API Helpers

### Fetching Role Data

```typescript
// lib/api.ts
import { Role } from '@/types/role'

export async function getAllRoles(): Promise<Role[]> {
  const res = await fetch('/data/roles.json')
  if (!res.ok) throw new Error('Failed to fetch roles')
  return res.json()
}

export async function getRoleById(roleId: string): Promise<Role> {
  const res = await fetch(`/data/roles/${roleId}.json`)
  if (!res.ok) throw new Error(`Role not found: ${roleId}`)
  return res.json()
}

export async function getRolesByCategory(
  category: string
): Promise<Role[]> {
  const roles = await getAllRoles()
  return roles.filter((role) => role.category === category)
}

export async function searchRoles(query: string): Promise<Role[]> {
  const roles = await getAllRoles()
  const lowerQuery = query.toLowerCase()

  return roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(lowerQuery) ||
      role.description.toLowerCase().includes(lowerQuery) ||
      role.skills.programmingLanguages.some((lang) =>
        lang.name.toLowerCase().includes(lowerQuery)
      )
  )
}
```

---

## Quiz Data Structure

```typescript
// types/quiz.ts

export type QuestionType = 'multiple-choice' | 'slider' | 'yes-no'

export interface QuizQuestion {
  id: string
  question: string
  type: QuestionType
  options?: string[]  // For multiple-choice
  minLabel?: string  // For slider
  maxLabel?: string  // For slider
  category: 'work-style' | 'stress' | 'learning' | 'technical' | 'values'
}

export interface QuizAnswer {
  questionId: string
  answer: string | number
}

export interface QuizResult {
  roleId: string
  matchScore: number  // 0-100
  reasons: string[]
}

export interface Quiz {
  questions: QuizQuestion[]
}
```

### quiz/questions.json

```json
{
  "questions": [
    {
      "id": "q1",
      "question": "What excites you most about tech?",
      "type": "multiple-choice",
      "category": "work-style",
      "options": [
        "Building things people use daily",
        "Analyzing data to find insights",
        "Solving complex algorithmic problems",
        "Designing beautiful interfaces"
      ]
    },
    {
      "id": "q2",
      "question": "How much do you enjoy visual, creative work?",
      "type": "slider",
      "category": "work-style",
      "minLabel": "Not at all",
      "maxLabel": "Love it"
    },
    {
      "id": "q3",
      "question": "Are you comfortable with continuous learning and rapid tech changes?",
      "type": "yes-no",
      "category": "learning"
    }
  ]
}
```

---

## Roadmap Data Structure

```typescript
// types/roadmap.ts

export interface RoadmapGoal {
  id: string
  description: string
  completed: boolean
  resources?: string[]
}

export interface YearRoadmap {
  year: number
  title: string
  goals: RoadmapGoal[]
  progress: number  // 0-100
}

export interface UserRoadmap {
  roleId: string
  currentYear: number
  years: YearRoadmap[]
  lastUpdated: string
}
```

---

## Data Validation (Zod)

```typescript
// lib/schemas.ts
import { z } from 'zod'

export const SalaryRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
  currency: z.string().optional().default('INR'),
})

export const SkillSchema = z.object({
  name: z.string(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  priority: z.enum(['Primary', 'Secondary', 'Nice-to-have']),
})

export const RoleSchema = z.object({
  roleId: z.string(),
  roleName: z.string(),
  description: z.string(),
  category: z.enum(['software', 'data', 'cloud', 'security', 'product', 'specialized']),
  icon: z.string(),
  jobTitles: z.object({
    fresher: z.array(z.string()),
    experienced: z.array(z.string()),
  }),
  skills: z.object({
    programmingLanguages: z.array(SkillSchema),
    coreConcepts: z.array(z.string()),
    frameworks: z.array(z.object({
      name: z.string(),
      popularity: z.enum(['High', 'Medium', 'Low']),
    })),
    tools: z.array(z.string()),
  }),
  // ... rest of schema
})

// Usage
export function validateRole(data: unknown): Role {
  return RoleSchema.parse(data)
}
```

---

## Next.js API Routes (Optional)

If you need server-side logic:

```typescript
// app/api/roles/route.ts
import { NextResponse } from 'next/server'
import { getAllRoles } from '@/lib/api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    let roles = await getAllRoles()

    if (category) {
      roles = roles.filter((role) => role.category === category)
    }

    return NextResponse.json(roles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    )
  }
}
```

---

## Migration to Database (Phase 2)

### Supabase Schema

```sql
-- roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id TEXT UNIQUE NOT NULL,
  role_name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  icon TEXT,
  data JSONB NOT NULL,  -- Store all nested data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_roadmaps table
CREATE TABLE user_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role_id TEXT REFERENCES roles(role_id),
  current_year INTEGER,
  progress JSONB,  -- Store year-wise progress
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- user_favorites table
CREATE TABLE user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  role_id TEXT REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- quiz_results table
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  answers JSONB NOT NULL,
  results JSONB NOT NULL,  -- Top 3 role recommendations
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**Next:** See [Tech Stack](./tech-stack.md) for implementation details
