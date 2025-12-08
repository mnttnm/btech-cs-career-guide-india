'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, GitCompare, Target, Menu, X, Compass } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useComparisonStore } from '@/stores/useComparisonStore'
import { ThemeWidget } from './ThemeWidget'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/browse', label: 'Explore', icon: Search },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/quiz', label: 'Find Fit', icon: Target },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { selectedRoles } = useComparisonStore()

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass border-b-0">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors">
              CareerGuide
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              const showBadge = item.href === '/compare' && selectedRoles.length > 0

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
                  {item.label}
                  {showBadge && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1 text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-sm animate-fade-up",
                        selectedRoles.length >= 3
                          ? "bg-amber-500 text-white"
                          : "bg-primary text-primary-foreground"
                      )}
                      title={selectedRoles.length >= 3 ? "Comparison full" : `${selectedRoles.length} selected`}
                    >
                      {selectedRoles.length}
                    </span>
                  )}
                </Link>
              )
            })}
            <div className="ml-2 pl-2 border-l border-border/50 flex items-center gap-1">
              <ThemeWidget />
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-bottom pb-safe">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const showBadge = item.href === '/compare' && selectedRoles.length > 0

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className={cn("w-5 h-5", isActive && "animate-scale-in")} />
                <span className="text-xs font-medium">{item.label}</span>
                {showBadge && (
                  <span
                    className={cn(
                      "absolute top-0 right-3 text-[10px] min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(var(--primary),0.5)]",
                      selectedRoles.length >= 3
                        ? "bg-amber-500 text-white"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {selectedRoles.length}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary text-primary-foreground">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">CareerGuide</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeWidget />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-xl pt-14"
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="p-4 space-y-2Container"
            >
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                    >
                      <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
