# Conversion Report — Role_01_Software_Engineer_General.md

Date: 2025-11-23
Extractor: Warp Agent
Source: BTech_Roles_Research/Part_01_Core_Software_Engineering/Role_01_Software_Engineer_General.md
Outputs:
- Role_01_Software_Engineer_General.md.json
- Role_01_Software_Engineer_General.md.meta.json

## Approach
Manual mapping of every section and list into the canonical schema. Salaries normalized to numeric min/max in LPA. Non-schema content placed under `extra` with structure preserved.

## Key Mappings
- difficulty → "Entry-Level Friendly"; remaining sentence placed in description.
- jobTitles → split into fresher vs experienced exactly as listed. Acronyms (SDE, MTS, SMTS, GET) retained as-is.
- skills.programmingLanguages → mandatory list marked `level=mandatory, priority=high`; SQL set to `proficient` with `priority=high`; optional languages marked `good to have`.
- skills.frameworks → included app frameworks mentioned across the doc (React, Spring Boot, Django, Flask, Express) plus testing frameworks; rationale: schema requires frameworks array; testing libs commonly treated as frameworks.
- skills.tools → IDEs, VCS, build tools, CI/CD, Docker, Agile/Scrum, PM tools, documentation and code quality tools.
- dailyWork → 20 bullet items mapped directly.
- careerProgression.timeline → three tiers with years and salary ranges parsed.
- salaryRanges → fresher, threeYears mapped exactly; fivePlus average missing in source so set to null; startups and 3Y top-tech captured in `extra.salaryNotes`.
- learningCurve → difficulty, time window, and descriptive paragraph captured; sublists summarized into description and collegeStrategy.
- stressLevel → factors and mitigating factors extracted; work-life balance in `extra.workLifeBalance`.
- personalityFit → thriveIf, avoidIf, idealBackground lists mapped.
- collegeStrategy → Year 1–4 mapped with titles and flattened goals; nested bullets concatenated inline to keep context.
- firstJobStrategy → technicalPrep (DSA, system design, projects, resume, certifications), applicationStrategy (campus, off-campus, referrals, startups, mass hiring), interviewPrep (six blocks), salaryExpectations normalized, differentiators captured.
- Top companies lists and location deltas placed under `extra.topCompaniesHiring` and `extra.locationVariations` respectively.

## Ambiguities and Decisions
1. FivePlus average salary
   - Source: lines 147–151 had tiered figures but no explicit average.
   - Decision: `fivePlus.average` set to `{min:null,max:null}` to avoid fabrication. Added meta warning.

2. Startups "₹4–8 LPA + equity" (fresher)
   - Source: line 137.
   - Decision: Equity is non-numeric; numeric portion parsed; equity captured in `extra.salaryNotes.fresherStartups.note`. Added meta warning.

3. Mandatory programming languages statement "at least 2" from a set
   - Source: lines 40–43.
   - Decision: Represented each as separate entries with `level=mandatory`; the schema cannot encode cardinality constraints. Added meta note.

4. Frameworks vs tools separation
   - Issue: Testing libraries appeared under Frameworks & Tools; app frameworks appear later in college plan.
   - Decision: Populated `frameworks` with both app and testing frameworks; tools kept for IDEs, CI/CD, etc. Rationale explained here.

5. Top Companies by Salary — two experience brackets per company
   - Source: lines 153–161.
   - Constraint: schema `salaryRanges.topCompanies` supports a single range per company.
   - Decision: Used fresher ranges in `topCompanies`; stored 5+ ranges in `extra.topCompaniesExperiencedRanges` with explicit experience tag. Added meta warning.

6. Acronyms (SDE, MTS, SMTS, GET)
   - Decision: Kept verbatim per rules; noted here for reviewer consideration.

7. 3 Years "Top tech companies" (₹15–22 LPA)
   - Constraint: schema has no key for `threeYears.topTech`.
   - Decision: Placed under `extra.salaryNotes.threeYearsTopTech`.

## Validation
- JSON parses and conforms to required keys.
- All salary fields use numeric min/max (or null when truly missing).
- Arrays preserved for titles, skills, and lists.
- collegeStrategy.years are numeric (1–4).
- Linter: formatted with 2-space indent; jq check passed locally (no changes needed).

## Dropped/Consolidated Content
- None dropped; long explanatory sentences summarized in description fields where appropriate and duplicated context avoided.

## Follow-ups
- If reviewers want explicit expansion for acronyms (e.g., SDE → Software Development Engineer), we can add aliases in `extra` while keeping originals.
- If an average for fivePlus is desired, provide guidance (e.g., compute midpoints) — currently left null to avoid assumptions.
