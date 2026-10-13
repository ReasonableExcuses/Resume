import test from 'node:test';
import assert from 'node:assert/strict';

import { parseResumeBuffer, detectLayoutStructure, extractContactInfo } from '../src/lib/documentParser';
import { runATSInspection } from '../src/lib/atsSimulator';
import { analyzeSkills, analyzeExperience, calculateScores } from '../src/lib/matchEngine';
import { analyzeWritingPatterns } from '../src/lib/writingAnalyzer';
import { chunkResume, retrieveRelevantChunks, answerResumeQuestion } from '../src/lib/ragEngine';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '../src/lib/sampleData';
import { getResumeById, deleteResume, saveResume } from '../src/lib/db';

test('Scenario 1: Document parser extracts contact info and text from valid document', async () => {
  const sampleText = `JANE DOE\nSan Francisco, CA | jane.doe@example.com | (555) 123-4567\nSUMMARY\nExperienced Software Engineer specialized in React and Node.js.`;
  const buffer = Buffer.from(sampleText, 'utf-8');
  const result = await parseResumeBuffer(buffer, 'text', 'jane_doe.txt');

  assert.equal(result.candidateName, 'JANE DOE');
  assert.equal(result.email, 'jane.doe@example.com');
  assert.equal(result.phone, '(555) 123-4567');
  assert.ok(result.rawText.includes('Software Engineer'));
});

test('Scenario 2: Unreadable or empty document returns a helpful error', async () => {
  const emptyBuffer = Buffer.from('', 'utf-8');
  await assert.rejects(
    async () => {
      await parseResumeBuffer(emptyBuffer, 'text', 'empty.txt');
    },
    {
      message: /couldn't extract readable text/,
    }
  );
});

test('Scenario 3: Multi-column layout triggers warning only when heuristics detect it', () => {
  const singleColumnLayout = detectLayoutStructure(
    'Alex Rivera\nSan Francisco, CA\nSummary: Software Engineer with experience in cloud.\nTechnical skills: TypeScript, Node.js.\nExperience: Senior Engineer at Vanguard Cloud.',
    'pdf'
  );
  assert.equal(singleColumnLayout.detectedColumns, 1);

  // Resume with 2-column layout (Priya Sharma)
  const priyaResume = SAMPLE_RESUMES[1];
  const atsResult = runATSInspection(
    priyaResume.rawText,
    priyaResume.layoutStructure,
    priyaResume.candidateName,
    priyaResume.email,
    priyaResume.phone
  );

  const columnFinding = atsResult.findings.find((f) => f.id === 'ats-multi-column');
  assert.ok(columnFinding, 'Multi-column warning should be triggered for 2-column document');
  assert.equal(columnFinding.severity, 'medium');
});

test('Scenario 4: Missing required skill is reported as "not found in the resume", not proof candidate lacks it', () => {
  const resume = SAMPLE_RESUMES[0]; // Alex Rivera (does not have Terraform)
  const job = SAMPLE_JOBS[0];

  const analysis = analyzeSkills(resume, job);
  const terraform = analysis.skills.find((s) => s.skill.toLowerCase().includes('terraform'));

  assert.ok(terraform);
  assert.equal(terraform.status, 'missing');
  assert.ok(
    terraform.evidenceInResume?.includes('Not found in the uploaded document'),
    'Must clearly indicate lack of document evidence rather than claiming person cannot do it'
  );
});

test('Scenario 5: Match score is calculated from documented scoring weights (35%, 25%, 15%, 10%, 15%)', () => {
  const resume = SAMPLE_RESUMES[0];
  const job = SAMPLE_JOBS[0];

  const skillAnalysis = analyzeSkills(resume, job);
  const experienceAnalysis = analyzeExperience(resume, job);
  const { overallScore, categoryScores } = calculateScores(skillAnalysis, experienceAnalysis, resume, job);

  assert.ok(overallScore >= 0 && overallScore <= 100);
  assert.ok(categoryScores.requiredSkills >= 0 && categoryScores.requiredSkills <= 100);
  assert.ok(categoryScores.workExperience >= 0 && categoryScores.workExperience <= 100);

  // Verify weighted formula calculation
  const manualCalc = Math.round(
    categoryScores.requiredSkills * 0.35 +
    categoryScores.workExperience * 0.25 +
    categoryScores.responsibilities * 0.15 +
    categoryScores.educationCertifications * 0.10 +
    categoryScores.projectEvidence * 0.15
  );
  assert.equal(overallScore, manualCalc);
});

test('Scenario 6: RAG Chatbot answers questions using retrieved document passages', async () => {
  const resume = SAMPLE_RESUMES[0];
  const response = await answerResumeQuestion('Does Alex have experience with Next.js or React?', resume);

  assert.ok(response.answer.includes('Next.js') || response.answer.includes('React'));
  assert.ok(response.citations.length > 0, 'Must include citations');
  assert.equal(response.citations[0].page, 1);
});

test('Scenario 7: RAG Chatbot acknowledges when sufficient evidence is unavailable without hallucinating', async () => {
  const resume = SAMPLE_RESUMES[0];
  const response = await answerResumeQuestion('Does Alex have experience with quantum computing algorithms?', resume);

  assert.ok(
    response.isUnsupportedWarning === true ||
    response.answer.includes("I couldn't find sufficient evidence")
  );
});

test('Scenario 8: Chatbot citations preserve genuine page numbers and section names', () => {
  const resume = SAMPLE_RESUMES[0];
  const chunks = chunkResume(resume);

  assert.ok(chunks.length > 0);
  assert.ok(chunks[0].page >= 1);
  assert.ok(chunks[0].section.length > 0);
});

test('Scenario 9: Deleting a resume invalidates stored records according to retention policy', async () => {
  const tempResume = {
    ...SAMPLE_RESUMES[0],
    id: `temp-delete-test-${Date.now()}`,
  };
  await saveResume(tempResume);

  const found = await getResumeById(tempResume.id);
  assert.ok(found);

  const deleted = await deleteResume(tempResume.id);
  assert.equal(deleted, true);

  const afterDelete = await getResumeById(tempResume.id);
  assert.equal(afterDelete, null);
});

test('Scenario 10: AI Writing Insights provides responsible, non-punitive review and disclaimer', () => {
  const resume = SAMPLE_RESUMES[0];
  const job = SAMPLE_JOBS[0];
  const insights = analyzeWritingPatterns(resume, job);

  assert.ok(insights.reviewScore >= 0 && insights.reviewScore <= 100);
  assert.ok(insights.disclaimer.includes('never be treated as proof of deception or dishonesty'));
  assert.ok(insights.recruiterVerificationQuestions.length > 0);
});

test('Scenario 11: Demo mode operates with built-in high-fidelity sample data without external API keys', () => {
  assert.equal(SAMPLE_RESUMES.length, 3);
  assert.equal(SAMPLE_JOBS.length, 3);
  assert.ok(SAMPLE_RESUMES.find((r) => r.candidateName === 'Alex Rivera'));
  assert.ok(SAMPLE_RESUMES.find((r) => r.candidateName === 'Priya Sharma'));
  assert.ok(SAMPLE_RESUMES.find((r) => r.candidateName === 'Marcus Chen'));
});
