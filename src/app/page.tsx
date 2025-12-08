'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Target, Compass, TrendingUp, Map, Sparkles, Clock, GitCompareArrows, GraduationCap, IndianRupee, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoleCard } from '@/components/RoleCard'
import { QuickPicks } from '@/components/QuickPicks'
import { getPopularRoles, getCategoriesWithCounts, getRoleSummaries } from '@/data/roles'
import { getCategoryIcon } from '@/lib/icons'
import { useRecentlyViewedStore } from '@/stores/useRecentlyViewedStore'
import { SuccessFormula } from '@/components/SuccessFormula'

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


      {/* Value Proposition Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mb-16 md:text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-balance"
            >
              Because &ldquo;just get a job&rdquo; <br className="hidden md:block" />
              <span className="text-primary">isn&apos;t a career plan</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              We built this for students who want clarity, not just another list of job titles.
              Discover paths that actually match who you are.
            </motion.p>
          </div>

          {/* Redesigned Bento Grid - Compact & Editorial */}
          <div className="max-w-5xl mx-auto">
            {/* Main Grid - Asymmetric Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              
              {/* Hero Tile - Personality Match */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="md:row-span-2 group relative overflow-hidden"
              >
                <div className="relative h-full p-6 md:p-8 rounded-3xl bg-gradient-to-br from-primary/[0.08] via-primary/[0.04] to-transparent border border-primary/10 hover:border-primary/25 transition-all duration-500">
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300">
                      <Target className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
                      Personality-First Matching
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                      Find careers that fit how you think, not just what you studied. Our quiz analyzes your strengths to surface the best matches.
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-background/60 border border-border/50 text-xs font-medium text-muted-foreground">
                        Introvert / Extrovert
                      </span>
                      <span className="px-3 py-1.5 rounded-full bg-background/60 border border-border/50 text-xs font-medium text-muted-foreground">
                        Builder / Planner
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Salary Data Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <div className="h-full p-5 md:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/[0.06] to-transparent border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-1">Real Salary Data</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        ₹2.9L → ₹90L+ ranges from actual Indian companies
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Compare Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.16, duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <div className="h-full p-5 md:p-6 rounded-3xl bg-gradient-to-br from-blue-500/[0.06] to-transparent border border-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <GitCompareArrows className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-1">Compare Side-by-Side</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Head-to-head on stress, growth, and pay
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4-Year Roadmap Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.24, duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <div className="h-full p-5 md:p-6 rounded-3xl bg-gradient-to-br from-amber-500/[0.06] to-transparent border border-amber-500/10 hover:border-amber-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-1">4-Year College Roadmap</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Year-by-year strategy from Day 1 to placement
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Clear Roadmaps Tile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.32, duration: 0.5, ease: "easeOut" }}
                className="group"
              >
                <div className="h-full p-5 md:p-6 rounded-3xl bg-gradient-to-br from-violet-500/[0.06] to-transparent border border-violet-500/10 hover:border-violet-500/20 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
                      <Map className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold mb-1">Clear Skill Roadmaps</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        What to learn, build, and prepare for each role
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Stat Bar - Comprehensive Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              className="mt-4 md:mt-5"
            >
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-muted/40 border border-border/50">
                <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                <p className="text-sm font-medium text-muted-foreground">
                  <span className="text-foreground">45 career paths</span>
                  {' • '}
                  <span className="text-foreground">11 tracks</span>
                  {' • '}
                  <span className="text-foreground">100% India-focused</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Picks Section */}
      <QuickPicks />

      {/* Popular Roles Section */}
      {/* <section className="container mx-auto px-4 py-20">
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
      </section> */}


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
              Not sure what fits you?
            </h2>

            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
              Most students don&apos;t know — that&apos;s normal. The quiz helps you narrow 45+ options down to 3-5 that actually make sense for you.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 h-12 px-8 text-base shadow-xl hover:shadow-2xl transition-shadow"
            >
              <Link href="/quiz">
                Take the Quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* <SuccessFormula /> */}

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
