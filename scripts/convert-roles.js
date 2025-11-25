#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Utility functions
function extractSection(content, sectionTitle, nextSectionPattern = null) {
  const regex = new RegExp(`###\\s+${sectionTitle}[\\s\\S]*?(?=###|$)`, 'i');
  const match = content.match(regex);
  if (!match) return '';

  let section = match[0];
  // Remove the section title line
  section = section.replace(new RegExp(`###\\s+${sectionTitle}\\s*`, 'i'), '');
  return section.trim();
}

function extractBulletPoints(text) {
  const lines = text.split('\n');
  const bullets = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      // Remove the bullet point marker and any bold markers
      let bullet = trimmed.replace(/^[-*]\s*/, '').replace(/\*\*/g, '').trim();
      // Remove trailing colons if any
      bullet = bullet.replace(/:$/, '').trim();
      if (bullet) {
        bullets.push(bullet);
      }
    }
  }

  return bullets;
}

function extractSubsection(section, subsectionTitle) {
  const regex = new RegExp(`\\*\\*${subsectionTitle}[:\\s]*\\*\\*[\\s\\S]*?(?=\\*\\*[A-Z]|$)`, 'i');
  const match = section.match(regex);
  if (!match) return '';
  return match[0];
}

function parseNumberRange(text) {
  // Extract numbers from strings like "₹3.5-5 LPA" or "3.5-5" or "₹3.5-5"
  const matches = text.match(/₹?(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/);
  if (matches) {
    return {
      min: parseFloat(matches[1]),
      max: parseFloat(matches[2])
    };
  }

  // Try single number
  const singleMatch = text.match(/₹?(\d+\.?\d*)/);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    return { min: val, max: val };
  }

  return { min: 0, max: 0 };
}

