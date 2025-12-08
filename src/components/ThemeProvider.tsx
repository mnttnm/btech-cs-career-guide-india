'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ColorScheme = 'indigo' | 'ocean' | 'sage'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const COLOR_SCHEMES: { id: ColorScheme; name: string; description: string; colors: { primary: string; accent: string } }[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    description: 'Classic & professional',
    colors: { primary: '#4f46e5', accent: '#6366f1' }
  },
  {
    id: 'ocean',
    name: 'Ocean & Coral',
    description: 'Fresh & approachable',
    colors: { primary: '#0ea5e9', accent: '#f97316' }
  },
  {
    id: 'sage',
    name: 'Sage & Slate',
    description: 'Calm & trustworthy',
    colors: { primary: '#10b981', accent: '#6366f1' }
  }
]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('sage')

  useEffect(() => {
    // Get stored preferences
    const storedTheme = localStorage.getItem('theme') as Theme | null
    const storedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null

    if (storedTheme) {
      setTheme(storedTheme)
    }
    if (storedColorScheme) {
      setColorScheme(storedColorScheme)
    }
  }, [])

  // Handle light/dark theme
  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark')
        setResolvedTheme('dark')
      } else {
        root.classList.remove('dark')
        setResolvedTheme('light')
      }
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      applyTheme(mediaQuery.matches)

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches)
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      applyTheme(theme === 'dark')
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  // Handle color scheme
  useEffect(() => {
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove('theme-indigo', 'theme-ocean', 'theme-sage')

    // Add the current color scheme class
    root.classList.add(`theme-${colorScheme}`)

    localStorage.setItem('colorScheme', colorScheme)
  }, [colorScheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
