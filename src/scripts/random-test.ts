
import { quizQuestions, calculateQuizResults, QuizAnswer } from '../data/quiz';

// Simple seeded random number generator (Linear Congruential Generator)
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

const rng = new SeededRandom(12345); // Fixed seed for reproducible baseline

function pickRandom(options: { value: string; weight: number }[]): string {
  const totalWeight = options.reduce((sum, opt) => sum + (opt.weight || 1), 0);
  let random = rng.next() * totalWeight;
  
  for (const opt of options) {
    random -= (opt.weight || 1);
    if (random <= 0) return opt.value;
  }
  return options[0].value;
}

interface Persona {
  name: string;
  expectedTopRoles: string[]; // Roles we expect to see in top 3
  answerBiases: Record<string, Record<string, number>>; // Question ID -> Answer Value -> Weight (higher = more likely)
}

const personas: Persona[] = [
  {
    name: "The Frontend Specialist",
    expectedTopRoles: ['frontend-engineer-developer', 'ux-ui-designer', 'full-stack-engineer-developer', 'mobile-developer'],
    answerBiases: {
      'q1': { 'visual': 10 },
      'q2': { 'standard': 5, 'hybrid': 2 }, // Career path
      'q3': { 'minimal': 5, 'good': 2 },
      'q8': { 'user': 10 }, // Impact
      'q12': { 'creative': 10 }
    }
  },
  {
    name: "The Backend/Systems Engineer",
    expectedTopRoles: ['backend-engineer-developer', 'cloud-engineer-architect', 'site-reliability-engineer', 'platform-engineer'],
    answerBiases: {
      'q1': { 'systems': 10 },
      'q2': { 'standard': 8 },
      'q3': { 'good': 5, 'expert': 2 },
      'q8': { 'technical': 10 },
      'q12': { 'systems': 10 }
    }
  },
  {
    name: "The Data Scientist",
    expectedTopRoles: ['data-scientist', 'machine-learning-engineer', 'data-analyst', 'ai-engineer'],
    answerBiases: {
      'q1': { 'data': 10 },
      'q2': { 'standard': 5, 'specialized': 5 },
      'q3': { 'expert': 10 },
      'q8': { 'business': 5, 'innovation': 5 },
      'q12': { 'analytical': 10 }
    }
  },
  {
    name: "The Product Manager",
    expectedTopRoles: ['product-manager-technical', 'technical-program-manager', 'solution-architect'],
    answerBiases: {
      'q1': { 'visual': 3, 'data': 3 },
      'q2': { 'hybrid': 10 },
      'q5': { 'team': 10 },
      'q8': { 'business': 8, 'user': 5 },
      'q10': { 'love': 10 }, // Communication
      'q11': { 'yes': 10 }   // Leadership
    }
  },
  {
    name: "The Startup Founder",
    expectedTopRoles: ['startup-founder', 'product-manager-technical', 'sales-engineer'],
    answerBiases: {
      'q1': { 'systems': 5, 'visual': 3 },
      'q2': { 'unconventional': 10, 'hybrid': 3 },
      'q4': { 'thrive': 10 }, // Pressure
      'q6': { 'secondary': 8, 'flexible': 5 }, // Work life
      'q8': { 'business': 5, 'innovation': 5 },
      'q9': { 'top': 5, 'secondary': 5 }, // Salary varies
      'q11': { 'yes': 8 }
    }
  },
  {
    name: "The Security Pro",
    expectedTopRoles: ['security-engineer', 'cybersecurity-analyst', 'penetration-tester'],
    answerBiases: {
      'q1': { 'security': 10 },
      'q2': { 'specialized': 10, 'standard': 3 },
      'q4': { 'thrive': 5, 'handle': 5 },
      'q8': { 'technical': 5 },
      'q12': { 'security': 10 }
    }
  },
  {
    name: "The Academic Researcher",
    expectedTopRoles: ['research-scientist-industry', 'ai-engineer', 'data-scientist', 'academic-researcher', 'quantum-computing-engineer'],
    answerBiases: {
      'q1': { 'data': 8 },
      'q2': { 'unconventional': 5, 'specialized': 5 },
      'q3': { 'expert': 10 },
      'q5': { 'independent': 8, 'solo': 5 },
      'q7': { 'love': 5, 'selective': 5 }, // Learning
      'q8': { 'innovation': 10 }
    }
  },
   {
    name: "The DevRel / Evangelist",
    expectedTopRoles: ['developer-advocate', 'sales-engineer', 'technical-writer'],
    answerBiases: {
      'q1': { 'visual': 4, 'systems': 3 },
      'q2': { 'hybrid': 10 },
      'q5': { 'team': 8 },
      'q10': { 'love': 10 }, // Presenting
      'q11': { 'no': 2, 'technical': 2 } 
    }
  }
];

function runSimulation() {
  console.log('🚀 Starting Random Scenario Verification...\n');

  let passed = 0;
  let total = 0;

  personas.forEach(persona => {
    console.log(`\n----------------------------------------`);
    console.log(`👤 Simulating: ${persona.name}`);
    console.log(`----------------------------------------`);

    // Run 2 iterations per persona to test variety
    for (let i = 0; i < 2; i++) {
        total++;
        const answers: QuizAnswer[] = quizQuestions.map(q => {
            const biases = persona.answerBiases[q.id] || {};
            
            // Build weighted options for this question
            const options = (q.options || []).map(opt => ({
                value: opt.value,
                // Default weight is 1, unless specified in persona bias
                weight: biases[opt.value] || 1
            }));

            return {
                questionId: q.id,
                answer: pickRandom(options)
            };
        });

        const results = calculateQuizResults(answers);
        const topResult = results[0];
        const top3Ids = results.slice(0, 3).map(r => r.roleId);
        
        // Check if ANY of the expected roles are in the top 3
        const isMatch = top3Ids.some(id => persona.expectedTopRoles.includes(id));
        
        console.log(`   Run #${i + 1}: Top 3 -> ${top3Ids.join(', ')}`);
        
        if (isMatch) {
            // Stronger check: Is the #1 result expected?
             if (persona.expectedTopRoles.includes(topResult.roleId)) {
                 console.log(`   ✅ Perfect Match (#1 is expected)`);
                 passed++;
             } else {
                 console.log(`   ⚠️ Good Match (Expected role in Top 3 but not #1)`);
                 // Count as pass for now, but note it
                 passed++; 
             }
        } else {
            console.log(`   ❌ FAIL: Expected one of [${persona.expectedTopRoles.join(', ')}]`);
            // Print answers for debugging
            console.log('   Answers:', answers.map(a => `${a.questionId}:${a.answer}`).join(', '));
        }
    }
  });

  console.log(`\n----------------------------------------`);
  console.log(`🎉 Summary: ${passed}/${total} Scenarios Passed`);
  console.log(`----------------------------------------`);
}

runSimulation();
