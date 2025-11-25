import { Role, RoleSummary, Category } from '@/types/role'

/* eslint-disable @typescript-eslint/no-explicit-any */

// Import all role data
import frontendEngineer from './roles/frontend-engineer-developer.json'
import backendEngineer from './roles/backend-engineer-developer.json'
import fullStackEngineer from './roles/full-stack-engineer-developer.json'
import mobileDeveloper from './roles/mobile-developer.json'
import embeddedSystemsEngineer from './roles/embedded-systems-engineer.json'
import gameDeveloper from './roles/game-developer.json'
import softwareEngineerGeneral from './roles/software-engineer-general.json'

import dataScientist from './roles/data-scientist.json'
import dataAnalyst from './roles/data-analyst.json'
import dataEngineer from './roles/data-engineer.json'
import aiEngineer from './roles/ai-engineer.json'
import mlEngineer from './roles/machine-learning-engineer.json'
import mlopsEngineer from './roles/mlops-engineer.json'
import nlpCvSpecialist from './roles/nlp-cv-specialist.json'

import devopsEngineer from './roles/devops-engineer.json'
import sreEngineer from './roles/site-reliability-engineer.json'
import cloudEngineer from './roles/cloud-engineer-architect.json'
import platformEngineer from './roles/platform-engineer.json'
import infrastructureEngineer from './roles/infrastructure-it-engineer.json'

import cybersecurityAnalyst from './roles/cybersecurity-analyst.json'
import securityEngineer from './roles/security-engineer.json'
import penetrationTester from './roles/penetration-tester.json'

import qaEngineerSdet from './roles/qa-engineer-sdet.json'
import automationTestEngineer from './roles/automation-test-engineer.json'

import productManager from './roles/product-manager-technical.json'
import uxUiDesigner from './roles/ux-ui-designer.json'
import uxResearcher from './roles/ux-researcher.json'
import technicalProgramManager from './roles/technical-program-manager.json'

import solutionArchitect from './roles/solution-architect.json'
import enterpriseArchitect from './roles/enterprise-architect.json'
import itConsultant from './roles/it-consultant.json'

import blockchainDeveloper from './roles/blockchain-developer.json'
import iotDeveloper from './roles/iot-developer.json'
import arVrDeveloper from './roles/ar-vr-developer.json'
import quantumComputingEngineer from './roles/quantum-computing-engineer.json'

import businessAnalyst from './roles/business-analyst-technical.json'
import salesEngineer from './roles/sales-engineer.json'
import growthHacker from './roles/growth-hacker.json'

import technicalWriter from './roles/technical-writer.json'
import developerAdvocate from './roles/developer-advocate.json'

import researchScientist from './roles/research-scientist-industry.json'
import academicResearcher from './roles/academic-researcher.json'
import startupFounder from './roles/startup-founder.json'
import freelancer from './roles/freelancer.json'
import openSourceMaintainer from './roles/open-source-maintainer.json'

// Category and icon mappings
const categoryMap: Record<string, Category> = {
  'frontend-engineer-developer': 'software',
  'backend-engineer-developer': 'software',
  'full-stack-engineer-developer': 'software',
  'mobile-developer': 'software',
  'embedded-systems-engineer': 'software',
  'game-developer': 'software',
  'software-engineer-general': 'software',
  'data-scientist': 'data',
  'data-analyst': 'data',
  'data-engineer': 'data',
  'ai-engineer': 'data',
  'machine-learning-engineer': 'data',
  'mlops-engineer': 'data',
  'nlp-cv-specialist': 'data',
  'devops-engineer': 'cloud',
  'site-reliability-engineer': 'cloud',
  'cloud-engineer-architect': 'cloud',
  'platform-engineer': 'cloud',
  'infrastructure-it-engineer': 'cloud',
  'cybersecurity-analyst': 'security',
  'security-engineer': 'security',
  'penetration-tester': 'security',
  'qa-engineer-sdet': 'quality',
  'automation-test-engineer': 'quality',
  'product-manager-technical': 'product',
  'ux-ui-designer': 'product',
  'ux-researcher': 'product',
  'technical-program-manager': 'product',
  'solution-architect': 'consulting',
  'enterprise-architect': 'consulting',
  'it-consultant': 'consulting',
  'blockchain-developer': 'emerging',
  'iot-developer': 'emerging',
  'ar-vr-developer': 'emerging',
  'quantum-computing-engineer': 'emerging',
  'business-analyst-technical': 'hybrid',
  'sales-engineer': 'hybrid',
  'growth-hacker': 'hybrid',
  'technical-writer': 'content',
  'developer-advocate': 'content',
  'research-scientist-industry': 'alternative',
  'academic-researcher': 'alternative',
  'startup-founder': 'alternative',
  'freelancer': 'alternative',
  'open-source-maintainer': 'alternative',
}

