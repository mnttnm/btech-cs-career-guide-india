'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { fadeInUp, springs } from '@/lib/motion'

interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
}

interface EmptyStateProps {
  /** Icon to display */
  icon: LucideIcon
  /** Main title */
  title: string
  /** Description text */
  description: string
  /** Primary action button */
  action?: EmptyStateAction
  /** Optional secondary action */
  secondaryAction?: EmptyStateAction
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: 'sm' | 'default' | 'lg'
}

/**
 * EmptyState - A consistent empty state component following product-design-craft principles.
 *
 * Empty states should guide users toward action, not just state the obvious.
 * Every empty state needs: Visual, Headline, Description, CTA
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'default',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8 px-4 min-h-[200px]',
      icon: 'w-10 h-10',
      iconWrapper: 'w-16 h-16 mb-3',
      title: 'text-base',
      description: 'text-sm max-w-[280px]',
      actions: 'mt-4',
    },
    default: {
      container: 'py-12 px-6 min-h-[300px]',
      icon: 'w-12 h-12',
      iconWrapper: 'w-20 h-20 mb-4',
      title: 'text-lg',
      description: 'text-sm max-w-[360px]',
      actions: 'mt-6',
    },
    lg: {
      container: 'py-16 px-8 min-h-[400px]',
      icon: 'w-14 h-14',
      iconWrapper: 'w-24 h-24 mb-5',
      title: 'text-xl',
      description: 'text-base max-w-[420px]',
      actions: 'mt-8',
    },
  }

  const styles = sizeClasses[size]

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        styles.container,
        className
      )}
    >
      {/* Icon with subtle background */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.bouncy, delay: 0.1 }}
        className={cn(
          'flex items-center justify-center rounded-full bg-muted/50',
          styles.iconWrapper
        )}
      >
        <Icon className={cn('text-muted-foreground', styles.icon)} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className={cn('font-semibold text-foreground mb-2', styles.title)}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={cn('text-muted-foreground', styles.description)}
      >
        {description}
      </motion.p>

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className={cn('flex gap-3', styles.actions)}
        >
          {action && (
            <Button
              variant={action.variant || 'default'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'outline'}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Preset empty states for common scenarios
 */
export const emptyStatePresets = {
  /** No search results found */
  noResults: {
    title: 'No results found',
    description: 'Try adjusting your search terms or filters to find what you\'re looking for.',
  },
  /** First-time user, no data yet */
  noData: {
    title: 'No items yet',
    description: 'Get started by creating your first item.',
  },
  /** Filtered to zero results */
  noFilterResults: {
    title: 'No matches',
    description: 'No items match your current filters. Try removing some filters to see more results.',
  },
  /** Empty comparison */
  noComparison: {
    title: 'Nothing to compare',
    description: 'Add roles to your comparison list to see them side by side.',
  },
  /** Completed state (inbox zero) */
  allDone: {
    title: 'All caught up!',
    description: 'You\'ve completed everything. Time for a break.',
  },
}
