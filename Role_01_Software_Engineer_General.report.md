# Extraction Report for Role_01_Software_Engineer_General (Schema V2)

## Ambiguities & Decisions

### Skills Mapping
- **Languages:**
    - Mapped "Mandatory (at least 2)" languages (Java, Python, C++, etc.) to `category: "core"`, `proficiency: "advanced"`, `priority: "high"`, and `recommendedCountGroup: "pick-2-from-core"`.
    - Mapped "Good to have" languages (TypeScript, Rust, etc.) to `category: "recommended"`, `proficiency: "intermediate"`, `priority: "medium"`.
    - Mapped "SQL" to `category: "core"`, `priority: "high"`.
- **Frameworks:**
    - The original "Required Skills" section listed frameworks by type (Testing, Build Tools) but didn't explicitly list application frameworks like Spring Boot or React there. I extracted these from the "Year 2" strategy section and the "First Job Strategy" section to populate the `backend` and `frontend` arrays in the schema.
    - Inferred `popularity: "high"` for major frameworks (Spring Boot, React, Django) and `popularity: "standard"` for testing/DevOps tools.

### Salary Ranges
- **Experience Buckets:** Created three buckets matching the source text: "fresher" (0-1 year), "threeYears" (3 years), and "fivePlus" (5+ years).
- **Startups:** The source text had a specific range for "Startups (early-stage)" for freshers. This was mapped to the `startups` field in the `fresher` bucket. For other buckets where it wasn't specified, it was set to `null`.
- **Top Companies:** The source provided two distinct ranges for top companies (Fresher and 5+ Years). These were mapped to the `salaryByExperience` array for each company entry.

### Learning Curve
- **Details:** Mapped the bullet points for "What makes it moderate", "Timeline breakdown", and "Key challenges" to the `details` object in the new schema.

## Content Moves
- **Company Lists:** The extensive list of companies (FAANG, Unicorns, etc.) was mapped to the `companiesHiring` object, categorized by the keys provided in the new schema (`faangAndTopProduct`, `unicornsAndHighGrowth`, etc.).
