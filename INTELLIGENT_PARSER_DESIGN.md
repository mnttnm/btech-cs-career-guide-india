# Intelligent Markdown Parser Design

## Algorithm Overview

### Phase 1: Pattern Detection
```
For each markdown file:
  1. Detect pattern type (1-6) based on structure analysis
  2. Select appropriate extraction strategy
  3. Track confidence level for each extraction
```

### Phase 2: Multi-Strategy Extraction
```
For each field:
  Strategy 1 → Try primary pattern-specific extractor
  ↓ (if fails)
  Strategy 2 → Try alternative pattern extractors
  ↓ (if fails)
  Strategy 3 → Try fuzzy matching / heuristics
  ↓ (if fails)
  Strategy 4 → Manual conversion for specific files
  ↓ (if fails)
  Mark as MISSING with detailed reason
```

### Phase 3: Extraction Tracking
```
For each file, track:
  - fields_extracted: [list of successfully extracted fields]
  - fields_skipped: [list with reasons]
  - extraction_confidence: { field: "high|medium|low" }
  - pattern_detected: "Pattern 1-6"
  - fallback_used: boolean
```

## Pattern-Specific Strategies

### Pattern 1 & 6: Standard Structure
- Role name: `## \d+\. (.+)`
- Job titles: `**Fresher Level**` / `**Entry Level**` subsections
- Skills: Bold subsection headers

### Pattern 2: Hash-Only
- Role name: `# (.+)` (first line)
- Job titles: `### Fresher Level:` (with colon)
- Skills: Headers with colons

### Pattern 3 & 4: Flat Job Lists
- Role name: `# Role \d+: (.+)`
- Job titles: NO subsections → **SMART CATEGORIZATION**:
  - Junior/Trainee/Associate/Entry → Fresher
  - Senior/Lead/Principal/Staff/Architect → Experienced
  - Default: First 50% → Fresher, Rest → Experienced

### Pattern 5: Annotated Lists
- Role name: Extract from long title
- Job titles: Flat list with arrows → Parse inline annotations

## Smart Features

### 1. Fuzzy Section Matching
```javascript
findSection(content, possibleNames) {
  // Try exact matches
  for (name of possibleNames) {
    section = extractSection(content, name)
    if (section) return section
  }

  // Try case-insensitive
  // Try partial matches
  // Try with/without special chars
}
```

### 2. Context-Aware Extraction
```javascript
extractJobTitles(content, pattern) {
  // Detect pattern-specific markers
  // Use surrounding context to disambiguate
  // Track extraction confidence
}
```

### 3. Manual Converters for Edge Cases
```javascript
manualConverters = {
  'data-scientist': manualConvertDataScientist,
  'mlops-engineer': manualConvertMLOps,
  // ... specific converters for problematic files
}
```

### 4. Extraction Confidence Scoring
```
HIGH:   Exact pattern match, all data present
MEDIUM: Fallback used, partial data
LOW:    Heuristics used, uncertain extraction
SKIP:   Could not extract, manual review needed
```

## Implementation Plan

1. **Create pattern detector** (analyzes file structure)
2. **Implement multi-strategy extractors** for each field
3. **Build manual converters** for 33 problematic files
4. **Add extraction tracking** throughout
5. **Generate detailed reports** with:
   - Extraction success rates per field
   - Confidence scores
   - Manual review queue
   - Pattern distribution

## Success Metrics

- **Target**: 95%+ fields extracted with HIGH confidence
- **Acceptable**: 90%+ fields extracted (any confidence)
- **Track**: Every skipped field with detailed reason
