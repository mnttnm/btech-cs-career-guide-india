'use client'

import { Palette, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTheme, COLOR_SCHEMES } from './ThemeProvider'
import { cn } from '@/lib/utils'

export function ColorSchemeSelector() {
  const { colorScheme, setColorScheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'p-2 rounded-lg transition-colors relative group',
            'hover:bg-muted text-muted-foreground hover:text-foreground'
          )}
          aria-label="Change color scheme"
        >
          <Palette className="w-5 h-5" />
          <span
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: COLOR_SCHEMES.find(s => s.id === colorScheme)?.colors.primary }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-2"
        align="end"
        sideOffset={8}
      >
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">
            Color Scheme
          </p>
          {COLOR_SCHEMES.map((scheme) => (
            <motion.button
              key={scheme.id}
              onClick={() => setColorScheme(scheme.id)}
              className={cn(
                'w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left',
                colorScheme === scheme.id
                  ? 'bg-muted'
                  : 'hover:bg-muted/50'
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Color preview dots */}
              <div className="flex items-center gap-1">
                <span
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={{ backgroundColor: scheme.colors.primary }}
                />
                <span
                  className="w-4 h-4 rounded-full shadow-sm -ml-1.5"
                  style={{ backgroundColor: scheme.colors.accent }}
                />
              </div>

              {/* Label and description */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{scheme.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {scheme.description}
                </p>
              </div>

              {/* Check indicator */}
              <AnimatePresence>
                {colorScheme === scheme.id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
