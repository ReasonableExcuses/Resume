import {
  Resume,
  JobDescription,
  SkillAnalysis,
  SkillMatchItem,
  ExperienceAnalysis,
  CategoryScores,
  Recommendation,
} from './types';

// Transferable skill mappings
const TRANSFERABLE_MAP: Record<string, string[]> = {
  kubernetes: ['docker', 'aws ecs', 'containerization'],
  terraform: ['aws', 'cloudformation', 'infrastructure', 'ci/cd'],
  fastapi: ['flask', 'django', 'express', 'node.js', 'python'],
  graphql: ['rest', 'restful apis', 'api design'],
  'power bi': ['tableau', 'looker', 'data visualization'],
  snowflake: ['bigquery', 'redshift', 'postgresql', 'sql'],
  dbt: ['sql', 'etl', 'data warehousing', 'data pipelines'],
  pmp: ['agile', 'scrum', 'project management', 'jira'],
};

export function analyzeSkills(resume: Resume, job: JobDescription): SkillAnalysis {
  const resumeText = resume.rawText.toLowerCase();
  const resumeSkillsLower = resume.skills.map((s) => s.toLowerCase());

  const matchedItems: SkillMatchItem[] = [];

  // Check required skills
  for (const reqSkill of job.requiredSkills) {
    const skillLower = reqSkill.toLowerCase();
    const isExplicitlyListed = resumeSkillsLower.some(
      (s) => s.includes(skillLower) || skillLower.includes(s)
    );
    const isInText = resumeText.includes(skillLower);

    if (isExplicitlyListed && isInText) {
      // Find evidence context snippet
      const index = resumeText.indexOf(skillLower);
      const snippet = resume.rawText.slice(Math.max(0, index - 40), Math.min(resume.rawText.length, index + 80)).replace(/\n/g, ' ').trim();

      matchedItems.push({
        skill: reqSkill,
        status: 'strong',
        evidenceInResume: snippet ? `"...${snippet}..."` : 'Found in skills and professional experience.',
        requiredByJob: true,
        importance: 'critical',
        rationale: 'Demonstrated in documented work experience and technical skills list.',
      });
    } else if (isExplicitlyListed || isInText) {
      matchedItems.push({
        skill: reqSkill,
        status: 'partial',
        evidenceInResume: 'Mentioned in resume without extensive project details.',
        requiredByJob: true,
        importance: 'critical',
        rationale: 'Skill is present but lacks concrete achievement metrics in the experience section.',
      });
    } else {
      // Check transferable skills
      const related = TRANSFERABLE_MAP[skillLower] || [];
      const hasTransferable = related.some((rel) => resumeText.includes(rel));

      if (hasTransferable) {
        matchedItems.push({
          skill: reqSkill,
          status: 'transferable',
          evidenceInResume: `Related capabilities detected (${related.filter((r) => resumeText.includes(r)).join(', ')}).`,
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Candidate possesses directly transferable domain experience.',
        });
      } else {
        matchedItems.push({
          skill: reqSkill,
          status: 'missing',
          evidenceInResume: 'Not found in the uploaded document.',
          requiredByJob: true,
          importance: 'critical',
          rationale: 'Required skill was not explicitly evidenced in the resume.',
        });
      }
    }
  }

  // Check preferred skills
  for (const prefSkill of job.preferredSkills) {
    const skillLower = prefSkill.toLowerCase();
    const isExplicitlyListed = resumeSkillsLower.some(
      (s) => s.includes(skillLower) || skillLower.includes(s)
    );
    const isInText = resumeText.includes(skillLower);

    if (isExplicitlyListed && isInText) {
      matchedItems.push({
        skill: prefSkill,
        status: 'strong',
        evidenceInResume: 'Found in resume technical skills.',
        requiredByJob: false,
        importance: 'preferred',
        rationale: 'Strong preferred qualification match.',
      });
    } else if (isExplicitlyListed || isInText) {
      matchedItems.push({
        skill: prefSkill,
        status: 'partial',
        evidenceInResume: 'Mentioned briefly.',
        requiredByJob: false,
        importance: 'preferred',
        rationale: 'Preferred skill acknowledged.',
      });
    } else {
      matchedItems.push({
        skill: prefSkill,
        status: 'missing',
        evidenceInResume: 'Not found in the uploaded document.',
        requiredByJob: false,
        importance: 'preferred',
        rationale: 'Preferred skill was not evidenced in the resume.',
      });
    }
  }

  const strongCount = matchedItems.filter((i) => i.status === 'strong').length;
  const partialCount = matchedItems.filter((i) => i.status === 'partial').length;
  const missingCount = matchedItems.filter((i) => i.status === 'missing').length;
  const transferableCount = matchedItems.filter((i) => i.status === 'transferable').length;

  return {
    matchedCount: strongCount,
    partialCount,
    missingCount,
    transferableCount,
    skills: matchedItems,
  };
}

