'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  GitCompare,
  TrendingUp,
  Clock,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { getRoleById, getRoleSummaries, categoryLabels } from '@/data/roles'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { cn } from '@/lib/utils'
import { getRoleIcon, difficultyColors, stressColors } from '@/lib/icons'
import { RoleCard } from '@/components/RoleCard'
import { springs } from '@/lib/motion'

// Hook to track scroll progress
function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollProgress)
      setHasScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { progress, hasScrolled }
}

interface PageProps {
  params: Promise<{ roleId: string }>
}

export default function RoleDetailPage({ params }: PageProps) {
  const { roleId } = use(params)
  const role = getRoleById(roleId)
  const { progress, hasScrolled } = useScrollProgress()

  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addRole, removeRole, isSelected, selectedRoles } = useComparisonStore()

  // Get related roles (same category, excluding current)
  const relatedRoles = getRoleSummaries()
    .filter((r) => r.category === role?.category && r.roleId !== roleId)
    .slice(0, 6)

  if (!role) {
    notFound()
  }

  const isRoleFavorite = isFavorite(role.roleId)
  const isRoleSelected = isSelected(role.roleId)
  const canAddToCompare = selectedRoles.length < 3 || isRoleSelected

  const handleToggleCompare = () => {
    if (isRoleSelected) {
      removeRole(role.roleId)
    } else if (canAddToCompare) {
      addRole(role.roleId)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-14 md:top-16 left-0 right-0 h-0.5 bg-primary z-50 origin-left"
        style={{ scaleX: progress / 100 }}
        initial={{ scaleX: 0 }}
      />

      {/* Header */}
      <div
        className={cn(
          'sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b transition-shadow duration-200',
          hasScrolled && 'shadow-md'
        )}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/browse">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleFavorite(role.roleId)}
            >
              <Heart
                className={cn(
                  'w-5 h-5 transition-all',
                  isRoleFavorite && 'fill-red-500 text-red-500 scale-110'
                )}
              />
            </Button>
            <Button
              variant={isRoleSelected ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
              onClick={handleToggleCompare}
              disabled={!canAddToCompare && !isRoleSelected}
            >
              <GitCompare className="w-4 h-4" />
              {isRoleSelected ? 'Added' : 'Compare'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {(() => {
            const RoleIcon = getRoleIcon(role.roleId, role.category)
            return (
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                  <RoleIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {categoryLabels[role.category]}
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-bold">{role.roleName}</h1>
                </div>
              </div>
            )
          })()}
          <p className="text-muted-foreground text-lg">{role.description}</p>
        </motion.div>

        {/* Key Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              icon: TrendingUp,
              label: 'Fresher Salary',
              value: `₹${role.salaryRanges?.fresher?.average?.min || '4'}-${role.salaryRanges?.fresher?.average?.max || '8'} LPA`,
              color: 'text-success',
            },
            {
              icon: Clock,
              label: 'Time to Job-Ready',
              value: role.learningCurve?.timeToJobReady || '6-12 months',
              color: 'text-primary',
            },
            {
              icon: GraduationCap,
              label: 'Difficulty',
              value: role.learningCurve?.difficulty || 'Moderate',
              isBadge: true,
              badgeColors: difficultyColors[role.learningCurve?.difficulty || 'Moderate'],
            },
            {
              icon: Briefcase,
              label: 'Stress Level',
              value: role.stressLevel?.level || 'Medium',
              color: stressColors[role.stressLevel?.level || 'Medium']?.text,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="group p-4 rounded-xl bg-card border transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 cursor-default"
            >
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm">{stat.label}</span>
              </div>
              {stat.isBadge ? (
                <Badge
                  className={cn(
                    'text-sm',
                    stat.badgeColors?.bg,
                    stat.badgeColors?.text
                  )}
                >
                  {stat.value}
                </Badge>
              ) : (
                <div className={cn('font-semibold text-lg', stat.color)}>
                  {stat.value}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Accordion Sections */}
        <Accordion type="multiple" defaultValue={['daily-work', 'personality']} className="space-y-4">
          {/* Daily Work */}
          <AccordionItem value="daily-work" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              What You&apos;ll Do Daily
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {role.dailyWork?.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Skills Required */}
          <AccordionItem value="skills" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Skills Required
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              {/* Programming Languages */}
              {role.skills?.programmingLanguages?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Programming Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.programmingLanguages.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant={skill.priority === 'Primary' ? 'default' : 'secondary'}
                        className="px-3 py-1"
                      >
                        {skill.name}
                        <span className="ml-1 opacity-70">({skill.level})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Frameworks */}
              {role.skills?.frameworks?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Frameworks & Libraries</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.frameworks.map((fw) => (
                      <Badge key={fw.name} variant="outline" className="px-3 py-1">
                        {fw.name}
                        <span className="ml-1 opacity-70">({fw.popularity})</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Concepts */}
              {role.skills?.coreConcepts?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Core Concepts</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {role.skills.coreConcepts.map((concept, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                        {concept}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools */}
              {role.skills?.tools?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Tools & Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.skills.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="px-3 py-1">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Personality Fit */}
          <AccordionItem value="personality" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Is This For You?
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    You&apos;ll Thrive If...
                  </h4>
                  <ul className="space-y-2">
                    {role.personalityFit?.thriveIf?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-green-600 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Avoid If...
                  </h4>
                  <ul className="space-y-2">
                    {role.personalityFit?.avoidIf?.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-red-600 mt-0.5">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Career Progression */}
          <AccordionItem value="career" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Career Progression
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-4">Growth Timeline</h4>
                <div className="space-y-4">
                  {role.careerProgression?.timeline?.map((level, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        {index < (role.careerProgression?.timeline?.length || 0) - 1 && (
                          <div className="w-0.5 h-full bg-border flex-1 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{level.title}</span>
                          <Badge variant="outline">{level.years} years</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{level.salary?.min}-{level.salary?.max} LPA
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternative Paths */}
              {role.careerProgression?.alternativePaths?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Alternative Paths</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.careerProgression.alternativePaths.map((path, index) => (
                      <Badge key={index} variant="secondary">
                        {path}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* College Strategy */}
          <AccordionItem value="college" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              College Roadmap
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6">
                {role.collegeStrategy?.map((year) => (
                  <div key={year.year} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">Year {year.year}</Badge>
                      <span className="font-medium">{year.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {year.goals?.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Salary Breakdown */}
          <AccordionItem value="salary" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Salary Breakdown
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              {/* Fresher Salary */}
              <div>
                <h4 className="font-medium mb-4">Fresher Salary (0-2 years)</h4>
                <div className="space-y-3">
                  {role.salaryRanges?.fresher?.serviceBased && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Service-Based</span>
                      <span className="font-medium">
                        ₹{role.salaryRanges.fresher.serviceBased.min}-
                        {role.salaryRanges.fresher.serviceBased.max} LPA
                      </span>
                    </div>
                  )}
                  {role.salaryRanges?.fresher?.productBased && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Product-Based</span>
                      <span className="font-medium">
                        ₹{role.salaryRanges.fresher.productBased.min}-
                        {role.salaryRanges.fresher.productBased.max} LPA
                      </span>
                    </div>
                  )}
                  {role.salaryRanges?.fresher?.topTech && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Top Tech (FAANG)</span>
                      <span className="font-medium text-green-600">
                        ₹{role.salaryRanges.fresher.topTech.min}-
                        {role.salaryRanges.fresher.topTech.max} LPA
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Companies */}
              {role.salaryRanges?.topCompanies?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">Top Companies (Fresher)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {role.salaryRanges.topCompanies.map((company) => (
                      <div
                        key={company.name}
                        className="p-3 rounded-lg bg-muted/50 flex items-center justify-between"
                      >
                        <span className="font-medium text-sm">{company.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{company.range?.min}-{company.range?.max}L
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* First Job Strategy */}
          <AccordionItem value="first-job" className="border rounded-xl px-4">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              First Job Strategy
            </AccordionTrigger>
            <AccordionContent className="space-y-6">
              {/* Technical Prep */}
              {role.firstJobStrategy?.technicalPrep?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Technical Preparation</h4>
                  <div className="space-y-3">
                    {role.firstJobStrategy.technicalPrep.map((prep, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50">
                        <div className="font-medium text-sm mb-1">{prep.skill}</div>
                        <div className="text-sm text-muted-foreground">{prep.goal}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interview Prep */}
              {role.firstJobStrategy?.interviewPrep?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Interview Topics</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {role.firstJobStrategy.interviewPrep.map((topic, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Differentiators */}
              {role.firstJobStrategy?.differentiators?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">How to Stand Out</h4>
                  <ul className="space-y-2">
                    {role.firstJobStrategy.differentiators.map((diff, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary">★</span>
                        {diff}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Related Roles Carousel */}
        {relatedRoles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Related Roles</h2>
                <p className="text-sm text-muted-foreground">
                  Other roles in {categoryLabels[role.category]}
                </p>
              </div>
            </div>

            {/* Horizontal scrolling carousel */}
            <div className="relative -mx-4 px-4">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {relatedRoles.map((relatedRole, index) => (
                  <div
                    key={relatedRole.roleId}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start"
                  >
                    <RoleCard role={relatedRole} variant="compact" index={index} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t p-4 z-40">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Button
            variant={isRoleSelected ? 'default' : 'outline'}
            className="flex-1 gap-2"
            onClick={handleToggleCompare}
            disabled={!canAddToCompare && !isRoleSelected}
          >
            <GitCompare className="w-4 h-4" />
            {isRoleSelected ? `Added (${selectedRoles.length}/3)` : 'Add to Compare'}
          </Button>
          {selectedRoles.length > 0 && (
            <Button asChild className="flex-1">
              <Link href="/compare">Compare Now ({selectedRoles.length})</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
