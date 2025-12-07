'use client'

import { useState, useMemo, Suspense, useRef, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Filter, X, ArrowUpDown, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleCard } from '@/components/RoleCard'
import { EmptyState } from '@/components/EmptyState'
import {
  getRoleSummaries,
  getCategoriesWithCounts,
  categoryLabels,
  filterRoles,
  type RoleFilters,
} from '@/data/roles'
import { Category, RoleSummary } from '@/types/role'
import { getCategoryIcon } from '@/lib/icons'
import { BrowsePageSkeleton } from '@/components/ui/skeleton'
import { staggerContainer, staggerChild } from '@/lib/motion'

const difficulties = ['Easy', 'Moderate', 'Hard', 'Steep']
const stressLevels = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High']

type SortOption = 'default' | 'salary-high' | 'salary-low' | 'difficulty' | 'time'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'salary-high', label: 'Highest Salary' },
  { value: 'salary-low', label: 'Lowest Salary' },
  { value: 'difficulty', label: 'Easiest First' },
  { value: 'time', label: 'Quickest to Learn' },
]

const difficultyOrder = { Easy: 1, Moderate: 2, Hard: 3, Steep: 4 }

function sortRoles(roles: RoleSummary[], sortBy: SortOption): RoleSummary[] {
  const sorted = [...roles]
  switch (sortBy) {
    case 'salary-high':
      return sorted.sort((a, b) => b.averageSalary.max - a.averageSalary.max)
    case 'salary-low':
      return sorted.sort((a, b) => a.averageSalary.min - b.averageSalary.min)
    case 'difficulty':
      return sorted.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
    case 'time':
      return sorted.sort((a, b) => {
        const aMonths = parseInt(a.timeToJobReady) || 12
        const bMonths = parseInt(b.timeToJobReady) || 12
        return aMonths - bMonths
      })
    default:
      return sorted
  }
}

function BrowseContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const resultsRef = useRef<HTMLDivElement>(null)

  // Derive state from URL
  const category = (searchParams.get('category') as Category) || undefined
  const difficulty = searchParams.get('difficulty') || undefined
  const stressLevel = searchParams.get('stressLevel') || undefined
  const sortBy = (searchParams.get('sort') as SortOption) || 'default'

  // Local state for UI
  const [showFilters, setShowFilters] = useState(false)

  const categories = getCategoriesWithCounts()

  // Helper to update URL params
  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }

      // Reset page to 1 if we had pagination (not applicable here but good practice)
      // Update URL without scroll jump (we handle scroll manually)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })

      // Scroll to top of results if they are out of view
      if (resultsRef.current) {
        const rect = resultsRef.current.getBoundingClientRect()
        if (rect.top < 0 || rect.top > window.innerHeight) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    },
    [searchParams, pathname, router]
  )

  const clearFilters = () => {
    router.push(pathname, { scroll: false })
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const activeFilterCount = [category, difficulty, stressLevel].filter(Boolean).length

  // Memoize filtered results
  const filteredRoles = useMemo(() => {
    const filtered = filterRoles({
      category,
      difficulty,
      stressLevel,
    })
    return sortRoles(filtered, sortBy)
  }, [category, difficulty, stressLevel, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-1">Explore careers</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {getRoleSummaries().length} career paths across {categories.length} domains
        </p>
      </div>

      {/* Combined Category + Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 sticky top-20 z-30 pt-4 pb-2 -mt-4 bg-background/5 backdrop-blur-sm">
        {/* Category Pills (Horizontal Scroll) */}
        <nav aria-label="Filter by category" className="flex-1 min-w-0 -mx-4 px-4 lg:mx-0 lg:px-0 overflow-x-auto scrollbar-hide py-1">
          <div className="flex gap-2" role="group" aria-label="Category filters">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFilter('category', undefined)}
              aria-pressed={!category}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${!category
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary'
                : 'bg-background/50 border-border hover:bg-muted hover:border-muted-foreground/20'
                }`}
            >
              All
            </motion.button>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.category)
              const isActive = category === cat.category
              return (
                <motion.button
                  key={cat.category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateFilter('category', isActive ? undefined : cat.category)}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${cat.label} (${cat.count} roles)`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${isActive
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-primary'
                    : 'bg-background/50 border-border hover:bg-muted hover:border-muted-foreground/20'
                    }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {cat.label}
                </motion.button>
              )
            })}
          </div>
        </nav>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative group">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              aria-label="Sort roles by"
              className="pl-9 pr-8 py-2 rounded-xl border border-border/60 bg-background/50 backdrop-blur-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer hover:bg-muted/50 transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant={showFilters ? 'default' : 'outline'}
            className={showFilters ? "shadow-lg shadow-primary/20" : "bg-background/50 backdrop-blur-sm border-border/60 hover:bg-muted/50"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant={showFilters ? 'secondary' : 'default'} className="ml-2 h-5 px-1.5 min-w-[20px] rounded-full text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-up">
          {category && (
            <Badge variant="secondary" className="gap-1 pl-3 pr-1.5 py-1.5 rounded-lg text-sm bg-muted/50 border border-border/50">
              {categoryLabels[category]}
              <button
                onClick={() => updateFilter('category', undefined)}
                className="ml-1.5 hover:bg-background rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          )}
          {difficulty && (
            <Badge variant="secondary" className="gap-1 pl-3 pr-1.5 py-1.5 rounded-lg text-sm bg-muted/50 border border-border/50">
              {difficulty}
              <button
                onClick={() => updateFilter('difficulty', undefined)}
                className="ml-1.5 hover:bg-background rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          )}
          {stressLevel && (
            <Badge variant="secondary" className="gap-1 pl-3 pr-1.5 py-1.5 rounded-lg text-sm bg-muted/50 border border-border/50">
              {stressLevel} Stress
              <button
                onClick={() => updateFilter('stressLevel', undefined)}
                className="ml-1.5 hover:bg-background rounded-full p-0.5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-destructive h-8 px-2"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0, scale: 0.98 }}
          animate={{ opacity: 1, height: 'auto', scale: 1 }}
          exit={{ opacity: 0, height: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 p-6 rounded-2xl glass border border-primary/10 bg-primary/5 overflow-hidden"
        >
          <div className="grid gap-8 md:grid-cols-3">
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-primary rounded-full" />
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = category === cat.category
                  return (
                    <motion.button
                      key={cat.category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFilter('category', isActive ? undefined : cat.category)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-background/60 hover:bg-background border border-transparent hover:border-border/50'
                      }`}
                    >
                      {cat.label} <span className="text-xs opacity-60 ml-1">({cat.count})</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="font-semibold mb-3 text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-4 bg-blue-500 rounded-full" />
                Difficulty
              </h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => {
                  const isActive = difficulty === diff
                  return (
                    <motion.button
                      key={diff}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFilter('difficulty', isActive ? undefined : diff)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-background/60 hover:bg-background border border-transparent hover:border-border/50'
                      }`}
                    >
                      {diff}
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Stress Level Filter */}
            <div>
              <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Stress Level</h3>
              <div className="flex flex-wrap gap-2">
                {stressLevels.map((stress) => {
                  const isActive = stressLevel === stress
                  return (
                    <motion.button
                      key={stress}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateFilter('stressLevel', isActive ? undefined : stress)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {stress}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-6 text-sm text-muted-foreground" ref={resultsRef}>
        Showing <span className="font-medium text-foreground">{filteredRoles.length}</span> roles
        {activeFilterCount > 0 && ' matching your criteria'}
      </div>

      {/* Role Grid with staggered animation */}
      {filteredRoles.length > 0 && (
        <motion.div
          key={`${category}-${difficulty}-${stressLevel}-${sortBy}`}
          variants={staggerContainer(0.04)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
        >
          {filteredRoles.map((role, index) => (
            <motion.div key={role.roleId} variants={staggerChild}>
              <RoleCard role={role} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No roles found"
          description="We couldn't find any careers matching your filters. Try removing some filters to see more results."
          action={{
            label: 'Clear all filters',
            onClick: clearFilters,
            variant: 'outline',
          }}
        />
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageSkeleton />}>
      <BrowseContent />
    </Suspense>
  )
}