function kebabCase(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapDifficulty(text) {
  const lower = text.toLowerCase();
  if (lower.includes('easy') || lower.includes('entry-level friendly')) return 'Easy';
  if (lower.includes('steep') || lower.includes('hard') || lower.includes('challenging')) return 'Steep';
  return 'Moderate';
}

function mapStressLevel(text) {
  const lower = text.toLowerCase();
  if (lower.includes('medium-high')) return 'Medium-High';
  if (lower.includes('high')) return 'High';
  if (lower.includes('low')) return 'Low';
  return 'Medium';
}

function extractRoleName(content) {
  // Extract from the first heading like "## 3. Frontend Engineer/Developer"
  let match = content.match(/##\s+\d+\.\s+(.+)/);
  if (match) {
    return match[1].trim();
  }

  // Try alternative format: "# AI Engineer"
  match = content.match(/^#\s+([^\n]+)/m);
  if (match) {
    return match[1].trim();
  }

  return '';
}

function extractDescription(content) {
  // Extract from the difficulty line
  const match = content.match(/\*\*Difficulty:\*\*\s+(.+)/);
  if (match) {
    const desc = match[1].trim();
    // Take first sentence or up to 150 chars
    const firstSentence = desc.split(/[.!?]/)[0];
    return firstSentence.trim();
  }
  return '';
}

function extractJobTitles(content) {
  let section = extractSection(content, 'Real Job Titles in India');

  // If not found, try simpler "Real Job Titles"
  if (!section) {
    section = extractSection(content, 'Real Job Titles');
  }

  const fresher = [];
  const experienced = [];

  // Try format 1: **Fresher Level...**
  let fresherMatch = section.match(/\*\*Fresher Level.*?\*\*[\s\S]*?(?=\*\*Experienced|###|$)/i);
  if (!fresherMatch) {
    // Try format 2: ### Fresher Level...
    fresherMatch = section.match(/###\s*Fresher Level.*?[\s\S]*?(?=###|$)/i);
  }

  if (fresherMatch) {
    const bullets = extractBulletPoints(fresherMatch[0]);
    // Filter out section headers
    const filtered = bullets.filter(b => !b.startsWith('*') && !b.includes('Fresher Level') && !b.includes('Experienced Level'));
    fresher.push(...filtered.slice(0, 5));
  }

  // Try format 1: **Experienced Level...**
  let expMatch = section.match(/\*\*Experienced Level.*?\*\*[\s\S]*?(?=---|$)/i);
  if (!expMatch) {
    // Try format 2: ### Experienced Level...
    expMatch = section.match(/###\s*Experienced Level.*?[\s\S]*?(?=---|$)/i);
  }

  if (expMatch) {
    const bullets = extractBulletPoints(expMatch[0]);
    // Filter out section headers
    const filtered = bullets.filter(b => !b.startsWith('*') && !b.includes('Fresher Level') && !b.includes('Experienced Level'));
    experienced.push(...filtered.slice(0, 5));
  }

  // Format 3: All titles together, no separation (like DevOps file)
  if (fresher.length === 0 && experienced.length === 0) {
    const allTitles = extractBulletPoints(section);

    for (const title of allTitles) {
      const lower = title.toLowerCase();
      // Categorize as fresher or experienced based on keywords
      if (lower.includes('junior') || lower.includes('trainee') || lower.includes('associate') ||
          lower.includes('0-2') || lower.includes('entry')) {
        if (fresher.length < 5) fresher.push(title);
      } else if (lower.includes('senior') || lower.includes('lead') || lower.includes('principal') ||
                 lower.includes('staff') || lower.includes('architect') || lower.includes('director')) {
        if (experienced.length < 5) experienced.push(title);
      } else {
        // Default: first half to fresher, second half to experienced
        if (fresher.length < 3) {
          fresher.push(title);
        } else if (experienced.length < 5) {
          experienced.push(title);
        }
      }
    }
  }

  return { fresher, experienced };
}

function extractSkills(content) {
  const section = extractSection(content, 'Required Skills');

  // Programming languages - extract from content
  const programmingLanguages = [];
  const langPatterns = [
    { name: 'JavaScript', keywords: ['javascript', 'js'] },
    { name: 'TypeScript', keywords: ['typescript', 'ts'] },
    { name: 'Python', keywords: ['python'] },
    { name: 'Java', keywords: ['java'] },
    { name: 'C++', keywords: ['c\\+\\+', 'cpp'] },
    { name: 'Go', keywords: ['go', 'golang'] },
    { name: 'Rust', keywords: ['rust'] },
    { name: 'C', keywords: ['\\bc\\b'] },
    { name: 'SQL', keywords: ['sql'] },
    { name: 'HTML', keywords: ['html'] },
    { name: 'CSS', keywords: ['css'] },
    { name: 'R', keywords: ['\\br\\b'] },
    { name: 'Swift', keywords: ['swift'] },
    { name: 'Kotlin', keywords: ['kotlin'] },
  ];

  const lowerSection = section.toLowerCase();
  for (const lang of langPatterns) {
    for (const keyword of lang.keywords) {
      const regex = new RegExp(keyword, 'i');
      if (regex.test(lowerSection)) {
        // Determine level and priority based on context
        const mustHave = lowerSection.includes('must-have') || lowerSection.includes('essential');
        const advanced = lowerSection.includes('advanced') || lowerSection.includes('expert');

        programmingLanguages.push({
          name: lang.name,
          level: advanced ? 'Advanced' : (mustHave ? 'Intermediate' : 'Beginner'),
          priority: mustHave || lowerSection.indexOf(keyword) < lowerSection.length / 3 ? 'Primary' : 'Secondary'
        });
        break;
      }
    }
  }

  // Core concepts - extract bullet points from skills section
  const coreConcepts = [];
  const lines = section.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('-') && !trimmed.includes('**')) {
      const concept = trimmed.replace(/^[-*]\s*/, '').trim();
      if (concept && concept.length < 100) {
        coreConcepts.push(concept);
      }
    }
  }

  // Frameworks - extract from content
  const frameworks = [];
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
  ];

  for (const fw of frameworkPatterns) {
    if (lowerSection.includes(fw.name.toLowerCase())) {
      frameworks.push(fw);
    }
  }

  // Tools - extract from tools section or general content
  const tools = [];
  const toolsSection = section.match(/\*\*Tools.*?\*\*[\s\S]*?(?=\*\*[A-Z]|---|$)/i);
  if (toolsSection) {
    const toolBullets = extractBulletPoints(toolsSection[0]);
    tools.push(...toolBullets.slice(0, 10));
  }

  return {
    programmingLanguages: programmingLanguages.slice(0, 5),
    coreConcepts: coreConcepts.slice(0, 8),
    frameworks: frameworks.slice(0, 5),
    tools: tools.slice(0, 10)
  };
}

function extractDailyWork(content) {
  const section = extractSection(content, 'Day-to-Day Work');
  const bullets = extractBulletPoints(section);
  return bullets.slice(0, 8);
}

function extractCareerProgression(content) {
  const section = extractSection(content, 'Growth Potential');

  // Timeline
  const timeline = [];
  const timelineSection = section.match(/\*\*Career Progression Timeline:\*\*[\s\S]*?(?=\*\*Career Tracks|$)/i);
  if (timelineSection) {
    const lines = timelineSection[0].split('\n');
    for (const line of lines) {
      if (line.includes('Entry Level') || line.includes('Mid Level') || line.includes('Senior Level')) {
        const levelMatch = line.match(/(Entry Level|Mid Level|Senior Level)\s*\((\d+-?\d*)\s*years?\)/i);
        const titleMatch = line.match(/:\*\*\s*(.+?)\s*-/);
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
  }

  // Tracks
  const leadership = [];
  const individualContributor = [];

  const leadershipSection = section.match(/\*\*Leadership Track:\*\*\s*(.+)/i);
  if (leadershipSection) {
    const track = leadershipSection[1].split('→').map(s => s.trim());
    leadership.push(...track.slice(0, 7));
  }

  const icSection = section.match(/\*\*Individual Contributor Track:\*\*\s*(.+)/i);
  if (icSection) {
    const track = icSection[1].split('→').map(s => s.trim());
    individualContributor.push(...track.slice(0, 5));
  }

  // Timeline to senior
  const timelineToSeniorMatch = section.match(/\*\*Timeline to Senior:\*\*\s*(.+)/i);
  const timelineToSenior = timelineToSeniorMatch ? timelineToSeniorMatch[1].trim() : '';

  // Alternative paths
  const alternativePaths = [];
  const altSection = section.match(/\*\*Alternative Paths:\*\*[\s\S]*?(?=---|$)/i);
  if (altSection) {
    const bullets = extractBulletPoints(altSection[0]);
    alternativePaths.push(...bullets.slice(0, 5));
  }

  return {
    timeline,
    tracks: {
      leadership,
      individualContributor
    },
    timelineToSenior,
    alternativePaths
  };
}

function extractSalaryRanges(content) {
  const section = extractSection(content, 'Salary Ranges in India');

  // Fresher
  const fresher = {
    serviceBased: { min: 0, max: 0 },
    productBased: { min: 0, max: 0 },
    topTech: { min: 0, max: 0 },
    average: { min: 0, max: 0 }
  };

  const fresherSection = section.match(/\*\*Fresher.*?\*\*[\s\S]*?(?=\*\*\d+\s+Years|$)/i);
  if (fresherSection) {
    const text = fresherSection[0];

    const serviceMatch = text.match(/Service-based.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (serviceMatch) {
      fresher.serviceBased = { min: parseFloat(serviceMatch[1]), max: parseFloat(serviceMatch[2]) };
    }

    const productMatch = text.match(/Product-based.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (productMatch) {
      fresher.productBased = { min: parseFloat(productMatch[1]), max: parseFloat(productMatch[2]) };
    }

    const topMatch = text.match(/Top tech.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (topMatch) {
      fresher.topTech = { min: parseFloat(topMatch[1]), max: parseFloat(topMatch[2]) };
    }

    const avgMatch = text.match(/Average.*?₹(\d+\.?\d*)\s*-\s*₹?(\d+\.?\d*)/i);
    if (avgMatch) {
      fresher.average = { min: parseFloat(avgMatch[1]), max: parseFloat(avgMatch[2]) };
    }
  }

  // 3 Years
  const threeYears = {
    serviceBased: { min: 0, max: 0 },
    productBased: { min: 0, max: 0 },
    average: { min: 0, max: 0 }
  };

  const threeSection = section.match(/\*\*3\s+Years.*?\*\*[\s\S]*?(?=\*\*\d+|$)/i);
  if (threeSection) {
    const lines = threeSection[0].split('\n');
    for (const line of lines) {
      if (line.includes('service-based')) {
        const range = parseNumberRange(line);
        threeYears.serviceBased = range;
      } else if (line.includes('product-based')) {
        const range = parseNumberRange(line);
        threeYears.productBased = range;
      } else if (line.includes('Average')) {
        const range = parseNumberRange(line);
        threeYears.average = range;
      }
    }
  }

  // 5+ Years
  const fivePlus = {
    midLevel: { min: 0, max: 0 },
    senior: { min: 0, max: 0 },
    topCompanies: { min: 0, max: 0 }
  };

  const fiveSection = section.match(/\*\*5\+\s+Years.*?\*\*[\s\S]*?(?=\*\*Top Companies|$)/i);
  if (fiveSection) {
    const lines = fiveSection[0].split('\n');
    for (const line of lines) {
      const range = parseNumberRange(line);
      if (line.includes('senior at service') || line.match(/₹\d+.*?senior/i)) {
        fivePlus.midLevel = range;
      } else if (line.includes('senior at product') || line.includes('staff')) {
        fivePlus.senior = range;
      } else if (line.includes('FAANG') || line.includes('principal')) {
        fivePlus.topCompanies = range;
      }
    }
  }

  // Top companies
  const topCompanies = [];
  const topSection = section.match(/\*\*Top Companies by Salary:\*\*[\s\S]*?(?=\*\*Industry|---|$)/i);
  if (topSection) {
    const lines = topSection[0].split('\n');
    for (const line of lines) {
      const companyMatch = line.match(/^-\s*(.+?):/);
      if (companyMatch) {
        const name = companyMatch[1].trim();
        // Extract fresher range
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

  return {
    fresher,
    threeYears,
    fivePlus,
    topCompanies: topCompanies.slice(0, 5)
  };
}

function extractLearningCurve(content) {
  const section = extractSection(content, 'Learning Curve');

  const firstLine = section.split('\n')[0];
  const difficulty = mapDifficulty(firstLine);

  // Extract time to job ready
  const timeMatch = section.match(/(\d+-?\d*\s*months)/i);
  const timeToJobReady = timeMatch ? timeMatch[1] : '6-12 months';

  // Description - take first paragraph
  const paragraphs = section.split('\n\n');
  const description = paragraphs[0] || section.substring(0, 200);

  return {
    difficulty,
    timeToJobReady,
    description: description.trim()
  };
}

function extractStressLevel(content) {
  const section = extractSection(content, 'Stress Level');

  const firstLine = section.split('\n')[0];
  const level = mapStressLevel(firstLine);

  const factors = [];
  const mitigatingFactors = [];

  const whySection = section.match(/\*\*Why.*?:\*\*[\s\S]*?(?=\*\*Mitigating|$)/i);
  if (whySection) {
    const bullets = extractBulletPoints(whySection[0]);
    factors.push(...bullets.slice(0, 6));
  }

  const mitigatingSection = section.match(/\*\*Mitigating Factors:\*\*[\s\S]*?(?=\*\*Work-Life|---|$)/i);
  if (mitigatingSection) {
    const bullets = extractBulletPoints(mitigatingSection[0]);
    mitigatingFactors.push(...bullets.slice(0, 5));
  }

  return {
    level,
    factors,
    mitigatingFactors
  };
}

function extractPersonalityFit(content) {
  const section = extractSection(content, 'Personality Fit');

  const thriveIf = [];
  const avoidIf = [];

  const thriveSection = section.match(/\*\*You'll Thrive If:\*\*[\s\S]*?(?=\*\*Avoid If|$)/i);
  if (thriveSection) {
    const bullets = extractBulletPoints(thriveSection[0]);
    thriveIf.push(...bullets.slice(0, 8));
  }

  const avoidSection = section.match(/\*\*Avoid If:\*\*[\s\S]*?(?=\*\*Ideal|---|$)/i);
  if (avoidSection) {
    const bullets = extractBulletPoints(avoidSection[0]);
    avoidIf.push(...bullets.slice(0, 6));
  }

  return {
    thriveIf,
    avoidIf
  };
}

function extractCollegeStrategy(content) {
  const section = extractSection(content, 'From Day 1: Year-by-Year College Strategy');

  const strategy = [];

  for (let year = 1; year <= 4; year++) {
    const yearSection = section.match(new RegExp(`\\*\\*Year\\s+${year}\\s+\\((.+?)\\):\\*\\*[\\s\\S]*?(?=\\*\\*Year\\s+${year + 1}|$)`, 'i'));
    if (yearSection) {
      const title = yearSection[1].trim();
      const goals = extractBulletPoints(yearSection[0]).slice(0, 6);

      strategy.push({
        year,
        title,
        goals
      });
    }
  }

  return strategy;
}

function extractFirstJobStrategy(content) {
  const section = extractSection(content, 'First Job Strategy');

  // Technical prep
  const technicalPrep = [];
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

  // Application strategy
  const applicationStrategy = [];
  const appSection = section.match(/\*\*Application Strategy:\*\*[\s\S]*?(?=\*\*Interview Preparation|$)/i);
  if (appSection) {
    const items = appSection[0].match(/\d+\.\s+\*\*(.+?):\*\*[\s\S]*?(?=\d+\.\s+\*\*|$)/g);
    if (items) {
      for (const item of items.slice(0, 5)) {
        const channelMatch = item.match(/\d+\.\s+\*\*(.+?):\*\*/);
        const lines = item.split('\n').filter(l => l.trim().startsWith('-'));
        const approach = lines.length > 0 ? lines[0].replace(/^-\s*/, '').trim() : '';

        if (channelMatch) {
          applicationStrategy.push({
            channel: channelMatch[1].trim(),
            approach: approach || channelMatch[1].trim()
          });
        }
      }
    }
  }

  // Interview prep
  const interviewPrep = [];
  const interviewSection = section.match(/\*\*Interview Preparation:\*\*[\s\S]*?(?=\*\*Resume|$)/i);
  if (interviewSection) {
    const items = interviewSection[0].match(/\d+\.\s+\*\*(.+?):\*\*/g);
    if (items) {
      interviewPrep.push(...items.map(i => i.replace(/\d+\.\s+\*\*|\*\*/g, '').trim()).slice(0, 6));
    }
  }

  // Salary expectations
  const salaryExpectations = {
    service: { min: 0, max: 0 },
    midTierProduct: { min: 0, max: 0 },
    topProduct: { min: 0, max: 0 },
    gcc: ''
  };

  const salarySection = section.match(/\*\*Salary Expectations:\*\*[\s\S]*?(?=\*\*Key Differentiators|$)/i);
  if (salarySection) {
    const lines = salarySection[0].split('\n');
    for (const line of lines) {
      if (line.includes('Service')) {
        salaryExpectations.service = parseNumberRange(line);
      } else if (line.includes('Mid-tier') || line.includes('Product')) {
        salaryExpectations.midTierProduct = parseNumberRange(line);
      } else if (line.includes('Top') || line.includes('FAANG')) {
        salaryExpectations.topProduct = parseNumberRange(line);
      } else if (line.includes('GCC') || line.includes('Global')) {
        salaryExpectations.gcc = line.replace(/^-\s*/, '').trim();
      }
    }
  }

  // Differentiators
  const differentiators = [];
  const diffSection = section.match(/\*\*Key Differentiators:\*\*[\s\S]*?(?=---|$)/i);
  if (diffSection) {
    const bullets = extractBulletPoints(diffSection[0]);
    differentiators.push(...bullets.slice(0, 6));
  }

  return {
    technicalPrep,
    applicationStrategy,
    interviewPrep,
    salaryExpectations,
    differentiators
  };
}

function convertMarkdownToJson(markdownPath) {
  try {
    const content = fs.readFileSync(markdownPath, 'utf-8');

    const roleName = extractRoleName(content);
    const roleId = kebabCase(roleName);
    const description = extractDescription(content);
    const jobTitles = extractJobTitles(content);
    const skills = extractSkills(content);
    const dailyWork = extractDailyWork(content);
    const careerProgression = extractCareerProgression(content);
    const salaryRanges = extractSalaryRanges(content);
    const learningCurve = extractLearningCurve(content);
    const stressLevel = extractStressLevel(content);
    const personalityFit = extractPersonalityFit(content);
    const collegeStrategy = extractCollegeStrategy(content);
    const firstJobStrategy = extractFirstJobStrategy(content);

    return {
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
    };
  } catch (error) {
    throw new Error(`Error converting ${markdownPath}: ${error.message}`);
  }
}

function validateJson(data) {
  const errors = [];

  // Required fields
  if (!data.roleId) errors.push('Missing roleId');
  if (!data.roleName) errors.push('Missing roleName');
  if (!data.description) errors.push('Missing description');

  // Job titles
  if (!data.jobTitles || !data.jobTitles.fresher || data.jobTitles.fresher.length === 0) {
    errors.push('Missing or empty jobTitles.fresher');
  }
  if (!data.jobTitles || !data.jobTitles.experienced || data.jobTitles.experienced.length === 0) {
    errors.push('Missing or empty jobTitles.experienced');
  }

  // Salary validation
  if (data.salaryRanges && data.salaryRanges.fresher) {
    const { fresher } = data.salaryRanges;
    if (fresher.average && fresher.average.min > fresher.average.max) {
      errors.push('Salary min > max in fresher.average');
    }
  }

  // College strategy years
  if (!data.collegeStrategy || data.collegeStrategy.length !== 4) {
    errors.push('College strategy must have 4 years');
  }

  return errors;
}

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

  console.log('🚀 Starting batch conversion of 45 career role documents...\n');

  // Find all markdown files
  const files = findMarkdownFiles('BTech_Roles_Research');

  console.log(`📁 Found ${files.length} markdown files\n`);

  // Create output directory
  const outputDir = path.join(process.cwd(), 'output', 'roles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results = {
    successful: [],
    failed: [],
    warnings: []
  };

  // Process all files in parallel
  const promises = files.map(async (file) => {
    try {
      const data = convertMarkdownToJson(file);

      // Validate
      const validationErrors = validateJson(data);

      if (validationErrors.length > 0) {
        results.warnings.push({
          file,
          roleId: data.roleId,
          errors: validationErrors
        });
      }

      // Write JSON file
      const outputPath = path.join(outputDir, `${data.roleId}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

      results.successful.push({
        file,
        roleId: data.roleId,
        outputPath
      });

      console.log(`✅ ${data.roleName} (${data.roleId})`);
    } catch (error) {
      results.failed.push({
        file,
        error: error.message
      });
      console.error(`❌ ${path.basename(file)}: ${error.message}`);
    }
  });

  await Promise.all(promises);

  // Generate conversion report
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    successful: results.successful.length,
    failed: results.failed.length,
    warnings: results.warnings.length,
    conversionTime: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
    details: results
  };

  const reportPath = path.join(process.cwd(), 'output', 'conversion-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Generate validation log if there are warnings
  if (results.warnings.length > 0) {
    const logPath = path.join(process.cwd(), 'output', 'schema-validation-log.txt');
    const logContent = results.warnings.map(w =>
      `File: ${w.file}\nRole: ${w.roleId}\nErrors:\n${w.errors.map(e => `  - ${e}`).join('\n')}\n`
    ).join('\n---\n\n');
    fs.writeFileSync(logPath, logContent);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${results.successful.length}/${files.length}`);
  console.log(`❌ Failed: ${results.failed.length}/${files.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}/${files.length}`);
  console.log(`⏱️  Time: ${report.conversionTime}`);
  console.log('='.repeat(60));

  if (results.failed.length > 0) {
    console.log('\n❌ Failed conversions:');
    results.failed.forEach(f => {
      console.log(`  - ${path.basename(f.file)}: ${f.error}`);
    });
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️  Validation warnings:');
    results.warnings.forEach(w => {
      console.log(`  - ${w.roleId}: ${w.errors.join(', ')}`);
    });
    console.log(`\nSee output/schema-validation-log.txt for details`);
  }

  console.log(`\n📁 Output: ${outputDir}`);
  console.log(`📄 Report: ${reportPath}\n`);

  if (results.successful.length === files.length && results.warnings.length === 0) {
    console.log('🎉 All files converted successfully with no validation errors!');
    process.exit(0);
  } else if (results.failed.length === 0) {
    console.log('✅ All files converted (some with warnings)');
    process.exit(0);
  } else {
    console.log('⚠️  Conversion completed with errors');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { convertMarkdownToJson, validateJson };