export function analyzeExperience(resume: Resume, job: JobDescription): ExperienceAnalysis {
  const reqYears = job.experienceYears || 3;
  // Estimate documented years from resume experience dates
  let documentedYears = 0;
  if (resume.experience && resume.experience.length > 0) {
    documentedYears = resume.experience.length * 2.2;
  } else {
    // Look for year numbers in text
    const yearsMatch = resume.rawText.match(/(\d+)\+?\s*years/i);
    documentedYears = yearsMatch ? parseFloat(yearsMatch[1]) : 4.0;
  }

  // Extract achievements with numbers or percentages
  const lines = resume.rawText.split('\n');
  const keyAchievements: string[] = [];
  for (const line of lines) {
    if (/\d+%\s*|\$\d+|\d+\s*hours|\d+\s*users|\d+\s*million|\d+\s*engineers/i.test(line)) {
      const clean = line.replace(/^[•\s\t*-]+/, '').trim();
      if (clean.length > 30 && clean.length < 200 && keyAchievements.length < 4) {
        keyAchievements.push(clean);
      }
    }
  }

  if (keyAchievements.length === 0) {
    keyAchievements.push('Demonstrated leadership in production deliverables and architectural responsibilities.');
  }

  const relevanceScore = Math.min(
    100,
    Math.round((Math.min(documentedYears, reqYears * 1.5) / reqYears) * 85 + (keyAchievements.length >= 2 ? 15 : 5))
  );

  return {
    relevanceScore,
    documentedYears: Math.round(documentedYears * 10) / 10,
    requiredYears: reqYears,
    keyAchievements,
    unsupportedClaims: [
      'High-level technical buzzwords in summary could be supported by more quantifiable engineering metrics.',
    ],
    missingExperienceAreas: [
      'Direct domain experience in target industry if transitioning from a different vertical.',
    ],
    summary: `Candidate documents approximately ${Math.round(documentedYears * 10) / 10} years of experience against the ${reqYears} years requested by the role.`,
  };
}

export function calculateScores(
  skillAnalysis: SkillAnalysis,
  experienceAnalysis: ExperienceAnalysis,
  resume: Resume,
  job: JobDescription
): { overallScore: number; categoryScores: CategoryScores } {
  // Required Skills Score (35%)
  const totalCritical = skillAnalysis.skills.filter((s) => s.requiredByJob).length || 1;
  const criticalStrong = skillAnalysis.skills.filter((s) => s.requiredByJob && s.status === 'strong').length;
  const criticalPartial = skillAnalysis.skills.filter((s) => s.requiredByJob && s.status === 'partial').length;
  const criticalTransferable = skillAnalysis.skills.filter((s) => s.requiredByJob && s.status === 'transferable').length;

  const skillScore = Math.min(
    100,
    Math.round(
      ((criticalStrong * 1.0 + criticalPartial * 0.6 + criticalTransferable * 0.75) / totalCritical) * 100
    )
  );

  // Work Experience Score (25%)
  const expScore = experienceAnalysis.relevanceScore;

  // Responsibilities Alignment (15%)
  let respMatchCount = 0;
  const resumeTextLower = resume.rawText.toLowerCase();
  for (const resp of job.responsibilities) {
    const keyWords = resp
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const matches = keyWords.filter((w) => resumeTextLower.includes(w)).length;
    if (matches >= 2) respMatchCount++;
  }
  const totalResp = job.responsibilities.length || 1;
  const respScore = Math.min(100, Math.round((respMatchCount / totalResp) * 100));

  // Education Score (10%)
  let eduScore = 80;
  if (resume.education && resume.education.length > 0) {
    eduScore = 95;
  }

  // Project / Achievement Evidence Score (15%)
  const projectScore = experienceAnalysis.keyAchievements.length >= 2 ? 90 : 70;

  // Weighted Total
  const overall = Math.round(
    skillScore * 0.35 +
    expScore * 0.25 +
    respScore * 0.15 +
    eduScore * 0.10 +
    projectScore * 0.15
  );

  const categoryScores: CategoryScores = {
    requiredSkills: skillScore,
    workExperience: expScore,
    responsibilities: respScore,
    educationCertifications: eduScore,
    projectEvidence: projectScore,
  };

  return { overallScore: Math.max(30, Math.min(99, overall)), categoryScores };
}

export function generateRecommendations(
  skillAnalysis: SkillAnalysis,
  job: JobDescription,
  resume: Resume
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Missing Critical Skills
  const missingCritical = skillAnalysis.skills.filter((s) => s.requiredByJob && s.status === 'missing');
  if (missingCritical.length > 0) {
    const firstMissing = missingCritical[0].skill;
    recs.push({
      id: 'rec-missing-skill',
      category: 'skill_gap',
      priority: 'high',
      title: `Address Missing Skill: ${firstMissing}`,
      description: `The job description lists ${firstMissing} as an essential requirement. If you possess this experience, explicitly detail it under your recent roles.`,
      actionableStep: `Incorporate 1 bullet point explaining how you utilized ${firstMissing} in a recent project. Never invent skills you do not possess.`,
    });
  }

  // 2. Partial Skills Needing Concrete Metrics
  const partialSkills = skillAnalysis.skills.filter((s) => s.status === 'partial');
  if (partialSkills.length > 0) {
    const firstPartial = partialSkills[0].skill;
    recs.push({
      id: 'rec-partial-evidence',
      category: 'impact_metric',
      priority: 'medium',
      title: `Quantify Impact for ${firstPartial}`,
      description: `You list ${firstPartial} in your skills, but your professional experience section does not clearly establish the business outcome or scope.`,
      actionableStep: `Tie ${firstPartial} to a measurable metric (e.g. latency, revenue, test coverage, or team size).`,
      exampleDiff: {
        original: `Worked with ${firstPartial} on internal platforms.`,
        suggested: `Leveraged ${firstPartial} to optimize workflow throughput by 25% across 4 production squads.`,
      },
    });
  }

  // 3. Section Positioning
  recs.push({
    id: 'rec-reorder-sections',
    category: 'positioning',
    priority: 'low',
    title: 'Align Role Keywords with Target Title',
    description: `Target role is "${job.title}". Ensure your professional summary immediately aligns with this specialization to capture the reviewer's attention in the initial 6 seconds.`,
    actionableStep: `Update the opening line of your summary to reflect "${job.title}" competencies.`,
  });

  return recs;
}
