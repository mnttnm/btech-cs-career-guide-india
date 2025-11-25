'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoleCard } from '@/components/RoleCard'
import { getPopularRoles, getCategoriesWithCounts } from '@/data/roles'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const popularRoles = getPopularRoles()
  const categories = getCategoriesWithCounts()

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="mb-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                <Sparkles className="w-3.5 h-3.5" />
                45+ Career Paths
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              Find Your Perfect{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Tech Career
              </span>{' '}
              in 5 Minutes
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Compare career paths with real salary data, take a personality quiz,
              and get a personalized roadmap. Built for Indian B.Tech students.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="gap-2 text-base">
                <Link href="/quiz">
                  <Target className="w-5 h-5" />
                  Take the Quiz
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base">
                <Link href="/browse">
                  Browse All Roles
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>15,000+ students</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Real salary data</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Roles Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Roles</h2>
            <p className="text-muted-foreground">
              Most explored career paths by students
            </p>
          </div>
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/browse">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {popularRoles.map((role) => (
            <motion.div key={role.roleId} variants={itemVariants}>
              <RoleCard role={role} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              {categories.reduce((acc, c) => acc + c.count, 0)} roles across{' '}
              {categories.length} categories
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
          >
            {categories.map((cat) => (
              <motion.div key={cat.category} variants={itemVariants}>
                <Link href={`/browse?category=${cat.category}`}>
                  <div className="group p-4 md:p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-md transition-all">
                    <div className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {cat.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {cat.count} roles
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">How It Works</h2>
          <p className="text-muted-foreground">
            Three simple steps to find your perfect career
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              step: '01',
              title: 'Take the Quiz',
              description:
                'Answer 12 quick questions about your interests, work style, and values.',
              icon: '🎯',
            },
            {
              step: '02',
              title: 'Compare Roles',
              description:
                'See side-by-side comparisons of salary, skills, stress, and growth.',
              icon: '⚖️',
            },
            {
              step: '03',
              title: 'Get Your Roadmap',
              description:
                'Follow a year-by-year action plan tailored to your current year.',
              icon: '🗺️',
            },
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="text-sm font-medium text-primary mb-2">
                Step {item.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Find Your Path?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of students who&apos;ve already discovered their ideal tech
            career. It only takes 5 minutes.
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="gap-2 text-base"
          >
            <Link href="/quiz">
              Start the Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎯</span>
              <span className="font-semibold">CareerGuide</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Built for Indian B.Tech students
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/browse" className="hover:text-foreground">
                Browse Roles
              </Link>
              <Link href="/quiz" className="hover:text-foreground">
                Take Quiz
              </Link>
              <Link href="/compare" className="hover:text-foreground">
                Compare
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