const iconMap: Record<string, string> = {
  'frontend-engineer-developer': '🎨',
  'backend-engineer-developer': '⚙️',
  'full-stack-engineer-developer': '🔥',
  'mobile-developer': '📱',
  'embedded-systems-engineer': '🔌',
  'game-developer': '🎮',
  'software-engineer-general': '💻',
  'data-scientist': '🔬',
  'data-analyst': '📊',
  'data-engineer': '🔧',
  'ai-engineer': '🤖',
  'machine-learning-engineer': '🧠',
  'mlops-engineer': '⚡',
  'nlp-cv-specialist': '👁️',
  'devops-engineer': '🚀',
  'site-reliability-engineer': '🛡️',
  'cloud-engineer-architect': '☁️',
  'platform-engineer': '🏗️',
  'infrastructure-it-engineer': '🖥️',
  'cybersecurity-analyst': '🔒',
  'security-engineer': '🛡️',
  'penetration-tester': '🔓',
  'qa-engineer-sdet': '✅',
  'automation-test-engineer': '🤖',
  'product-manager-technical': '📋',
  'ux-ui-designer': '🎭',
  'ux-researcher': '🔍',
  'technical-program-manager': '📊',
  'solution-architect': '🏛️',
  'enterprise-architect': '🏢',
  'it-consultant': '💼',
  'blockchain-developer': '⛓️',
  'iot-developer': '📡',
  'ar-vr-developer': '🥽',
  'quantum-computing-engineer': '⚛️',
  'business-analyst-technical': '📈',
  'sales-engineer': '🤝',
  'growth-hacker': '📈',
  'technical-writer': '✍️',
  'developer-advocate': '🎤',
  'research-scientist-industry': '🔬',
  'academic-researcher': '🎓',
  'startup-founder': '🚀',
  'freelancer': '💻',
  'open-source-maintainer': '🌐',
}

// Category labels for display
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

// Helper function to add category and icon to role
function enrichRole(role: any): Role {
  const roleId = role.roleId || ''
  return {
    ...role,
    category: categoryMap[roleId] || 'software',
    icon: iconMap[roleId] || '💻',
  } as Role
}

