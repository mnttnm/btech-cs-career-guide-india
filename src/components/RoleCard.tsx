'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, GitCompare, ArrowRight, Clock, TrendingUp, Check } from 'lucide-react'
import { RoleSummary } from '@/types/role'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/useFavoritesStore'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { getRoleIcon, difficultyColors, stressColors } from '@/lib/icons'
import { toggleFavoriteWithToast, addToComparisonWithToast, removeFromComparisonWithToast } from '@/lib/toast-actions'

interface RoleCardProps {
  role: RoleSummary
  variant?: 'default' | 'compact'
  index?: number
}

// Animation variants for staggered entrance
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const
    }
  })
}

export function RoleCard({ role, variant = 'default', index = 0 }: RoleCardProps) {
  const { isFavorite } = useFavoritesStore()
  const { isSelected, selectedRoles } = useComparisonStore()

  const isRoleFavorite = isFavorite(role.roleId)
  const isRoleSelected = isSelected(role.roleId)
  const canAddToCompare = selectedRoles.length < 3 || isRoleSelected

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavoriteWithToast(role.roleId, role.roleName)
  }

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isRoleSelected) {
      removeFromComparisonWithToast(role.roleId, role.roleName)
    } else {
      addToComparisonWithToast(role.roleId, role.roleName)
    }
  }

  // Get the appropriate Lucide icon for this role
  const RoleIcon = getRoleIcon(role.roleId, role.category)

  if (variant === 'compact') {
    return (
      <Link href={`/role/${role.roleId}`}>
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'relative flex items-center gap-3 p-3 rounded-xl bg-card border transition-all overflow-hidden',
            'hover:shadow-[var(--shadow-card-hover)]',
            // Gradient border effect container
            'before:absolute before:inset-0 before:rounded-xl before:p-[1px]',
            'before:bg-[var(--gradient-border)] before:opacity-0 before:transition-opacity before:duration-200',
            'before:-z-10 before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
            'before:[mask-composite:exclude]',
            'hover:before:opacity-100 hover:border-transparent'
          )}
        >
          <motion.div
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <RoleIcon className="w-5 h-5 text-primary" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{role.roleName}</h3>
            <p className="text-xs text-muted-foreground">
              ₹{role.averageSalary.min}-{role.averageSalary.max} LPA
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/role/${role.roleId}`}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'group relative flex flex-col h-full p-5 rounded-2xl bg-card border overflow-hidden',
          'shadow-[var(--shadow-card)] transition-all duration-300',
          'hover:shadow-[var(--shadow-card-hover)]',
          // Gradient border effect
          'before:absolute before:inset-0 before:rounded-2xl before:p-[1.5px]',
          'before:bg-[var(--gradient-border)] before:opacity-0 before:transition-opacity before:duration-300',
          'before:-z-10 before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]',
          'before:[mask-composite:exclude]',
          'hover:before:opacity-100 hover:border-transparent',
          // Glassmorphic hover glow
          'after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition-opacity after:duration-300',
          'after:bg-[radial-gradient(circle_at_50%_0%,var(--brand-subtle),transparent_70%)]',
          'hover:after:opacity-100',
          // Selected state
          isRoleSelected && 'border-primary ring-2 ring-primary/20 before:opacity-100 before:border-transparent'
        )}
      >
        {/* Selection indicator */}
        {isRoleSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 left-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10"
          >
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          </motion.div>
        )}

        {/* Icon and Actions */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <motion.div
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors"
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <RoleIcon className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex gap-1">
            {/* Favorite button - shows on hover or when favorited */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full backdrop-blur-sm transition-all duration-200',
                isRoleFavorite
                  ? 'bg-red-50 dark:bg-red-950/50 opacity-100'
                  : 'bg-background/80 opacity-0 group-hover:opacity-100'
              )}
              onClick={handleToggleFavorite}
              aria-label={isRoleFavorite ? `Remove ${role.roleName} from favorites` : `Add ${role.roleName} to favorites`}
              aria-pressed={isRoleFavorite}
            >
              <Heart
                className={cn(
                  'w-4 h-4 transition-all',
                  isRoleFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground hover:text-red-400'
                )}
              />
            </Button>
            {/* Compare button - always visible when selected or comparison slot available */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full backdrop-blur-sm transition-all duration-200',
                isRoleSelected
                  ? 'bg-primary/10 opacity-100'
                  : canAddToCompare
                    ? 'bg-background/80 opacity-0 group-hover:opacity-100'
                    : 'opacity-0 group-hover:opacity-50'
              )}
              onClick={handleToggleCompare}
              disabled={!canAddToCompare && !isRoleSelected}
              aria-label={
                isRoleSelected
                  ? `Remove ${role.roleName} from comparison`
                  : canAddToCompare
                    ? `Add ${role.roleName} to comparison (${selectedRoles.length}/3 selected)`
                    : 'Comparison full (3/3)'
              }
              aria-pressed={isRoleSelected}
            >
              <GitCompare
                className={cn(
                  'w-4 h-4 transition-all',
                  isRoleSelected ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary'
                )}
              />
            </Button>
          </div>
        </div>

        {/* Role Name */}
        <h3 className="relative z-10 font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors duration-200">
          {role.roleName}
        </h3>

        {/* Description */}
        <p className="relative z-10 text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {role.description}
        </p>

        {/* Stats */}
        <div className="relative z-10 space-y-3">
          {/* Salary */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-success/10">
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            </div>
            <span className="text-sm font-medium">
              ₹{role.averageSalary.min}-{role.averageSalary.max} LPA
            </span>
            <span className="text-xs text-muted-foreground">(Fresher)</span>
          </div>

          {/* Time to Job Ready */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10">
              <Clock className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              {role.timeToJobReady} to job-ready
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge
              variant="secondary"
              className={cn(
                'text-xs font-medium transition-transform hover:scale-105',
                difficultyColors[role.difficulty]?.bg,
                difficultyColors[role.difficulty]?.text
              )}
            >
              {role.difficulty}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                'text-xs font-medium transition-transform hover:scale-105',
                stressColors[role.stressLevel]?.bg,
                stressColors[role.stressLevel]?.text
              )}
            >
              {role.stressLevel} Stress
            </Badge>
          </div>
        </div>

        {/* Arrow indicator */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          initial={false}
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
        </motion.div>
      </motion.div>
    </Link>
  )
}
