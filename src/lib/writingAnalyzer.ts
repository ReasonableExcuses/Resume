import {
  WritingInsightsResult,
  WritingObservation,
  PhraseOverlapItem,
  VerificationQuestion,
  Resume,
  JobDescription,
} from './types';

const GENERIC_BUZZWORDS = [
  'results-driven',
  'synergy',
  'go-getter',
  'team player',
  'rockstar',
  'ninja',
  'guru',
  'thought leader',
  'seasoned professional',
  'hardworking',
  'dynamic',
  'self-starter',
  'detail-oriented',
  'highly motivated',
  'proven track record',
  'best-of-breed',
  'game changer',
  'out of the box',
  'proactive',
  'strategic thinker',
];

const VAGUE_ACTION_PHRASES = [
  'responsible for',
  'worked on',
  'assisted with',
  'helped with',
  'involved in',
  'participated in',
  'handled various',
];

export function analyzeWritingPatterns(resume: Resume, job: JobDescription): WritingInsightsResult {
  const observations: WritingObservation[] = [];
  const phraseOverlapItems: PhraseOverlapItem[] = [];
  const verificationQuestions: VerificationQuestion[] = [];

  const resumeText = resume.rawText;
  const resumeLower = resumeText.toLowerCase();
  const jobLower = job.rawText.toLowerCase();

  // 1. Detect Generic Buzzwords
  let buzzwordCount = 0;
  for (const buzz of GENERIC_BUZZWORDS) {
    const regex = new RegExp(`\\b${buzz}\\b`, 'gi');
    const matches = resumeText.match(regex);
    if (matches && matches.length > 0) {
      buzzwordCount += matches.length;
      if (observations.length < 3) {
        observations.push({
          id: `obs-buzz-${buzz.replace(/\s+/g, '-')}`,
          type: 'generic_buzzword',
          severity: 'low',
          flaggedText: matches[0],
          context: `Found "${matches[0]}" in resume text`,
          reason: `"${buzz}" is a widely overused resume cliché that adds little concrete proof of capability.`,
          suggestion: `Replace with a specific technical action verb (e.g. "architected", "engineered", "orchestrated") backed by a measurable result.`,
        });
      }
    }
  }

  // 2. Detect Vague Action Starters
  for (const vague of VAGUE_ACTION_PHRASES) {
    const regex = new RegExp(`^\\s*[-•*]?\\s*${vague}\\b`, 'gim');
    const match = regex.exec(resumeText);
    if (match) {
      observations.push({
        id: `obs-vague-${vague.replace(/\s+/g, '-')}`,
        type: 'vague_metric',
        severity: 'medium',
        flaggedText: match[0].trim(),
        context: 'Work experience bullet point starter',
        reason: `Passive phrase "${vague}" obscures whether you led the initiative or merely observed it.`,
        suggestion: `Use an active leadership verb and clarify your specific contribution and outcome.`,
      });
      break;
    }
  }

  // 3. Detect Job-Description Phrase Overlap (3-gram to 5-gram)
  const jobSentences = job.rawText
    .split(/[.\n;]/)
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 25);

  let exactOverlapCount = 0;
  for (const sentence of jobSentences) {
    const words = sentence.split(/\s+/).filter((w) => w.length > 3);
    for (let i = 0; i < words.length - 3; i++) {
      const phrase = words.slice(i, i + 4).join(' ');
      if (resumeLower.includes(phrase)) {
        exactOverlapCount++;
        if (phraseOverlapItems.length < 4 && !phraseOverlapItems.some((p) => p.phrase === phrase)) {
          const isTech = /api|sql|aws|react|node|docker|test|data|cloud|agile/i.test(phrase);
          phraseOverlapItems.push({
            phrase,
            overlapType: isTech ? 'standard_industry_term' : 'exact_job_match',
            count: 1,
            relevanceExplanation: isTech
              ? 'Legitimate technical vocabulary common to modern industry roles.'
              : 'Direct phrasing match with the target job posting.',
          });
        }
      }
    }
  }

  // 4. Generate Recruiter Verification Questions for ambiguous statements
  const lines = resumeText.split('\n').filter((l) => l.trim().length > 35);
  for (const line of lines) {
    if (/spearheaded|transformed|optimized|revolutionized|streamlined/i.test(line) && !/\d+%|\$\d+/i.test(line)) {
      const snippet = line.replace(/^[•*-]\s*/, '').trim().slice(0, 90);
      verificationQuestions.push({
        id: `q-verify-${verificationQuestions.length + 1}`,
        topic: 'Quantifiable Scope & Contribution',
        flaggedResumeStatement: `"${snippet}..."`,
        recruiterQuestion: `Could you walk me through the specific steps you took on this initiative and what the measurable outcome was?`,
        suggestedLookout:
          'Listen for clear details regarding technical obstacles, team size, tools selected, and measured business impact.',
      });
      if (verificationQuestions.length >= 3) break;
    }
  }

  if (verificationQuestions.length === 0) {
    verificationQuestions.push({
      id: 'q-verify-default',
      topic: 'Technical Deep-Dive',
      flaggedResumeStatement: `"${(resume.skills.slice(0, 3).join(', ') || 'Documented stack')}..."`,
      recruiterQuestion: `What was the most challenging technical roadblock you encountered when building projects with ${resume.skills[0] || 'your core stack'}, and how did you resolve it?`,
      suggestedLookout:
        'Candidate should demonstrate in-depth problem-solving, architectural decision-making, and resilience.',
    });
  }

  const totalWords = resumeText.split(/\s+/).filter(Boolean).length || 1;
  const buzzwordDensity = Math.round((buzzwordCount / totalWords) * 1000) / 10;
  const phraseOverlapScore = Math.min(100, Math.round(exactOverlapCount * 4 + 12));
  const reviewScore = Math.max(50, Math.min(98, Math.round(100 - buzzwordDensity * 5 - (observations.length > 2 ? 10 : 0))));

  return {
    reviewScore,
    phraseOverlapScore,
    buzzwordDensity,
    observations,
    phraseOverlapItems,
    recruiterVerificationQuestions: verificationQuestions,
    disclaimer:
      'AI Writing & Authenticity Review provides stylistic observations and verification prompts to assist human review. High phrase overlap is expected in well-tailored resumes and must never be treated as proof of deception or dishonesty. Human interviewers should always lead evaluation.',
  };
}
