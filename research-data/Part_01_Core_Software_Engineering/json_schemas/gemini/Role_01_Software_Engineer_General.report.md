# Extraction Report for Role_01_Software_Engineer_General

## Ambiguities & Decisions

### Salary Ranges
- **Issue:** The Markdown provided salary ranges for "Top Companies" for both "Fresher" and "5+ Years" (e.g., "Google: ₹18-25 LPA (fresher), ₹30-60 LPA (5+ years)"). The schema for `salaryRanges.topCompanies` allows only a single range per company.
- **Decision:** I mapped the **Fresher** salary range to the main schema (`salaryRanges.topCompanies`), as this is most relevant for entry-level candidates. The **Experienced (5+ years)** ranges were preserved in `extra.salaryRanges_topCompanies_experienced`.
- **Issue:** "Average" salary for "5+ Years Experience" was not explicitly provided in the specific Salary Ranges section.
- **Decision:** Set `min` and `max` to `null` for `salaryRanges.fivePlus.average` and flagged it in metadata.
- **Issue:** A specific "Startups (early-stage)" salary range (₹4-8 LPA) was listed for freshers but does not have a dedicated key in the standard schema (which has service, product, topTech, average).
- **Decision:** Moved this data to `extra.salaryRanges_startups_fresher`.
- **Issue:** "Principal/Architect" salary (40-60+ LPA) was listed separately from the standard "5+ Years" breakdown.
- **Decision:** This high-level range was not merged into the standard `fivePlus` categories (which covered up to Staff/Lead level) to avoid skewing the data. It remains in the text content or implicitly covered by the "Senior Level" career progression.

### Skills & Frameworks
- **Issue:** The "Required Skills" section listed frameworks primarily as categories (e.g., "Testing Frameworks: JUnit..."). It did not list application frameworks (like Spring Boot, React) in the main list.
- **Decision:** I extracted specific application frameworks from the "Year 2 (Deepening)" strategy section where they were explicitly recommended (Spring Boot, Django, React, etc.) to populate the `frameworks` list more usefully.

### Companies Lists
- **Issue:** The Markdown contained a very detailed "Top Companies Hiring in India" section categorized by FAANG, Unicorns, GCCs, etc. This does not map to the schema's `topCompanies` (which is for salary ranges).
- **Decision:** This entire dataset was moved to `extra.companiesHiring` to preserve the valuable list of companies without violating the schema structure.

## Content Moves & Merges
- **Location-Based Variations:** Moved to `extra.locationBasedVariations`.
- **Learning Curve Details:** The detailed breakdown ("What makes it moderate", "Timeline", "Key challenges") was moved to `extra.learningCurve_details` as the schema `learningCurve` object only supports `difficulty`, `timeToJobReady`, and `description`.
- **Interview Prep:** The Markdown had a nested list structure for interview prep. This was flattened into an array of strings for `firstJobStrategy.interviewPrep` to fit the schema.

## Dropped Content
- No significant content was dropped. All factual data points were mapped either to schema fields or `extra` fields.
