// Role data types based on the JSON schema

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Hard' | 'Steep'
export type StressLevel = 'Low' | 'Low-Medium' | 'Medium' | 'Medium-High' | 'High'
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type SkillPriority = 'Primary' | 'Secondary' | 'Nice-to-have'
export type Popularity = 'High' | 'Medium' | 'Low'

export type Category =
  | 'software'
  | 'data'
  | 'cloud'
  | 'security'
  | 'quality'
  | 'product'
  | 'consulting'
  | 'emerging'
  | 'hybrid'
  | 'content'
  | 'alternative'

export interface SalaryRange {
  min: number
  max: number
  currency?: string
}

export interface Skill {
  name: string
  level: SkillLevel
  priority: SkillPriority
}

export interface Framework {
  name: string
  popularity: Popularity
}

export interface CareerLevel {
  level: string
  years: string
  title: string
  salary: SalaryRange
}

export interface CareerTrack {
  leadership: string[]
  individualContributor: string[]
}

export interface SalaryBreakdown {
  serviceBased?: SalaryRange
  productBased?: SalaryRange
  topTech?: SalaryRange
  average?: SalaryRange
}

export interface TopCompany {
  name: string
  range: SalaryRange
}

export interface YearGoals {
  year: number
  title: string
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
  roleId: string
  roleName: string
  description: string
  category: Category
  icon: string

  jobTitles: {
    fresher: string[]
    experienced: string[]
  }

  skills: {
    programmingLanguages: Skill[]
    coreConcepts: string[]
    frameworks: Framework[]
    tools: string[]
  }

  dailyWork: string[]

  careerProgression: {
    timeline: CareerLevel[]
    tracks: CareerTrack
    timelineToSenior: string
    alternativePaths: string[]
  }

  salaryRanges: {
    fresher: SalaryBreakdown
    threeYears: SalaryBreakdown
    fivePlus: {
      midLevel?: SalaryRange
      senior?: SalaryRange
      topCompanies?: SalaryRange
    }
    topCompanies: TopCompany[]
  }

  learningCurve: {
    difficulty: DifficultyLevel
    timeToJobReady: string
    description: string
  }

  stressLevel: {
    level: StressLevel
    factors: string[]
    mitigatingFactors: string[]
  }

  personalityFit: {
    thriveIf: string[]
    avoidIf: string[]
  }

  collegeStrategy: YearGoals[]

  firstJobStrategy: {
    technicalPrep: TechnicalPrep[]
    applicationStrategy: ApplicationChannel[]
    interviewPrep: string[]
    salaryExpectations: {
      service?: SalaryRange
      midTierProduct?: SalaryRange
      topProduct?: SalaryRange
      gcc?: string | SalaryRange
    }
    differentiators: string[]
  }
}

// Role card summary (for browse/grid views)
export interface RoleSummary {
  roleId: string
  roleName: string
  description: string
  category: Category
  icon: string
  difficulty: DifficultyLevel
  stressLevel: StressLevel
  averageSalary: SalaryRange
  timeToJobReady: string
}
