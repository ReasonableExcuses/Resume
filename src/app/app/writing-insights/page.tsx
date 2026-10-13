'use client';

import React, { useState } from 'react';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '@/lib/sampleData';
import { analyzeWritingPatterns } from '@/lib/writingAnalyzer';
import { WritingInsightCard } from '@/components/WritingInsightCard';
import { Resume, JobDescription } from '@/lib/types';
import { PenTool, Sparkles } from 'lucide-react';

export default function WritingInsightsPage() {
  const [selectedResume, setSelectedResume] = useState<Resume>(SAMPLE_RESUMES[0]);
  const [selectedJob, setSelectedJob] = useState<JobDescription>(SAMPLE_JOBS[0]);

  const insights = analyzeWritingPatterns(selectedResume, selectedJob);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 mb-2">
          <PenTool className="h-3.5 w-3.5" /> Stylistic & Authenticity Review
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          AI Writing & Authenticity Insights
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
          Evaluate generic buzzwords, job-description phrase overlap, and generate interviewer verification prompts without unfair automated discrimination.
        </p>
      </div>

      {/* Selectors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Candidate Resume
          </label>
          <select
            value={selectedResume.id}
            onChange={(e) => {
              const found = SAMPLE_RESUMES.find((r) => r.id === e.target.value);
              if (found) setSelectedResume(found);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
          >
            {SAMPLE_RESUMES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.candidateName} — {r.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Target Job Description (For Phrase Overlap)
          </label>
          <select
            value={selectedJob.id}
            onChange={(e) => {
              const found = SAMPLE_JOBS.find((j) => j.id === e.target.value);
              if (found) setSelectedJob(found);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
          >
            {SAMPLE_JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      <WritingInsightCard writingInsights={insights} />
    </div>
  );
}
