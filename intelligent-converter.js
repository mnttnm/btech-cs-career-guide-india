#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// ============================================================================
// EXTRACTION TRACKING
// ============================================================================

class ExtractionTracker {
  constructor(fileName) {
    this.fileName = fileName;
    this.extracted = {};
    this.skipped = {};
    this.confidence = {};
    this.patternDetected = null;
    this.fallbacksUsed = [];
  }

  markExtracted(field, value, confidence = 'high') {
    this.extracted[field] = value;
    this.confidence[field] = confidence;
  }

  markSkipped(field, reason) {
    this.skipped[field] = reason;
  }

  usedFallback(strategyName) {
    this.fallbacksUsed.push(strategyName);
  }

  getReport() {
    const totalFields = Object.keys(this.extracted).length + Object.keys(this.skipped).length;
    const extractedCount = Object.keys(this.extracted).length;

    return {
      file: this.fileName,
      pattern: this.patternDetected,
      extractionRate: `${extractedCount}/${totalFields}`,
      extracted: Object.keys(this.extracted),
      skipped: this.skipped,
      confidence: this.confidence,
      fallbacksUsed: this.fallbacksUsed
    };
  }
}

// ============================================================================
// PATTERN DETECTION
// ============================================================================

function detectPattern(content) {
  // Pattern 1 & 6: ## \d+\. Name
  if (content.match(/^##\s+\d+\.\s+/m)) {
    if (content.includes('Entry Level') && content.includes('post-PhD')) {
      return 'Pattern 6: Research-Style';
    }
    return 'Pattern 1: Standard Structure';
  }

  // Pattern 2: Data/AI/ML Standard Format - # Name with metadata block
  if (content.match(/^#\s+[A-Z][a-zA-Z\s/]+\n\n\*\*Role Number:\*\*/m)) {
    return 'Pattern 2: Data/AI Standard Format';
  }

  // Pattern 3 & 4: # Role #: Name
  if (content.match(/^#\s+Role\s+#?\d+:/m)) {
    return 'Pattern 3/4: Flat Job List';
  }

  // Pattern 5: Long descriptive title
  if (content.match(/^#\s+.{50,}/m)) {
    return 'Pattern 5: Annotated Flat List';
  }

  return 'Unknown Pattern';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function extractSection(content, ...sectionNames) {
  for (const sectionName of sectionNames) {
    // Match ## Section Name and capture until next ## (same level) or end
    const regex = new RegExp(`##\\s+${sectionName}[\\s\\S]*?(?=\\n##\\s+[A-Z]|$)`, 'i');
    const match = content.match(regex);
    if (match) return match[0];
  }
  return '';
}

function extractBulletPoints(text) {
  const lines = text.split('\n');
  const bullets = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      let bullet = trimmed.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim();
      // Remove arrows and annotations
      bullet = bullet.replace(/\s+←.*$/, '').replace(/\s+→.*$/, '');
      bullet = bullet.replace(/\s+\(.*?\)$/, ''); // Remove trailing parentheses
      if (bullet && bullet.length > 2 && !bullet.includes('###') && !bullet.includes('**')) {
        bullets.push(bullet);
      }
    }
  }

  return bullets;
}

function kebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseNumberRange(text) {
  const matches = text.match(/₹?(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/);
  if (matches) {
    return { min: parseFloat(matches[1]), max: parseFloat(matches[2]) };
  }
  const singleMatch = text.match(/₹?(\d+\.?\d*)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return { min: val, max: val };
  }
  return { min: 0, max: 0 };
}

// ============================================================================
// MULTI-STRATEGY EXTRACTORS
// ============================================================================

function extractRoleName(content, tracker, pattern) {
  // Strategy 1: ## \d+\. Name
  let match = content.match(/^##\s+\d+\.\s+(.+)$/m);
  if (match) {
    tracker.markExtracted('roleName', match[1].trim(), 'high');
    return match[1].trim();
  }

  // Strategy 2: # Role #: Name
  match = content.match(/^#\s+Role\s+\d+:\s+(.+)$/m);
  if (match) {
    tracker.markExtracted('roleName', match[1].trim(), 'high');
    return match[1].trim();
  }

  // Strategy 3: # Name (first line)
  match = content.match(/^#\s+([^\n]+)$/m);
  if (match) {
    let name = match[1].trim();
    // Clean up long descriptive titles
    name = name.replace(/\s+-\s+.*$/, ''); // Remove " - description"
    name = name.replace(/\s+Complete Career Guide.*$/i, '');
    tracker.markExtracted('roleName', name, 'medium');
    tracker.usedFallback('Clean up long title');
    return name;
  }

  tracker.markSkipped('roleName', 'No heading found');
  return '';
}

function extractJobTitles(content, tracker, pattern) {
  let section = extractSection(content, 'Real Job Titles in India', 'Real Job Titles');

  if (!section) {
    tracker.markSkipped('jobTitles', 'No "Real Job Titles" section found');
    return { fresher: [], experienced: [] };
  }

  let fresher = [];
  let experienced = [];

  // Strategy 1: ### Fresher Level: (Data/AI format - most specific, try first)
  let fresherMatch = section.match(/###\s*(Fresher|Entry) Level[^\n]*:[\s\S]*?(?=###|$)/i);
  if (fresherMatch) {
    const bullets = extractBulletPoints(fresherMatch[0]);
    const filtered = bullets.filter(b => b.length > 3 && !b.match(/^###/));
    fresher.push(...filtered.slice(0, 5));
    tracker.markExtracted('jobTitles.fresher', fresher.length, 'high');
  }

  let expMatch = section.match(/###\s*(Experienced|Senior) Level[^\n]*:[\s\S]*?(?=###|$)/i);
  if (expMatch) {
    const bullets = extractBulletPoints(expMatch[0]);
    const filtered = bullets.filter(b => b.length > 3 && !b.match(/^###/));
    experienced.push(...filtered.slice(0, 5));
    tracker.markExtracted('jobTitles.experienced', experienced.length, 'high');
  }

  // Strategy 2: **Fresher Level** / **Entry Level** subsections (standard format)
  if (fresher.length === 0) {
    fresherMatch = section.match(/\*\*(Fresher|Entry) Level.*?\*\*[\s\S]*?(?=\*\*(Experienced|Senior)|###|$)/i);
    if (fresherMatch) {
      const bullets = extractBulletPoints(fresherMatch[0]);
      const filtered = bullets.filter(b =>
        !b.includes('Level') &&
        !b.includes('years') &&
        b.length > 5
      );
      fresher.push(...filtered.slice(0, 5));
      tracker.markExtracted('jobTitles.fresher', fresher.length, 'high');
    }
  }

  if (experienced.length === 0) {
    expMatch = section.match(/\*\*(Experienced|Senior) Level.*?\*\*[\s\S]*?(?=---|$)/i);
    if (expMatch) {
      const bullets = extractBulletPoints(expMatch[0]);
      const filtered = bullets.filter(b =>
        !b.includes('Level') &&
        !b.includes('years') &&
        b.length > 5
      );
      experienced.push(...filtered.slice(0, 5));
      tracker.markExtracted('jobTitles.experienced', experienced.length, 'high');
    }
  }

  // Strategy 3: Smart categorization from flat list
  if (fresher.length === 0 && experienced.length === 0) {
    tracker.usedFallback('Smart categorization from flat list');

    const allTitles = extractBulletPoints(section);

    for (const title of allTitles) {
      const lower = title.toLowerCase();

      if (lower.includes('junior') || lower.includes('trainee') || lower.includes('associate') ||
          lower.includes('entry') || lower.includes('apm') || lower.includes('0-2')) {
        if (fresher.length < 5) fresher.push(title);
      } else if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal') ||
                 lower.includes('staff') || lower.includes('architect') || lower.includes('director') ||
                 lower.includes('vp') || lower.includes('head')) {
        if (experienced.length < 5) experienced.push(title);
      } else {
        // Default: first ones to fresher, later ones to experienced
        if (fresher.length < 3) {
          fresher.push(title);
        } else if (experienced.length < 5) {
          experienced.push(title);
        }
      }
    }

    if (fresher.length > 0) {
      tracker.markExtracted('jobTitles.fresher', fresher.length, 'low');
    }
    if (experienced.length > 0) {
      tracker.markExtracted('jobTitles.experienced', experienced.length, 'low');
    }
  }

  if (fresher.length === 0) tracker.markSkipped('jobTitles.fresher', 'Could not extract fresher titles');
  if (experienced.length === 0) tracker.markSkipped('jobTitles.experienced', 'Could not extract experienced titles');

  return { fresher, experienced };
}

function extractDescription(content, tracker) {
  // Strategy 1: **Difficulty:** line
  let match = content.match(/\*\*Difficulty:\*\*\s+(.+)/);
  if (match) {
    let desc = match[1].trim();
    // Remove emoji
    desc = desc.replace(/[🟢🟡🔴]/g, '').trim();
    // Take first sentence
    const firstSentence = desc.split(/[.!?]/)[0];
    tracker.markExtracted('description', firstSentence.trim(), 'high');
    return firstSentence.trim();
  }

  // Strategy 2: First paragraph after role name
  const lines = content.split('\n');
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i].trim();
    if (line.length > 50 && !line.startsWith('#') && !line.startsWith('**') && !line.startsWith('-')) {
      tracker.markExtracted('description', line.substring(0, 150), 'low');
      tracker.usedFallback('First paragraph heuristic');
      return line.substring(0, 150);
    }
  }

  tracker.markSkipped('description', 'No difficulty line or suitable paragraph found');
  return '';
}

function extractSkills(content, tracker) {
  const section = extractSection(content, 'Required Skills');

  const programmingLanguages = [];
  const coreConcepts = [];
  const frameworks = [];
  const tools = [];

  if (!section) {
    tracker.markSkipped('skills', 'No Required Skills section');
    return { programmingLanguages, coreConcepts, frameworks, tools };
  }

  // Extract programming languages
  const langPatterns = [
    { name: 'JavaScript', keywords: ['javascript', '\\bjs\\b'] },
    { name: 'TypeScript', keywords: ['typescript', '\\bts\\b'] },
    { name: 'Python', keywords: ['python'] },
    { name: 'Java', keywords: ['\\bjava\\b'] },
    { name: 'C++', keywords: ['c\\+\\+', 'cpp'] },
    { name: 'Go', keywords: ['\\bgo\\b', 'golang'] },
    { name: 'Rust', keywords: ['rust'] },
    { name: 'C', keywords: ['\\bc\\b'] },
    { name: 'SQL', keywords: ['sql'] },
    { name: 'HTML', keywords: ['html'] },
    { name: 'CSS', keywords: ['css'] },
    { name: 'R', keywords: ['\\br\\b'] },
    { name: 'Swift', keywords: ['swift'] },
    { name: 'Kotlin', keywords: ['kotlin'] },
    { name: 'PHP', keywords: ['php'] },
    { name: 'Ruby', keywords: ['ruby'] },
    { name: 'Scala', keywords: ['scala'] },
    { name: 'Bash', keywords: ['bash', 'shell'] },
  ];

  const lowerSection = section.toLowerCase();
  for (const lang of langPatterns) {
    for (const keyword of lang.keywords) {
      const regex = new RegExp(keyword, 'i');
      if (regex.test(lowerSection)) {
        const mustHave = lowerSection.includes('must') || lowerSection.includes('essential') || lowerSection.includes('mandatory');
        const advanced = lowerSection.includes('advanced') || lowerSection.includes('expert');
        const priority = (mustHave || lowerSection.indexOf(keyword.replace(/\\b/g, '')) < lowerSection.length / 3) ? 'Primary' : 'Secondary';

        programmingLanguages.push({
          name: lang.name,
          level: advanced ? 'Advanced' : (mustHave ? 'Intermediate' : 'Beginner'),
          priority
        });
        break;
      }
    }
  }

  // Extract core concepts (bullet points that are descriptive)
  const lines = section.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') && !trimmed.includes('**') && trimmed.length > 20 && trimmed.length < 150) {
      const concept = trimmed.replace(/^[-*]\s*/, '').trim();
      if (coreConcepts.length < 8) {
        coreConcepts.push(concept);
      }
    }
  }

  // Extract frameworks
  const frameworkPatterns = [
    { name: 'React', popularity: 'High' },
    { name: 'Angular', popularity: 'High' },
    { name: 'Vue.js', popularity: 'Medium' },
    { name: 'Next.js', popularity: 'High' },
    { name: 'Django', popularity: 'High' },
    { name: 'Flask', popularity: 'Medium' },
    { name: 'Spring Boot', popularity: 'High' },
    { name: 'Express.js', popularity: 'High' },
    { name: 'FastAPI', popularity: 'Medium' },
    { name: 'TensorFlow', popularity: 'High' },
    { name: 'PyTorch', popularity: 'High' },
    { name: 'Kubernetes', popularity: 'High' },
    { name: 'Docker', popularity: 'High' },
    { name: 'Scikit-learn', popularity: 'High' },
    { name: 'Pandas', popularity: 'High' },
    { name: 'NumPy', popularity: 'High' },
  ];

  for (const fw of frameworkPatterns) {
    if (lowerSection.includes(fw.name.toLowerCase())) {
      frameworks.push(fw);
    }
  }

  // Extract tools
  const toolsSection = section.match(/###?\s*Tools.*?[\s\S]*?(?=###?|$)/i);
  if (toolsSection) {
    const toolBullets = extractBulletPoints(toolsSection[0]);
    tools.push(...toolBullets.slice(0, 10));
  }

  tracker.markExtracted('skills.programmingLanguages', programmingLanguages.length, programmingLanguages.length > 0 ? 'medium' : 'low');
  tracker.markExtracted('skills.coreConcepts', coreConcepts.length, coreConcepts.length > 5 ? 'high' : 'medium');
  tracker.markExtracted('skills.frameworks', frameworks.length, frameworks.length > 0 ? 'medium' : 'low');
  tracker.markExtracted('skills.tools', tools.length, tools.length > 0 ? 'medium' : 'low');

  return { programmingLanguages, coreConcepts, frameworks, tools };
}

function extractDailyWork(content, tracker) {
  const section = extractSection(content, 'Day-to-Day Work', 'Daily Work', 'Day to Day');

  if (!section) {
    tracker.markSkipped('dailyWork', 'No Day-to-Day Work section');
    return [];
  }

  const bullets = extractBulletPoints(section);
  tracker.markExtracted('dailyWork', bullets.length, bullets.length >= 5 ? 'high' : 'medium');
  return bullets.slice(0, 8);
}

function extractCareerProgression(content, tracker) {
  const section = extractSection(content, 'Growth Potential', 'Career Progression', 'Career Growth');

  const timeline = [];
  const leadership = [];
  const individualContributor = [];
  let timelineToSenior = '';
  const alternativePaths = [];

  if (!section) {
    tracker.markSkipped('careerProgression', 'No Growth Potential section');
    return { timeline, tracks: { leadership, individualContributor }, timelineToSenior, alternativePaths };
  }

  // Extract timeline
  const lines = section.split('\n');
  for (const line of lines) {
    if ((line.includes('Entry Level') || line.includes('Mid Level') || line.includes('Senior Level')) && line.includes('LPA')) {
      const levelMatch = line.match(/(Entry Level|Mid Level|Senior Level)\s*\((\d+-?\d*)\s*years?\)/i);
      const titleMatch = line.match(/:\s*(.+?)\s*-/);
      const salaryMatch = line.match(/₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)\s*LPA/);

      if (levelMatch && titleMatch && salaryMatch) {
        timeline.push({
          level: levelMatch[1],
          years: levelMatch[2],
          title: titleMatch[1].trim(),
          salary: {
            min: parseFloat(salaryMatch[1]),
            max: parseFloat(salaryMatch[2]),
            currency: 'LPA'
          }
        });
      }
    }
  }

  // Extract tracks
  const leadershipMatch = section.match(/\*\*Leadership Track:\*\*\s*(.+)/i);
  if (leadershipMatch) {
    const track = leadershipMatch[1].split('→').map(s => s.trim());
    leadership.push(...track.slice(0, 7));
  }

  const icMatch = section.match(/\*\*Individual Contributor Track:\*\*\s*(.+)/i);
  if (icMatch) {
    const track = icMatch[1].split('→').map(s => s.trim());
    individualContributor.push(...track.slice(0, 5));
  }

  // Timeline to senior
  const timelineMatch = section.match(/\*\*Timeline to Senior:\*\*\s*(.+)/i);
  if (timelineMatch) {
    timelineToSenior = timelineMatch[1].trim();
  }

  // Alternative paths
  const altSection = section.match(/\*\*Alternative [Pp]aths?:\*\*[\s\S]*?(?=---|$)/i);
  if (altSection) {
    const bullets = extractBulletPoints(altSection[0]);
    alternativePaths.push(...bullets.slice(0, 5));
  }

  tracker.markExtracted('careerProgression.timeline', timeline.length, timeline.length >= 3 ? 'high' : 'medium');
  tracker.markExtracted('careerProgression.tracks', leadership.length + individualContributor.length, 'medium');

  return { timeline, tracks: { leadership, individualContributor }, timelineToSenior, alternativePaths };
}

function extractSalaryRanges(content, tracker) {
  const section = extractSection(content, 'Salary Ranges', 'Salary');

  const fresher = {
    serviceBased: { min: 0, max: 0 },
    productBased: { min: 0, max: 0 },
    topTech: { min: 0, max: 0 },
    average: { min: 0, max: 0 }
  };

  const threeYears = {
    serviceBased: { min: 0, max: 0 },
    productBased: { min: 0, max: 0 },
    average: { min: 0, max: 0 }
  };

  const fivePlus = {
    midLevel: { min: 0, max: 0 },
    senior: { min: 0, max: 0 },
    topCompanies: { min: 0, max: 0 }
  };

  const topCompanies = [];

  if (!section) {
    tracker.markSkipped('salaryRanges', 'No Salary Ranges section');
    return { fresher, threeYears, fivePlus, topCompanies };
  }

  // Extract fresher salaries
  const fresherSection = section.match(/\*\*Fresher.*?\*\*[\s\S]*?(?=\*\*\d+\s+[Yy]ears|$)/i);
  if (fresherSection) {
    const text = fresherSection[0];

    const serviceMatch = text.match(/[Ss]ervice[-\s]based.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (serviceMatch) fresher.serviceBased = { min: parseFloat(serviceMatch[1]), max: parseFloat(serviceMatch[2]) };

    const productMatch = text.match(/[Pp]roduct[-\s]based.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (productMatch) fresher.productBased = { min: parseFloat(productMatch[1]), max: parseFloat(productMatch[2]) };

    const topMatch = text.match(/[Tt]op tech.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (topMatch) fresher.topTech = { min: parseFloat(topMatch[1]), max: parseFloat(topMatch[2]) };

    const avgMatch = text.match(/[Aa]verage.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (avgMatch) fresher.average = { min: parseFloat(avgMatch[1]), max: parseFloat(avgMatch[2]) };
  }

  // Extract top companies
  const topSection = section.match(/\*\*Top Companies.*?\*\*[\s\S]*?(?=\*\*[A-Z]|---|-\s\*\*|$)/i);
  if (topSection) {
    const lines = topSection[0].split('\n');
    for (const line of lines) {
      const companyMatch = line.match(/^-\s*(.+?):/);
      if (companyMatch) {
        const name = companyMatch[1].trim();
        const fresherRange = line.match(/₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)\s*LPA\s*\(fresher\)/i);
        if (fresherRange) {
          topCompanies.push({
            name,
            range: {
              min: parseFloat(fresherRange[1]),
              max: parseFloat(fresherRange[2])
            }
          });
        }
      }
    }
  }

  tracker.markExtracted('salaryRanges', 'partial', 'medium');

  return { fresher, threeYears, fivePlus, topCompanies: topCompanies.slice(0, 5) };
}

function extractLearningCurve(content, tracker) {
  const section = extractSection(content, 'Learning Curve');

  if (!section) {
    tracker.markSkipped('learningCurve', 'No Learning Curve section');
    return { difficulty: 'Moderate', timeToJobReady: '6-12 months', description: '' };
  }

  const firstLine = section.split('\n').filter(l => l.trim())[0] || '';

  let difficulty = 'Moderate';
  const lower = firstLine.toLowerCase();
  if (lower.includes('easy') || lower.includes('entry-level friendly')) difficulty = 'Easy';
  else if (lower.includes('steep') || lower.includes('hard') || lower.includes('challenging')) difficulty = 'Steep';

  const timeMatch = section.match(/(\d+-?\d*\s*months)/i);
  const timeToJobReady = timeMatch ? timeMatch[1] : '6-12 months';

  const description = firstLine.replace(/\*\*/g, '').replace(/[🟢🟡🔴]/g, '').trim().substring(0, 200);

  tracker.markExtracted('learningCurve', 'complete', 'high');

  return { difficulty, timeToJobReady, description };
}

function extractStressLevel(content, tracker) {
  const section = extractSection(content, 'Stress Level');

  if (!section) {
    tracker.markSkipped('stressLevel', 'No Stress Level section');
    return { level: 'Medium', factors: [], mitigatingFactors: [] };
  }

  const firstLine = section.split('\n').filter(l => l.trim())[0] || '';

  let level = 'Medium';
  const lower = firstLine.toLowerCase();
  if (lower.includes('medium-high')) level = 'Medium-High';
  else if (lower.includes('high')) level = 'High';
  else if (lower.includes('low')) level = 'Low';

  const factors = [];
  const mitigatingFactors = [];

  const whySection = section.match(/\*\*Why.*?:\*\*[\s\S]*?(?=\*\*Mitigating|$)/i);
  if (whySection) {
    factors.push(...extractBulletPoints(whySection[0]).slice(0, 6));
  }

  const mitigatingSection = section.match(/\*\*Mitigating Factors:\*\*[\s\S]*?(?=\*\*|---|$)/i);
  if (mitigatingSection) {
    mitigatingFactors.push(...extractBulletPoints(mitigatingSection[0]).slice(0, 5));
  }

  tracker.markExtracted('stressLevel', 'complete', 'high');

  return { level, factors, mitigatingFactors };
}

function extractPersonalityFit(content, tracker) {
  const section = extractSection(content, 'Personality Fit');

  if (!section) {
    tracker.markSkipped('personalityFit', 'No Personality Fit section');
    return { thriveIf: [], avoidIf: [] };
  }

  const thriveIf = [];
  const avoidIf = [];

  const thriveSection = section.match(/\*\*You'?ll Thrive If:\*\*[\s\S]*?(?=\*\*Avoid If|$)/i);
  if (thriveSection) {
    thriveIf.push(...extractBulletPoints(thriveSection[0]).slice(0, 8));
  }

  const avoidSection = section.match(/\*\*Avoid If:\*\*[\s\S]*?(?=\*\*|---|$)/i);
  if (avoidSection) {
    avoidIf.push(...extractBulletPoints(avoidSection[0]).slice(0, 6));
  }

  tracker.markExtracted('personalityFit', 'complete', thriveIf.length > 0 && avoidIf.length > 0 ? 'high' : 'medium');

  return { thriveIf, avoidIf };
}

function extractCollegeStrategy(content, tracker) {
  const section = extractSection(content, 'Year-by-Year College Strategy', 'From Day 1');

  if (!section) {
    tracker.markSkipped('collegeStrategy', 'No college strategy section');
    return [];
  }

  const strategy = [];

  for (let year = 1; year <= 4; year++) {
    const yearSection = section.match(new RegExp(`\\*\\*Year\\s+${year}\\s+\\((.+?)\\):\\*\\*[\\s\\S]*?(?=\\*\\*Year\\s+${year + 1}|$)`, 'i'));
    if (yearSection) {
      const title = yearSection[1].trim();
      const goals = extractBulletPoints(yearSection[0]).slice(0, 6);
      strategy.push({ year, title, goals });
    }
  }

  tracker.markExtracted('collegeStrategy', strategy.length, strategy.length === 4 ? 'high' : 'medium');

  return strategy;
}

function extractFirstJobStrategy(content, tracker) {
  const section = extractSection(content, 'First Job Strategy', 'Landing Your First Job');

  if (!section) {
    tracker.markSkipped('firstJobStrategy', 'No first job strategy section');
    return {
      technicalPrep: [],
      applicationStrategy: [],
      interviewPrep: [],
      salaryExpectations: {
        service: { min: 0, max: 0 },
        midTierProduct: { min: 0, max: 0 },
        topProduct: { min: 0, max: 0 },
        gcc: ''
      },
      differentiators: []
    };
  }

  const technicalPrep = [];
  const applicationStrategy = [];
  const interviewPrep = [];
  const differentiators = [];

  // Extract technical prep
  const techSection = section.match(/\*\*Technical Preparation.*?\*\*[\s\S]*?(?=\*\*Application Strategy|$)/i);
  if (techSection) {
    const items = techSection[0].match(/\d+\.\s+\*\*(.+?):\*\*[\s\S]*?(?=\d+\.\s+\*\*|$)/g);
    if (items) {
      for (const item of items.slice(0, 5)) {
        const skillMatch = item.match(/\d+\.\s+\*\*(.+?):\*\*/);
        const goalMatch = item.match(/:\*\*\s*(.+?)(?:\n|$)/);
        if (skillMatch && goalMatch) {
          technicalPrep.push({
            skill: skillMatch[1].trim(),
            goal: goalMatch[1].trim()
          });
        }
      }
    }
  }

  // Extract differentiators
  const diffSection = section.match(/\*\*Key Differentiators:\*\*[\s\S]*?(?=---|$)/i);
  if (diffSection) {
    differentiators.push(...extractBulletPoints(diffSection[0]).slice(0, 6));
  }

  const salaryExpectations = {
    service: { min: 3.5, max: 5 },
    midTierProduct: { min: 6, max: 10 },
    topProduct: { min: 12, max: 20 },
    gcc: '₹10-18 LPA'
  };

  tracker.markExtracted('firstJobStrategy', 'partial', 'medium');

  return { technicalPrep, applicationStrategy, interviewPrep, salaryExpectations, differentiators };
}

// ============================================================================
// MAIN CONVERSION FUNCTION
// ============================================================================

function convertMarkdownToJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const tracker = new ExtractionTracker(fileName);

  // Detect pattern
  const pattern = detectPattern(content);
  tracker.patternDetected = pattern;

  // Extract all fields
  const roleName = extractRoleName(content, tracker, pattern);
  const roleId = kebabCase(roleName);
  const description = extractDescription(content, tracker);
  const jobTitles = extractJobTitles(content, tracker, pattern);
  const skills = extractSkills(content, tracker);
  const dailyWork = extractDailyWork(content, tracker);
  const careerProgression = extractCareerProgression(content, tracker);
  const salaryRanges = extractSalaryRanges(content, tracker);
  const learningCurve = extractLearningCurve(content, tracker);
  const stressLevel = extractStressLevel(content, tracker);
  const personalityFit = extractPersonalityFit(content, tracker);
  const collegeStrategy = extractCollegeStrategy(content, tracker);
  const firstJobStrategy = extractFirstJobStrategy(content, tracker);

  return {
    data: {
      roleId,
      roleName,
      description,
      jobTitles,
      skills,
      dailyWork,
      careerProgression,
      salaryRanges,
      learningCurve,
      stressLevel,
      personalityFit,
      collegeStrategy,
      firstJobStrategy
    },
    tracking: tracker.getReport()
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function findMarkdownFiles(baseDir) {
  const files = [];
  const partDirs = fs.readdirSync(baseDir).filter(f => f.startsWith('Part_'));

  for (const partDir of partDirs) {
    const partPath = path.join(baseDir, partDir);
    if (fs.statSync(partPath).isDirectory()) {
      const mdFiles = fs.readdirSync(partPath)
        .filter(f => f.endsWith('.md'))
        .map(f => path.join(partPath, f));
      files.push(...mdFiles);
    }
  }

  return files;
}

async function main() {
  const startTime = Date.now();

  console.log('🧠 Starting INTELLIGENT batch conversion with extraction tracking...\n');

  const files = findMarkdownFiles('BTech_Roles_Research');
  console.log(`📁 Found ${files.length} markdown files\n`);

  const outputDir = path.join(process.cwd(), 'output', 'roles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = {
    successful: [],
    failed: [],
    trackingReports: []
  };

  // Process all files in parallel
  const promises = files.map(async (file) => {
    try {
      const { data, tracking } = convertMarkdownToJson(file);

      // Write JSON file
      const outputPath = path.join(outputDir, `${data.roleId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

      results.successful.push({
        file,
        roleId: data.roleId,
        outputPath
      });

      results.trackingReports.push(tracking);

      const statusIcon = Object.keys(tracking.skipped).length === 0 ? '✅' : '⚠️';
      console.log(`${statusIcon} ${data.roleName} (${tracking.pattern})`);
    } catch (error) {
      results.failed.push({
        file,
        error: error.message
      });
      console.error(`❌ ${path.basename(file)}: ${error.message}`);
    }
  });

  await Promise.all(promises);

  // Generate comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    successful: results.successful.length,
    failed: results.failed.length,
    conversionTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
    trackingReports: results.trackingReports,
    patternDistribution: {},
    fieldExtractionStats: {}
  };

  // Calculate pattern distribution
  for (const tracking of results.trackingReports) {
    report.patternDistribution[tracking.pattern] =
      (report.patternDistribution[tracking.pattern] || 0) + 1;
  }

  // Calculate field extraction stats
  const fieldStats = {};
  for (const tracking of results.trackingReports) {
    for (const field of tracking.extracted) {
      fieldStats[field] = (fieldStats[field] || 0) + 1;
    }
  }
  report.fieldExtractionStats = fieldStats;

  const reportPath = path.join(process.cwd(), 'output', 'intelligent-conversion-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 INTELLIGENT CONVERSION SUMMARY');
  console.log('='.repeat(70));
  console.log(`✅ Successful: ${results.successful.length}/${files.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${files.length}`);
  console.log(`⏱️  Time: ${report.conversionTime}`);
  console.log('\n📈 Pattern Distribution:');
  for (const [pattern, count] of Object.entries(report.patternDistribution)) {
    console.log(`   ${pattern}: ${count} files`);
  }
  console.log('\n📊 Field Extraction Success Rates:');
  for (const [field, count] of Object.entries(fieldStats)) {
    const percentage = ((count / files.length) * 100).toFixed(1);
    console.log(`   ${field}: ${count}/${files.length} (${percentage}%)`);
  }
  console.log('='.repeat(70));
  console.log(`\n📁 Output: ${outputDir}`);
  console.log(`📄 Detailed Report: ${reportPath}\n`);

  if (results.successful.length === files.length) {
    console.log('🎉 All files converted successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Conversion completed with some issues');
    process.exit(0);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { convertMarkdownToJson };
