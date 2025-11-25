'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, GitCompare, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { RoleSummary } from '@/types/role'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { useComparisonStore } from '@/stores/useComparisonStore'

interface RoleCardProps {
  role: RoleSummary
  variant?: 'default' | 'compact'
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  Moderate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Hard: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Steep: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

const stressColors = {
  Low: 'bg-green-100 text-green-800',
  'Low-Medium': 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  'Medium-High': 'bg-orange-100 text-orange-800',
  High: 'bg-red-100 text-red-800',
}

export function RoleCard({ role, variant = 'default' }: RoleCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addRole, removeRole, isSelected, selectedRoles } = useComparisonStore()

  const isRoleFavorite = isFavorite(role.roleId)
  const isRoleSelected = isSelected(role.roleId)
  const canAddToCompare = selectedRoles.length < 3 || isRoleSelected

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(role.roleId)
  }

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isRoleSelected) {
      removeRole(role.roleId)
    } else if (canAddToCompare) {
      addRole(role.roleId)
    }
  }

  if (variant === 'compact') {
    return (
      <Link href={`/role/${role.roleId}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-card border hover:border-primary/50 hover:shadow-md transition-all"
        >
          <span className="text-2xl">{role.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{role.roleName}</h3>
            <p className="text-xs text-muted-foreground">
              ₹{role.averageSalary.min}-{role.averageSalary.max} LPA
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/role/${role.roleId}`}>
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'group relative flex flex-col h-full p-4 rounded-2xl bg-card border transition-all duration-200',
          'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
          isRoleSelected && 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
        )}
      >
        {/* Icon and Actions */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{role.icon}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleToggleFavorite}
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-colors',
                  isRoleFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                )}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full',
                isRoleSelected && 'bg-blue-100 dark:bg-blue-900'
              )}
              onClick={handleToggleCompare}
              disabled={!canAddToCompare && !isRoleSelected}
            >
              <GitCompare
                className={cn(
                  'w-4 h-4 transition-colors',
                  isRoleSelected ? 'text-blue-600' : 'text-muted-foreground'
                )}
              />
            </Button>
          </div>
        </div>

        {/* Role Name */}
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
          {role.roleName}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {role.description}
        </p>

        {/* Stats */}
        <div className="space-y-3">
          {/* Salary */}
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium">
              ₹{role.averageSalary.min}-{role.averageSalary.max} LPA
            </span>
            <span className="text-xs text-muted-foreground">(Fresher)</span>
          </div>

          {/* Time to Job Ready */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              {role.timeToJobReady} to job-ready
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={cn('text-xs', difficultyColors[role.difficulty])}
            >
              {role.difficulty}
            </Badge>
            <Badge
              variant="secondary"
              className={cn('text-xs', stressColors[role.stressLevel])}
            >
              {role.stressLevel} Stress
            </Badge>
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <ArrowRight className="w-5 h-5 text-primary" />
        </div>
      </motion.div>
    </Link>
  )
}
