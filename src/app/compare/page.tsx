'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ArrowRight, Lightbulb, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { getRoleById, getRoleSummaries } from '@/data/roles'
import { cn } from '@/lib/utils'
import { Role } from '@/types/role'
import { springs, stagger } from '@/lib/motion'
import { difficultyColors, stressColors } from '@/lib/icons'

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

export default function ComparePage() {
  const { selectedRoles, removeRole, clearRoles } = useComparisonStore()

  const roles = useMemo((): CompareRole[] => {
    return selectedRoles.map((id) => getRoleById(id)).filter(Boolean) as CompareRole[]
  }, [selectedRoles])

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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-6">⚖️</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Compare Career Roles
          </h1>
          <p className="text-muted-foreground mb-8">
            Select 2-3 roles to compare them side-by-side on salary, skills,
            stress level, and more.
          </p>
          <Button asChild size="lg">
            <Link href="/browse">
              Browse Roles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          {/* Popular Comparisons */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Popular Comparisons</h2>
            <div className="grid gap-3">
              {[
                ['frontend-engineer-developer', 'backend-engineer-developer'],
                ['data-scientist', 'data-analyst'],
                ['devops-engineer', 'site-reliability-engineer'],
              ].map((pair, index) => (
                <Link
                  key={index}
                  href={`/compare?roles=${pair.join(',')}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2">
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
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Compare Roles</h1>
        <p className="text-muted-foreground">
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
                onClick={() => removeRole(role?.roleId || '')}
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
        {selectedRoles.length > 0 && (
          <motion.div layout>
            <Button
              variant="ghost"
              onClick={clearRoles}
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
              className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Key Insights
                </h3>
              </div>
              <ul className="space-y-2">
                {insights.map((insight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200"
                  >
                    <span>💡</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Comparison Table */}
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-muted rounded-tl-xl">Metric</th>
                  {roles.map((role) => (
                    <th
                      key={role?.roleId}
                      className="text-left p-4 bg-muted last:rounded-tr-xl"
                    >
                      <div className="flex items-center gap-2">
                        <span>{role?.icon}</span>
                        <span className="font-semibold">{role?.roleName}</span>
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
                      className={cn(
                        'transition-colors hover:bg-muted/50',
                        index % 2 === 0 && 'bg-muted/30'
                      )}
                    >
                      <td className="p-4 font-medium">{metric.label}</td>
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
                          <td key={role?.roleId} className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {isDifficulty ? (
                                  <Badge
                                    variant="secondary"
                                    className={cn(
                                      'text-xs',
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
                                      'text-xs',
                                      stressColors[stressValue]?.bg,
                                      stressColors[stressValue]?.text
                                    )}
                                  >
                                    {value}
                                  </Badge>
                                ) : (
                                  <span
                                    className={cn(
                                      isBest && 'font-semibold text-green-600'
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

          {/* Skills Comparison */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Skills Comparison</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role?.roleId} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{role?.icon}</span>
                    <h3 className="font-semibold">{role?.roleName}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">
                        Primary Languages
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {role?.skills?.programmingLanguages
                          ?.filter((s) => s.priority === 'Primary')
                          .map((skill) => (
                            <Badge key={skill.name} variant="secondary">
                              {skill.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-muted-foreground mb-2">
                        Key Frameworks
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {role?.skills?.frameworks
                          ?.filter((f) => f.popularity === 'High')
                          .slice(0, 3)
                          .map((fw) => (
                            <Badge key={fw.name} variant="outline">
                              {fw.name}
                            </Badge>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-8 p-6 rounded-xl bg-muted/50">
            <h2 className="text-lg font-semibold mb-4">Bottom Line</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <div key={role?.roleId}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{role?.icon}</span>
                    <h3 className="font-medium">Choose {role?.roleName} if...</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {role?.personalityFit?.thriveIf?.slice(0, 3).map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        {item}
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
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            Add at least one more role to start comparing
          </p>
          <Button asChild>
            <Link href="/browse">Browse Roles</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