// All roles with enriched data
export const allRoles: Role[] = [
  // Software Engineering
  enrichRole(frontendEngineer),
  enrichRole(backendEngineer),
  enrichRole(fullStackEngineer),
  enrichRole(mobileDeveloper),
  enrichRole(embeddedSystemsEngineer),
  enrichRole(gameDeveloper),
  enrichRole(softwareEngineerGeneral),
  // Data & AI
  enrichRole(dataScientist),
  enrichRole(dataAnalyst),
  enrichRole(dataEngineer),
  enrichRole(aiEngineer),
  enrichRole(mlEngineer),
  enrichRole(mlopsEngineer),
  enrichRole(nlpCvSpecialist),
  // Cloud & DevOps
  enrichRole(devopsEngineer),
  enrichRole(sreEngineer),
  enrichRole(cloudEngineer),
  enrichRole(platformEngineer),
  enrichRole(infrastructureEngineer),
  // Security
  enrichRole(cybersecurityAnalyst),
  enrichRole(securityEngineer),
  enrichRole(penetrationTester),
  // Quality Assurance
  enrichRole(qaEngineerSdet),
  enrichRole(automationTestEngineer),
  // Product & Design
  enrichRole(productManager),
  enrichRole(uxUiDesigner),
  enrichRole(uxResearcher),
  enrichRole(technicalProgramManager),
  // Consulting & Architecture
  enrichRole(solutionArchitect),
  enrichRole(enterpriseArchitect),
  enrichRole(itConsultant),
  // Emerging Tech
  enrichRole(blockchainDeveloper),
  enrichRole(iotDeveloper),
  enrichRole(arVrDeveloper),
  enrichRole(quantumComputingEngineer),
  // Business & Tech
  enrichRole(businessAnalyst),
  enrichRole(salesEngineer),
  enrichRole(growthHacker),
  // Content & Community
  enrichRole(technicalWriter),
  enrichRole(developerAdvocate),
  // Alternative Paths
  enrichRole(researchScientist),
  enrichRole(academicResearcher),
  enrichRole(startupFounder),
  enrichRole(freelancer),
  enrichRole(openSourceMaintainer),
]

// Get role by ID
export function getRoleById(roleId: string): Role | undefined {
  return allRoles.find((role) => role.roleId === roleId)
}

// Get roles by category
export function getRolesByCategory(category: Category): Role[] {
  return allRoles.filter((role) => role.category === category)
}

// Get role summaries (for grid/browse views)
export function getRoleSummaries(): RoleSummary[] {
  return allRoles.map((role) => ({
    roleId: role.roleId,
    roleName: role.roleName,
    description: role.description,
    category: role.category,
    icon: role.icon,
    difficulty: role.learningCurve?.difficulty || 'Moderate',
    stressLevel: role.stressLevel?.level || 'Medium',
    averageSalary: role.salaryRanges?.fresher?.average || { min: 4, max: 8 },
    timeToJobReady: role.learningCurve?.timeToJobReady || '6-12 months',
  }))
}

// Get popular roles (featured on homepage)
export function getPopularRoles(): RoleSummary[] {
  const popularIds = [
    'frontend-engineer-developer',
    'backend-engineer-developer',
    'data-scientist',
    'full-stack-engineer-developer',
    'devops-engineer',
    'product-manager-technical',
  ]
  return getRoleSummaries().filter((r) => popularIds.includes(r.roleId))
}

// Search roles
export function searchRoles(query: string): RoleSummary[] {
  const lowerQuery = query.toLowerCase()
  return getRoleSummaries().filter(
    (role) =>
      role.roleName.toLowerCase().includes(lowerQuery) ||
      role.description.toLowerCase().includes(lowerQuery)
  )
}

// Get all categories with role counts
export function getCategoriesWithCounts(): { category: Category; label: string; count: number }[] {
  const categories = Object.keys(categoryLabels) as Category[]
  return categories.map((category) => ({
    category,
    label: categoryLabels[category],
    count: allRoles.filter((r) => r.category === category).length,
  }))
}

// Filter roles
export interface RoleFilters {
  category?: Category
  difficulty?: string
  stressLevel?: string
  search?: string
}

export function filterRoles(filters: RoleFilters): RoleSummary[] {
  let roles = getRoleSummaries()

  if (filters.category) {
    roles = roles.filter((r) => r.category === filters.category)
  }

  if (filters.difficulty) {
    roles = roles.filter((r) => r.difficulty === filters.difficulty)
  }

  if (filters.stressLevel) {
    roles = roles.filter((r) => r.stressLevel === filters.stressLevel)
  }

  if (filters.search) {
    const lowerSearch = filters.search.toLowerCase()
    roles = roles.filter(
      (r) =>
        r.roleName.toLowerCase().includes(lowerSearch) ||
        r.description.toLowerCase().includes(lowerSearch)
    )
  }

  return roles
}
