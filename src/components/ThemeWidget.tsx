'use client'

import { Palette, Sun, Moon, Monitor, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTheme, COLOR_SCHEMES } from './ThemeProvider'
import { cn } from '@/lib/utils'

export function ThemeWidget() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-lg transition-colors relative group',
            'hover:bg-muted text-muted-foreground hover:text-foreground'
          )}
          aria-label="Customize appearance"
        >
          <Palette className="w-5 h-5" />
          <span
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-background"
            style={{ backgroundColor: COLOR_SCHEMES.find(s => s.id === colorScheme)?.colors.primary }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4"
        align="end"
        sideOffset={8}
      >
        <div className="space-y-6">
          {/* Theme Mode Toggle */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mode
            </h4>
            <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border border-border/50">
              {[
                { value: 'light', icon: Sun, label: 'Light' },
                { value: 'dark', icon: Moon, label: 'Dark' },
                { value: 'system', icon: Monitor, label: 'System' },
              ].map((mode) => {
                const Icon = mode.icon
                const isActive = theme === mode.value
                return (
                  <button
                    key={mode.value}
                    onClick={() => setTheme(mode.value as any)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    )}
                    aria-label={mode.label}
                  >
                    <Icon className="w-4 h-4" />
                    {isActive && <span className="text-xs">{mode.label}</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Color Schemes */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Vibe
            </h4>
            <div className="grid gap-2">
              {COLOR_SCHEMES.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setColorScheme(scheme.id)}
                  className={cn(
                    'group relative w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border text-left',
                    colorScheme === scheme.id
                      ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20'
                      : 'bg-transparent border-transparent hover:bg-muted/50 hover:border-border/50'
                  )}
                >
                  <div className="flex items-center gap-1.5 pl-1">
                    <span
                      className="w-5 h-5 rounded-full shadow-sm ring-2 ring-background transition-transform group-hover:scale-110"
                      style={{ backgroundColor: scheme.colors.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full shadow-sm -ml-2.5 ring-2 ring-background transition-transform group-hover:scale-110"
                      style={{ backgroundColor: scheme.colors.accent }}
                      />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                         colorScheme === scheme.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {scheme.description}
                      </span>
                      {colorScheme === scheme.id && (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
