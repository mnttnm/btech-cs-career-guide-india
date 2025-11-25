'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RoleCard } from '@/components/RoleCard'
import {
  getRoleSummaries,
  getCategoriesWithCounts,
  categoryLabels,
  filterRoles,
  type RoleFilters,
} from '@/data/roles'
import { Category } from '@/types/role'

const difficulties = ['Easy', 'Moderate', 'Hard', 'Steep']
const stressLevels = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High']

function BrowseContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') as Category | null

  const [filters, setFilters] = useState<RoleFilters>({
    category: initialCategory || undefined,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = getCategoriesWithCounts()

  const filteredRoles = useMemo(() => {
    return filterRoles({ ...filters, search: searchQuery })
  }, [filters, searchQuery])

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
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Browse Roles</h1>
        <p className="text-muted-foreground">
          Explore {getRoleSummaries().length} career paths across different domains
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
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
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 rounded-xl border bg-card"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {/* Category Filter */}
            <div>
              <h3 className="font-medium mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        category:
                          filters.category === cat.category
                            ? undefined
                            : cat.category,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.category === cat.category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="font-medium mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        difficulty: filters.difficulty === diff ? undefined : diff,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.difficulty === diff
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level Filter */}
            <div>
              <h3 className="font-medium mb-3">Stress Level</h3>
              <div className="flex flex-wrap gap-2">
                {stressLevels.map((stress) => (
                  <button
                    key={stress}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        stressLevel:
                          filters.stressLevel === stress ? undefined : stress,
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      filters.stressLevel === stress
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {stress}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredRoles.length} roles
      </div>

      {/* Role Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {filteredRoles.map((role, index) => (
          <motion.div
            key={role.roleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <RoleCard role={role} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No roles found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  )
}
