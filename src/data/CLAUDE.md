# CLAUDE.md

Data layer for career roles and quiz system.

## Role Data

45 JSON files in `roles/` directory, one per career path. Each follows the `Role` interface from `@/types/role.ts`.

### Role Structure

Key fields in each role JSON:
- `roleId`, `roleName`, `description`, `category`, `icon`
- `jobTitles`: fresher and experienced variants
- `skills`: programming languages, frameworks, tools, core concepts
- `careerProgression`: timeline, tracks (leadership/IC), alternative paths
- `salaryRanges`: fresher, 3-year, 5+ years, top companies
- `learningCurve`: difficulty level, time to job-ready
- `stressLevel`: level + factors
- `personalityFit`: thrive if / avoid if
- `collegeStrategy`: year-by-year goals
- `firstJobStrategy`: prep and interview tips

### Categories

11 role categories: software, data, cloud, security, quality, product, consulting, emerging, hybrid, content, alternative

## Files

- **roles.ts**: Role loading utilities, category definitions, helper functions
- **quiz.ts**: 12 questions with weighted scoring, result calculation logic
- **roles/*.json**: Individual role data files
