'use client'

import { useState, useMemo, Suspense, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, X, ArrowUpDown, SearchX } from 'lucide-react'
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
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') as Category | null
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<RoleFilters>({
    category: initialCategory || undefined,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('default')

  const categories = getCategoriesWithCounts()

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }

      if (e.key === 'Escape') {
        searchInputRef.current?.blur()
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filteredRoles = useMemo(() => {
    const filtered = filterRoles({ ...filters, search: searchQuery })
    return sortRoles(filtered, sortBy)
  }, [filters, searchQuery, sortBy])

  const activeFilterCount = [
    filters.category,
    filters.difficulty,
    filters.stressLevel,
  ].filter(Boolean).length

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Explore careers</h1>
        <p className="text-muted-foreground">
          {getRoleSummaries().length} career paths across {categories.length} domains
        </p>
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <nav aria-label="Filter by category" className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2" role="group" aria-label="Category filters">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setFilters({ ...filters, category: undefined })}
            aria-pressed={!filters.category}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !filters.category
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </motion.button>
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.category)
            const isActive = filters.category === cat.category
            return (
              <motion.button
                key={cat.category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setFilters({
                    ...filters,
                    category: isActive ? undefined : cat.category,
                  })
                }
                aria-pressed={isActive}
                aria-label={`Filter by ${cat.label} (${cat.count} roles)`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {cat.label}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search frontend, ML, DevOps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-16 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
            aria-label="Search roles"
          />
          {/* Keyboard hint or clear button */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md hover:bg-muted transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-muted-foreground bg-muted rounded border">
                /
              </kbd>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Sort roles by"
              className="pl-10 pr-8 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer"
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
            className="gap-2 h-[46px]"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant={showFilters ? 'secondary' : 'default'} className="ml-1 h-5 px-1.5 min-w-[20px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.category && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
              {categoryLabels[filters.category]}
              <button
                onClick={() => setFilters({ ...filters, category: undefined })}
                className="ml-1 hover:bg-muted rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.difficulty && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
              {filters.difficulty}
              <button
                onClick={() => setFilters({ ...filters, difficulty: undefined })}
                className="ml-1 hover:bg-muted rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.stressLevel && (
            <Badge variant="secondary" className="gap-1 pl-2 pr-1 py-1">
              {filters.stressLevel} Stress
              <button
                onClick={() => setFilters({ ...filters, stressLevel: undefined })}
                className="ml-1 hover:bg-muted rounded p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 p-5 rounded-2xl border bg-card shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = filters.category === cat.category
                  return (
                    <motion.button
                      key={cat.category}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          category: isActive ? undefined : cat.category,
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {cat.label} ({cat.count})
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => {
                  const isActive = filters.difficulty === diff
                  return (
                    <motion.button
                      key={diff}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          difficulty: isActive ? undefined : diff,
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted hover:bg-muted/80'
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
                  const isActive = filters.stressLevel === stress
                  return (
                    <motion.button
                      key={stress}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          stressLevel: isActive ? undefined : stress,
                        })
                      }
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
      <div className="mb-6 text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filteredRoles.length}</span> roles
        {(searchQuery || activeFilterCount > 0) && ' matching your criteria'}
      </div>

      {/* Role Grid with staggered animation */}
      {filteredRoles.length > 0 && (
        <motion.div
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
          description={
            searchQuery
              ? `We couldn't find any careers matching "${searchQuery}". Try different search terms or adjust your filters.`
              : "We couldn't find any careers matching your filters. Try removing some filters to see more results."
          }
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
