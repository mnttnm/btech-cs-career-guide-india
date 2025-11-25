import {
  Code,
  Database,
  Cloud,
  Shield,
  TestTube,
  Palette,
  Users,
  Cpu,
  Briefcase,
  PenTool,
  Compass,
  type LucideIcon,
  // Role-specific icons
  Layout,
  Server,
  Smartphone,
  Gamepad2,
  Globe,
  Binary,
  Brain,
  LineChart,
  BarChart3,
  Workflow,
  GitBranch,
  Container,
  Network,
  Lock,
  Bug,
  Search,
  ClipboardCheck,
  Lightbulb,
  Target,
  Building2,
  Layers,
  Boxes,
  Glasses,
  Zap,
  Bot,
  Blocks,
  Rocket,
  TrendingUp,
  FileText,
  MessageSquare,
  GraduationCap,
  Wrench,
} from 'lucide-react'

import type { Category } from '@/types/role'

// Category to icon mapping
export const categoryIcons: Record<Category, LucideIcon> = {
  software: Code,
  data: Database,
  cloud: Cloud,
  security: Shield,
  quality: TestTube,
  product: Palette,
  consulting: Users,
  emerging: Cpu,
  hybrid: Briefcase,
  content: PenTool,
  alternative: Compass,
}

// Category display names
export const categoryLabels: Record<Category, string> = {
  software: 'Software Engineering',
  data: 'Data & AI',
  cloud: 'Cloud & DevOps',
  security: 'Security',
  quality: 'Quality Assurance',
  product: 'Product & Design',
  consulting: 'Consulting & Architecture',
  emerging: 'Emerging Tech',
  hybrid: 'Business & Tech',
  content: 'Content & Community',
  alternative: 'Alternative Paths',
}

// Role ID to icon mapping (replaces emojis)
export const roleIcons: Record<string, LucideIcon> = {
  // Software Engineering
  'frontend-engineer-developer': Layout,
  'backend-engineer-developer': Server,
  'full-stack-engineer-developer': Layers,
  'mobile-app-developer': Smartphone,
  'game-developer': Gamepad2,
  'web-developer': Globe,
  'embedded-systems-engineer': Binary,

  // Data & AI
  'data-scientist': Brain,
  'data-analyst': LineChart,
  'data-engineer': Database,
  'machine-learning-engineer': Brain,
  'ai-engineer': Bot,
  'business-intelligence-analyst': BarChart3,
  'nlp-engineer': MessageSquare,

  // Cloud & DevOps
  'devops-engineer': Workflow,
  'cloud-engineer': Cloud,
  'site-reliability-engineer': Network,
  'platform-engineer': Boxes,
  'infrastructure-engineer': Container,

  // Security
  'security-analyst': Shield,
  'security-engineer': Lock,
  'penetration-tester': Bug,

  // Quality Assurance
  'qa-engineer': TestTube,
  'automation-test-engineer': ClipboardCheck,

  // Product & Design
  'product-manager': Target,
  'ux-designer': Palette,
  'ui-designer': Layout,
  'ux-researcher': Search,

  // Consulting & Architecture
  'solutions-architect': Building2,
  'technical-consultant': Briefcase,
  'enterprise-architect': Layers,

  // Emerging Tech
  'blockchain-developer': Blocks,
  'ar-vr-developer': Glasses,
  'iot-developer': Cpu,
  'quantum-computing-researcher': Zap,

  // Business & Tech
  'technical-project-manager': Target,
  'scrum-master': Users,
  'business-analyst': TrendingUp,

  // Content & Community
  'technical-writer': FileText,
  'developer-advocate': MessageSquare,

  // Alternative Paths
  'freelance-developer': Rocket,
  'startup-founder': Lightbulb,
  'open-source-contributor': GitBranch,
  'coding-instructor': GraduationCap,
  'tech-support-engineer': Wrench,
}

// Get icon for a role by ID, with fallback to category icon
export function getRoleIcon(roleId: string, category: Category): LucideIcon {
  return roleIcons[roleId] || categoryIcons[category] || Code
}

// Get icon for a category
export function getCategoryIcon(category: Category): LucideIcon {
  return categoryIcons[category] || Compass
}

// Difficulty level colors (semantic)
export const difficultyColors: Record<string, { bg: string; text: string; label: string }> = {
  Easy: {
    bg: 'bg-success-subtle',
    text: 'text-success',
    label: 'Easy',
  },
  Moderate: {
    bg: 'bg-warning-subtle',
    text: 'text-warning',
    label: 'Moderate',
  },
  Hard: {
    bg: 'bg-[#f97316]/10',
    text: 'text-[#f97316]',
    label: 'Hard',
  },
  Steep: {
    bg: 'bg-error-subtle',
    text: 'text-error',
    label: 'Steep',
  },
}

// Stress level colors (semantic)
export const stressColors: Record<string, { bg: string; text: string }> = {
  Low: {
    bg: 'bg-success-subtle',
    text: 'text-success',
  },
  'Low-Medium': {
    bg: 'bg-success-subtle',
    text: 'text-success',
  },
  Medium: {
    bg: 'bg-warning-subtle',
    text: 'text-warning',
  },
  'Medium-High': {
    bg: 'bg-[#f97316]/10',
    text: 'text-[#f97316]',
  },
  High: {
    bg: 'bg-error-subtle',
    text: 'text-error',
  },
}
