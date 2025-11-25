/**
 * Motion Design System
 * Centralized animation constants for consistent, physics-based motion
 */

// Spring configurations for Framer Motion
export const springs = {
  // Snappy, minimal overshoot - buttons, small elements
  snappy: { type: 'spring' as const, stiffness: 400, damping: 30 },

  // Smooth, no overshoot - modals, panels
  smooth: { type: 'spring' as const, stiffness: 300, damping: 30 },

  // Bouncy, playful - toasts, badges, success states
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15 },

  // Gentle, slow settle - page transitions
  gentle: { type: 'spring' as const, stiffness: 200, damping: 20 },
}

// Stagger timing for list animations (in seconds)
export const stagger = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
}

// Duration presets (in seconds)
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
}

// Easing curves (cubic-bezier values as tuples)
export const easings = {
  // Quick start, smooth finish - elements entering
  easeOut: [0.16, 1, 0.3, 1] as const,

  // Slight overshoot - playful entrances
  easeOutBack: [0.34, 1.56, 0.64, 1] as const,

  // Smooth deceleration
  easeOutQuint: [0.22, 1, 0.36, 1] as const,
}

// Common animation variants for Framer Motion
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
}

export const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.smooth
  },
}

export const slideInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy
  },
}

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy
  },
}

// Staggered container variant
export const staggerContainer = (staggerTime = stagger.normal) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
    },
  },
})

// Staggered child variant
export const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
}

// Hover animations
export const hoverLift = {
  rest: { y: 0 },
  hover: { y: -4 },
}

export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
}

// Press animation for buttons
export const pressScale = {
  rest: { scale: 1 },
  pressed: { scale: 0.98 },
}

// Glow effect animation
export const glowPulse = {
  initial: { opacity: 0 },
  animate: {
    opacity: [0, 0.5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
