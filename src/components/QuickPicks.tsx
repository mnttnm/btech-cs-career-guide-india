import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, DoorOpen, Scale, Briefcase, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapping QuickPick categories to browse page filters
export const quickPickFilterMap = {
  'highest-salary': {
    sort: 'salary-high',
  },
  'easiest-entry': {
    difficulty: 'Easy',
    sort: 'difficulty',
  },
  'work-life-balance': {
    stressLevel: 'Low',
  },
  'most-opportunities': {
    // High hiring volume typically means software engineering roles
    category: 'software',
  },
} as const

export type QuickPickId = keyof typeof quickPickFilterMap

// Helper to build browse URL with filters
function buildBrowseUrl(pickId: QuickPickId): string {
  const filters = quickPickFilterMap[pickId]
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    params.set(key, value)
  })
  
  return `/browse?${params.toString()}`
}

const quickPicksData = [
  {
    id: 'highest-salary' as QuickPickId,
    title: 'Highest Salary',
    icon: TrendingUp,
    description: 'Top earning potential',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'group-hover:border-green-500/30',
    roles: [
      { name: 'Product Manager', id: 'product-manager-technical' },
      { name: 'ML Engineer', id: 'machine-learning-engineer' },
      { name: 'Blockchain Dev', id: 'blockchain-developer' },
    ],
  },
  {
    id: 'easiest-entry' as QuickPickId,
    title: 'Easiest Entry',
    icon: DoorOpen,
    description: 'Beginner friendly roles',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'group-hover:border-blue-500/30',
    roles: [
      { name: 'Data Analyst', id: 'data-analyst' },
      { name: 'QA Engineer', id: 'qa-engineer-sdet' },
      { name: 'Frontend Dev', id: 'frontend-engineer-developer' },
    ],
  },
  {
    id: 'work-life-balance' as QuickPickId,
    title: 'Work-Life Balance',
    icon: Scale,
    description: 'Low stress, stable hours',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'group-hover:border-purple-500/30',
    roles: [
      { name: 'Technical Writer', id: 'technical-writer' },
      { name: 'UX Researcher', id: 'ux-researcher' },
      { name: 'Data Analyst', id: 'data-analyst' },
    ],
  },
  {
    id: 'most-opportunities' as QuickPickId,
    title: 'Most Opportunities',
    icon: Briefcase,
    description: 'High hiring volume',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'group-hover:border-orange-500/30',
    roles: [
      { name: 'Full-Stack Dev', id: 'full-stack-engineer-developer' },
      { name: 'Software Engineer', id: 'software-engineer-general' },
      { name: 'DevOps Engineer', id: 'devops-engineer' },
    ],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  },
}

export function QuickPicks() {
  return (
    <section className="py-20 bg-background/50 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Quick Career Picks
          </h2>
          <p className="text-muted-foreground">
            Not sure where to start? Pick a path based on your top priority.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickPicksData.map((pick) => {
            const Icon = pick.icon
            return (
              <motion.div
                key={pick.title}
                variants={itemVariants}
                className={cn(
                  "group relative flex flex-col p-6 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all duration-300",
                  pick.borderColor
                )}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("p-2.5 rounded-xl", pick.bgColor)}>
                    <Icon className={cn("w-6 h-6", pick.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{pick.title}</h3>
                    <p className="text-xs text-muted-foreground">{pick.description}</p>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {pick.roles.map((role, i) => (
                    <Link
                      key={role.id}
                      href={`/role/${role.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/80 transition-colors group/item"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-background border text-[10px] text-muted-foreground font-medium group-hover/item:border-primary/50 group-hover/item:text-primary transition-colors">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-foreground/80 group-hover/item:text-foreground">
                          {role.name}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/0 group-hover/item:text-muted-foreground/100 transition-all -translate-x-1 group-hover/item:translate-x-0" />
                    </Link>
                  ))}
                </div>

                {/* See All Link */}
                <Link
                  href={buildBrowseUrl(pick.id)}
                  className="mt-4 pt-4 border-t border-border/50 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:underline underline-offset-4 transition-all group/link"
                >
                  See all {pick.title.toLowerCase()} roles
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
