'use client'

import { useEffect, useMemo, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ArrowRight, Lightbulb, Trophy, GitCompare, Share2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/EmptyState'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { getRoleById, getRoleSummaries } from '@/data/roles'
import { cn } from '@/lib/utils'
import { Role } from '@/types/role'
import { springs } from '@/lib/motion'
import { difficultyColors, stressColors } from '@/lib/icons'
import { removeFromComparisonWithToast, clearComparisonWithToast } from '@/lib/toast-actions'

// Metric bar component for salary visualization
function MetricBar({
  value,
  maxValue,
  isBest,
  delay = 0,
}: {
  value: number
  maxValue: number
  isBest: boolean
  delay?: number
}) {
  const percentage = (value / maxValue) * 100
  return (
    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'h-full rounded-full',
          isBest ? 'bg-green-500' : 'bg-primary/60'
        )}
      />
    </div>
  )
}

type CompareRole = Role | undefined

function CompareContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedRoles, addRole, clearRoles } = useComparisonStore()
  const [copied, setCopied] = useState(false)

  // Sync roles from URL query (?roles=role-a,role-b) into comparison store
  useEffect(() => {
    const rolesParam = searchParams.get('roles')
    if (!rolesParam) return

    // Parse, de-duplicate, and validate role IDs from query
    const queriedRoleIds = rolesParam
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)

    const uniqueRoleIds = Array.from(new Set(queriedRoleIds))
    const validRoleIds = uniqueRoleIds.filter((id) => getRoleById(id))

    // Enforce the same max-3 constraint as the store
    const normalizedRoleIds = validRoleIds.slice(0, 3)

    // Avoid unnecessary store updates if already in sync
    const isSameSelection =
      normalizedRoleIds.length === selectedRoles.length &&
      normalizedRoleIds.every((id, index) => id === selectedRoles[index])

    if (isSameSelection) return

    // Update store to match URL
    clearRoles()
    normalizedRoleIds.forEach((id) => addRole(id))
  }, [searchParams, selectedRoles, addRole, clearRoles])

  const roles = useMemo((): CompareRole[] => {
    return selectedRoles.map((id) => getRoleById(id)).filter(Boolean) as CompareRole[]
  }, [selectedRoles])

  // Share comparison by copying link to clipboard
  const handleShare = async () => {
    const roleNames = roles.map(r => r?.roleName).filter(Boolean).join(' vs ')
    const text = `Compare: ${roleNames}\n\nCheck out this career comparison on CareerGuide!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Career Comparison: ${roleNames}`,
          text: text,
          url: window.location.href,
        })
      } catch {
        // User cancelled or share failed, fall back to clipboard
        await copyToClipboard()
      }
    } else {
      await copyToClipboard()
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  const allRoles = getRoleSummaries()

  // Generate insights
  const insights = useMemo(() => {
    if (roles.length < 2) return []

    const insights: string[] = []

    // Compare salaries
    const salaries = roles.map((r) => ({
      name: r?.roleName,
      fresher: r?.salaryRanges?.fresher?.average?.max || 0,
      fiveYear: r?.salaryRanges?.fivePlus?.senior?.max || 0,
    }))

    const highestFresher = salaries.reduce((a, b) =>
      a.fresher > b.fresher ? a : b
    )
    const highestGrowth = salaries.reduce((a, b) =>
      a.fiveYear > b.fiveYear ? a : b
    )

    if (highestFresher.name) {
      insights.push(
        `${highestFresher.name} has the highest fresher salary (up to ₹${highestFresher.fresher}L)`
      )
    }

    if (highestGrowth.name && highestGrowth.name !== highestFresher.name) {
      insights.push(
        `${highestGrowth.name} has higher long-term salary potential (up to ₹${highestGrowth.fiveYear}L)`
      )
    }

    // Compare difficulty
    const difficulties = roles.map((r) => r?.learningCurve?.difficulty)
    const hasEasy = difficulties.includes('Easy')
    const hasHard = difficulties.some((d) => d === 'Hard' || d === 'Steep')

    if (hasEasy && hasHard) {
      const easyRole = roles.find((r) => r?.learningCurve?.difficulty === 'Easy')
      insights.push(
        `${easyRole?.roleName} is easier to get started with`
      )
    }

    // Compare stress levels
    const stressLevels = roles.map((r) => r?.stressLevel?.level)
    const lowStress = roles.find(
      (r) =>
        r?.stressLevel?.level === 'Low' || r?.stressLevel?.level === 'Low-Medium'
    )
    if (lowStress) {
      insights.push(`${lowStress.roleName} generally has better work-life balance`)
    }

    return insights
  }, [roles])

  // Comparison metrics
  const metrics = [
    {
      label: 'Fresher Salary',
      getValue: (role: CompareRole) =>
        role?.salaryRanges?.fresher?.average
          ? `₹${role.salaryRanges.fresher.average.min}-${role.salaryRanges.fresher.average.max}L`
          : 'N/A',
      getBest: (roleList: CompareRole[]) => {
        const max = Math.max(
          ...roleList.map((r) => r?.salaryRanges?.fresher?.average?.max || 0)
        )
        return roleList.find(
          (r) => r?.salaryRanges?.fresher?.average?.max === max
        )?.roleId
      },
    },
    {
      label: '5+ Year Salary',
      getValue: (role: CompareRole) =>
        role?.salaryRanges?.fivePlus?.senior
          ? `₹${role.salaryRanges.fivePlus.senior.min}-${role.salaryRanges.fivePlus.senior.max}L`
          : 'N/A',
      getBest: (roleList: CompareRole[]) => {
        const max = Math.max(
          ...roleList.map((r) => r?.salaryRanges?.fivePlus?.senior?.max || 0)
        )
        return roleList.find(
          (r) => r?.salaryRanges?.fivePlus?.senior?.max === max
        )?.roleId
      },
    },
    {
      label: 'Time to Job-Ready',
      getValue: (role: CompareRole) =>
        role?.learningCurve?.timeToJobReady || 'N/A',
      getBest: () => null,
    },
    {
      label: 'Difficulty',
      getValue: (role: CompareRole) =>
        role?.learningCurve?.difficulty || 'N/A',
      getBest: (roleList: CompareRole[]) => {
        const order = ['Easy', 'Moderate', 'Hard', 'Steep']
        const sorted = [...roleList].sort(
          (a, b) =>
            order.indexOf(a?.learningCurve?.difficulty || 'Moderate') -
            order.indexOf(b?.learningCurve?.difficulty || 'Moderate')
        )
        return sorted[0]?.roleId
      },
    },
    {
      label: 'Stress Level',
      getValue: (role: CompareRole) => role?.stressLevel?.level || 'N/A',
      getBest: (roleList: CompareRole[]) => {
        const order = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High']
        const sorted = [...roleList].sort(
          (a, b) =>
            order.indexOf(a?.stressLevel?.level || 'Medium') -
            order.indexOf(b?.stressLevel?.level || 'Medium')
        )
        return sorted[0]?.roleId
      },
    },
  ]

  if (selectedRoles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <EmptyState
            icon={GitCompare}
            title="Compare Career Roles"
            description="Select 2-3 roles to compare them side-by-side on salary, skills, stress level, and more."
            action={{
              label: 'Browse Roles',
              onClick: () => router.push('/browse'),
            }}
            size="lg"
          />

          {/* Popular Comparisons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="text-lg font-semibold mb-4 text-center">Popular Comparisons</h2>
            <div className="grid gap-3">
              {[
                ['frontend-engineer-developer', 'backend-engineer-developer'],
                ['data-scientist', 'data-analyst'],
                ['devops-engineer', 'site-reliability-engineer'],
              ].map((pair, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={`/compare?roles=${pair.join(',')}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span>{getRoleById(pair[0])?.icon}</span>
                      <span className="font-medium">
                        {getRoleById(pair[0])?.roleName}
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span>{getRoleById(pair[1])?.icon}</span>
                      <span className="font-medium">
                        {getRoleById(pair[1])?.roleName}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">
          Compare Roles
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          See how these roles stack up against each other
        </p>
      </div>

      {/* Selected Roles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {roles.map((role) => (
            <motion.div
              key={role?.roleId}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={springs.snappy}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted"
            >
              <span>{role?.icon}</span>
              <span className="font-medium">{role?.roleName}</span>
              <button
                onClick={() => removeFromComparisonWithToast(role?.roleId || '', role?.roleName || '')}
                className="p-1 hover:bg-background rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {selectedRoles.length < 3 && (
          <motion.div layout>
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/browse">
                <Plus className="w-4 h-4" />
                Add Role
              </Link>
            </Button>
          </motion.div>
        )}
        {selectedRoles.length >= 2 && (
          <motion.div layout>
            <Button
              variant="outline"
              onClick={handleShare}
              className="gap-2"
              size="sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  Share
                </>
              )}
            </Button>
          </motion.div>
        )}
        {selectedRoles.length > 0 && (
          <motion.div layout>
            <Button
              variant="ghost"
              onClick={clearComparisonWithToast}
              className="text-muted-foreground"
            >
              Clear All
            </Button>
          </motion.div>
        )}
      </div>

      {roles.length >= 2 && (
        <>
          {/* Insights */}
          {insights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl glass border border-primary/10 bg-primary/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Lightbulb className="w-24 h-24" />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  Key Insights
                </h3>
              </div>
              <ul className="space-y-3 relative z-10">
                {insights.map((insight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-base text-muted-foreground"
                  >
                    <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Comparison Table */}
          <div className="relative rounded-2xl border bg-card shadow-sm overflow-hidden mb-12">
            {/* Scroll hint for mobile */}
            <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-6 bg-muted/30 font-medium text-muted-foreground w-1/4 sticky left-0 z-20 backdrop-blur-md">Metric</th>
                    {roles.map((role, i) => (
                      <th
                        key={role?.roleId}
                        className="text-left p-6 bg-muted/10 min-w-[200px]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl p-2 bg-muted/50 rounded-lg">{role?.icon}</span>
                          <span className="font-bold text-lg leading-tight">{role?.roleName}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              <tbody>
                {metrics.map((metric, index) => {
                  const bestRoleId = metric.getBest(roles)
                  // Get max salary value for metric bars
                  const maxSalary = metric.label.includes('Salary')
                    ? Math.max(...roles.map((r) => {
                        if (metric.label === 'Fresher Salary') {
                          return r?.salaryRanges?.fresher?.average?.max || 0
                        }
                        return r?.salaryRanges?.fivePlus?.senior?.max || 0
                      }))
                    : 0

                  return (
                    <motion.tr
                      key={metric.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-6 font-medium text-sm text-muted-foreground sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r">{metric.label}</td>
                      {roles.map((role, roleIndex) => {
                        const isBest = bestRoleId === role?.roleId
                        const value = metric.getValue(role)

                        // Get numeric value for bar
                        const numericValue = metric.label === 'Fresher Salary'
                          ? role?.salaryRanges?.fresher?.average?.max || 0
                          : metric.label === '5+ Year Salary'
                          ? role?.salaryRanges?.fivePlus?.senior?.max || 0
                          : 0

                        // Get badge colors for difficulty/stress
                        const isDifficulty = metric.label === 'Difficulty'
                        const isStress = metric.label === 'Stress Level'
                        const difficultyValue = role?.learningCurve?.difficulty as keyof typeof difficultyColors
                        const stressValue = role?.stressLevel?.level as keyof typeof stressColors

                        return (
                          <td key={role?.roleId} className="p-6 align-top">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                {isDifficulty ? (
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      'px-3 py-1 text-xs',
                                      difficultyColors[difficultyValue]?.bg,
                                      difficultyColors[difficultyValue]?.text
                                    )}
                                  >
                                    {value}
                                  </Badge>
                                ) : isStress ? (
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      'px-3 py-1 text-xs',
                                      stressColors[stressValue]?.bg,
                                      stressColors[stressValue]?.text
                                    )}
                                  >
                                    {value}
                                  </Badge>
                                ) : (
                                  <span
                                    className={cn(
                                      "text-lg",
                                      isBest ? 'font-bold text-green-600 dark:text-green-400' : 'text-foreground'
                                    )}
                                  >
                                    {value}
                                  </span>
                                )}
                                {isBest && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={springs.bouncy}
                                    title="Best in category"
                                  >
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                  </motion.div>
                                )}
                              </div>
                              {metric.label.includes('Salary') && maxSalary > 0 && (
                                <MetricBar
                                  value={numericValue}
                                  maxValue={maxSalary}
                                  isBest={isBest}
                                  delay={index * 0.05 + roleIndex * 0.1}
                                />
                              )}
                            </div>
                          </td>
                        )
                      })}
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          </div>

          {/* Winner Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Winner Summary</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Highest Salary', winner: metrics.find(m => m.label === 'Fresher Salary')?.getBest(roles), metric: 'Fresher Salary' },
                { label: 'Easiest to Learn', winner: metrics.find(m => m.label === 'Difficulty')?.getBest(roles), metric: 'Difficulty' },
                { label: 'Quickest Start', winner: metrics.find(m => m.label === 'Time to Job')?.getBest(roles), metric: 'Time to Job' },
                { label: 'Best Work-Life', winner: metrics.find(m => m.label === 'Stress Level')?.getBest(roles), metric: 'Stress Level' },
              ].map((item, i) => {
                const winnerRole = roles.find(r => r?.roleId === item.winner)
                if (!winnerRole) return null
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-5 rounded-xl border bg-card hover:shadow-lg hover:border-border/80 transition-all duration-300 group"
                  >
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{item.label}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300">{winnerRole.icon}</span>
                      <span className="text-base font-bold leading-tight">{winnerRole.roleName}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Bottom Line */}
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">Bottom Line Recommendation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <div key={role?.roleId} className="p-6 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{role?.icon}</span>
                    <h3 className="text-lg font-bold">Choose {role?.roleName} if...</h3>
                  </div>
                  <ul className="space-y-3">
                    {role?.personalityFit?.thriveIf?.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <div className="mt-1 p-1 rounded-full bg-green-500/10 dark:bg-green-500/20">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {roles.length === 1 && (
        <EmptyState
          icon={Plus}
          title="Add one more role"
          description="You need at least 2 roles to compare. Add another role to see them side-by-side."
          action={{
            label: 'Browse Roles',
            onClick: () => router.push('/browse'),
          }}
          size="sm"
        />
      )}
    </div>
  )
}

// Loading skeleton for the compare page
function ComparePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
        <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<ComparePageSkeleton />}>
      <CompareContent />
    </Suspense>
  )
}
