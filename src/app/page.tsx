'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Compass, Scale, Map, Sparkles, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoleCard } from '@/components/RoleCard'
import { getPopularRoles, getCategoriesWithCounts, getRoleSummaries } from '@/data/roles'
import { getCategoryIcon } from '@/lib/icons'
import { useRecentlyViewedStore } from '@/stores/useRecentlyViewedStore'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  },
}

export default function HomePage() {
  const popularRoles = getPopularRoles()
  const categories = getCategoriesWithCounts()
  const { recentRoleIds } = useRecentlyViewedStore()

  // Get recently viewed roles (only valid ones) as RoleSummary
  const allRoleSummaries = getRoleSummaries()
  const recentlyViewedRoles = recentRoleIds
    .map((id) => allRoleSummaries.find((r) => r.roleId === id))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[var(--accent-brand,var(--brand))]/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--brand-subtle),transparent_50%)]" />

        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              45+ Career Paths for B.Tech Students
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance"
            >
              Find the tech career that fits{' '}
              <span className="bg-gradient-to-r from-primary to-[var(--accent-brand,var(--brand-hover))] bg-clip-text text-transparent">
                who you are
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Explore career paths with real salary data, compare your options,
              and get a personalized roadmap based on your personality.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="gap-2 h-12 px-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                <Link href="/quiz">
                  <Target className="w-5 h-5" />
                  Take the 2-minute quiz
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 h-12 px-6 text-base">
                <Link href="/browse">
                  Explore all paths
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Credibility */}
            <motion.p
              variants={itemVariants}
              className="mt-10 text-sm text-muted-foreground"
            >
              Based on 2024 salary data from 50+ companies in India
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Recently Viewed Section */}
      {recentlyViewedRoles.length > 0 && (
        <section className="container mx-auto px-4 pt-12 pb-8">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentlyViewedRoles.map((role, index) => (
              <RoleCard key={role!.roleId} role={role!} variant="compact" index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Roles Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Roles</h2>
            <p className="text-muted-foreground">
              Most explored career paths by students
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/browse">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {popularRoles.map((role, index) => (
            <RoleCard key={role.roleId} role={role} index={index} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent" />

        <div className="container relative mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Explore by domain
            </h2>
            <p className="text-muted-foreground">
              {categories.reduce((acc, c) => acc + c.count, 0)} roles across{' '}
              {categories.length} domains
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {categories.map((cat, index) => {
              const CategoryIcon = getCategoryIcon(cat.category)
              return (
                <motion.div
                  key={cat.category}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link href={`/browse?category=${cat.category}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative p-5 rounded-2xl bg-card border overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30"
                    >
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--brand-subtle),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative">
                        <motion.div
                          className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors mb-4"
                          whileHover={{ scale: 1.05, rotate: 3 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CategoryIcon className="w-6 h-6 text-primary" />
                        </motion.div>
                        <div className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {cat.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {cat.count} roles
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground">
            Three steps to find your fit
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Take the quiz',
              description:
                'Answer 12 quick questions about your interests, work style, and values.',
              icon: Target,
            },
            {
              step: '02',
              title: 'Compare paths',
              description:
                'See side-by-side comparisons of salary, skills, stress, and growth.',
              icon: Scale,
            },
            {
              step: '03',
              title: 'Get your roadmap',
              description:
                'Follow a year-by-year action plan tailored to your current year.',
              icon: Map,
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center group"
              >
                {/* Connection line between steps (hidden on mobile) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/20 to-transparent" />
                )}

                <motion.div
                  className="relative flex items-center justify-center w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 group-hover:bg-primary/15 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[var(--accent-brand,var(--brand-hover))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.1),transparent_50%)]" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-primary-foreground">
              Ready to find your path?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
              It only takes 2 minutes to discover which tech careers match your personality.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 h-12 px-8 text-base shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Link href="/quiz">
                Start the quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Compass className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold">CareerGuide</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built for Indian B.Tech students
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/browse" className="hover:text-foreground transition-colors">
                Explore Careers
              </Link>
              <Link href="/quiz" className="hover:text-foreground transition-colors">
                Find Your Fit
              </Link>
              <Link href="/compare" className="hover:text-foreground transition-colors">
                Compare Paths
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
