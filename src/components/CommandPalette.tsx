'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Home,
  Target,
  GitCompare,
  Compass,
  Moon,
  Sun,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { getRoleSummaries, categoryLabels } from '@/data/roles'
import { getRoleIcon } from '@/lib/icons'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { clearComparisonWithToast } from '@/lib/toast-actions'
import { useTheme } from '@/components/ThemeProvider'
import { cn } from '@/lib/utils'

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords?: string[]
  category: 'navigation' | 'actions' | 'roles'
}

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { selectedRoles } = useComparisonStore()
  const { theme, setTheme, resolvedTheme } = useTheme()

  // Get all roles for search
  const roles = getRoleSummaries()

  // Define commands
  const commands = useMemo((): CommandItem[] => {
    const navCommands: CommandItem[] = [
      {
        id: 'home',
        label: 'Go to Home',
        description: 'Return to the homepage',
        icon: Home,
        action: () => router.push('/'),
        keywords: ['home', 'start', 'main'],
        category: 'navigation',
      },
      {
        id: 'browse',
        label: 'Browse Roles',
        description: 'Explore all career paths',
        icon: Compass,
        action: () => router.push('/browse'),
        keywords: ['browse', 'explore', 'roles', 'careers'],
        category: 'navigation',
      },
      {
        id: 'quiz',
        label: 'Take the Quiz',
        description: 'Find your career match',
        icon: Target,
        action: () => router.push('/quiz'),
        keywords: ['quiz', 'test', 'find', 'match', 'personality'],
        category: 'navigation',
      },
      {
        id: 'compare',
        label: 'Compare Roles',
        description: `${selectedRoles.length}/3 roles selected`,
        icon: GitCompare,
        action: () => router.push('/compare'),
        keywords: ['compare', 'comparison', 'vs'],
        category: 'navigation',
      },
    ]

    const actionCommands: CommandItem[] = [
      {
        id: 'toggle-theme',
        label: resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        description: 'Toggle between light and dark theme',
        icon: resolvedTheme === 'dark' ? Sun : Moon,
        action: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
        keywords: ['theme', 'dark', 'light', 'mode', 'toggle'],
        category: 'actions',
      },
    ]

    // Only show clear comparison if there are roles selected
    if (selectedRoles.length > 0) {
      actionCommands.push({
        id: 'clear-comparison',
        label: 'Clear Comparison',
        description: `Remove ${selectedRoles.length} role${selectedRoles.length > 1 ? 's' : ''} from comparison`,
        icon: Trash2,
        action: () => {
          clearComparisonWithToast()
        },
        keywords: ['clear', 'remove', 'comparison', 'reset'],
        category: 'actions',
      })
    }

    // Role search commands
    const roleCommands: CommandItem[] = roles.map((role) => ({
      id: `role-${role.roleId}`,
      label: role.roleName,
      description: categoryLabels[role.category],
      icon: getRoleIcon(role.roleId, role.category),
      action: () => router.push(`/role/${role.roleId}`),
      keywords: [
        role.roleName.toLowerCase(),
        role.category,
        ...role.description.split(' ').slice(0, 5),
      ],
      category: 'roles' as const,
    }))

    return [...navCommands, ...actionCommands, ...roleCommands]
  }, [router, selectedRoles.length, resolvedTheme, setTheme, roles])

  // Filter commands based on search
  const filteredCommands = useMemo(() => {
    if (!search.trim()) {
      // Show navigation and actions first, then top 5 roles
      const navAndActions = commands.filter((c) => c.category !== 'roles')
      const topRoles = commands.filter((c) => c.category === 'roles').slice(0, 5)
      return [...navAndActions, ...topRoles]
    }

    const query = search.toLowerCase()
    return commands.filter((cmd) => {
      const matchLabel = cmd.label.toLowerCase().includes(query)
      const matchDescription = cmd.description?.toLowerCase().includes(query)
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(query))
      return matchLabel || matchDescription || matchKeywords
    })
  }, [commands, search])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filteredCommands.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = filteredCommands[selectedIndex]
        if (selected) {
          selected.action()
          setOpen(false)
          setSearch('')
        }
      }
    },
    [filteredCommands, selectedIndex]
  )

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // CMD/CTRL + K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: { [key: string]: CommandItem[] } = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) {
        groups[cmd.category] = []
      }
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  const categoryLabelsMap: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Actions',
    roles: 'Roles',
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden" showCloseButton={false}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center border-b px-4">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search roles, navigate, or take actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-4 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono text-muted-foreground bg-muted rounded border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No results found for &quot;{search}&quot;
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {categoryLabelsMap[category]}
                </div>
                {items.map((cmd) => {
                  const globalIndex = filteredCommands.indexOf(cmd)
                  const isSelected = globalIndex === selectedIndex
                  const Icon = cmd.icon

                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action()
                        setOpen(false)
                        setSearch('')
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-lg shrink-0',
                          isSelected ? 'bg-primary-foreground/20' : 'bg-muted'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{cmd.label}</div>
                        {cmd.description && (
                          <div
                            className={cn(
                              'text-xs truncate',
                              isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            )}
                          >
                            {cmd.description}
                          </div>
                        )}
                      </div>
                      {isSelected && <ArrowRight className="w-4 h-4 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded border">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded border">↵</kbd>
              to select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-muted rounded border">K</kbd>
            to toggle
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
