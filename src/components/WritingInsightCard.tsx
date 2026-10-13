'use client';

import React, { useState } from 'react';
import { WritingInsightsResult } from '@/lib/types';
import { Sparkles, HelpCircle, Shield, Copy, Check, AlertCircle } from 'lucide-react';

interface WritingInsightCardProps {
  writingInsights: WritingInsightsResult;
}

export function WritingInsightCard({ writingInsights }: WritingInsightCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyQuestion = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">AI Writing & Authenticity Insights</h3>
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Grounded Writing Index: {writingInsights.reviewScore}/100
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Assesses phrase specificity, buzzword density, and job-description overlap.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase">Buzzword Density</span>
            <span className="text-sm font-bold text-slate-800">{writingInsights.buzzwordDensity}%</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-center">
            <span className="block text-[10px] font-semibold text-slate-500 uppercase">Phrase Overlap</span>
            <span className="text-sm font-bold text-slate-800">{writingInsights.phraseOverlapScore}%</span>
          </div>
        </div>
      </div>

      {/* Prominent Ethical Disclaimer Alert */}
      <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900">
        <div className="flex items-start gap-2.5">
          <Shield className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Responsible Review Notice: </span>
            {writingInsights.disclaimer}
          </div>
        </div>
      </div>

      {/* Observations Section */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Writing Style Observations ({writingInsights.observations.length})
        </h4>
        <div className="space-y-3">
          {writingInsights.observations.map((obs) => (
            <div
              key={obs.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Flagged: &quot;{obs.flaggedText}&quot;</span>
                <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 capitalize">
                  {obs.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-1 text-slate-600">{obs.reason}</p>
              <div className="mt-2 rounded-md bg-white border border-slate-200 p-2 text-indigo-700 font-medium">
                <span className="font-bold">Suggestion: </span>
                {obs.suggestion}
              </div>
            </div>
          ))}

          {writingInsights.observations.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
              No generic clichés or vague statements identified. Writing appears specific and concrete.
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Interview Verification Prompts */}
      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
          Suggested Recruiter Verification Questions ({writingInsights.recruiterVerificationQuestions.length})
        </h4>
        <div className="space-y-3">
          {writingInsights.recruiterVerificationQuestions.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-4 text-xs space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-indigo-950">Topic: {q.topic}</span>
                <button
                  onClick={() => handleCopyQuestion(q.id, q.recruiterQuestion)}
                  className="inline-flex items-center gap-1 rounded border border-indigo-200 bg-white px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  {copiedId === q.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy Question
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-md bg-white border border-indigo-100 p-2.5 text-slate-800">
                <span className="font-bold text-indigo-600">Question for candidate: </span>
                &quot;{q.recruiterQuestion}&quot;
              </div>

              <div className="text-slate-500 text-[11px]">
                <span className="font-semibold text-slate-600">What to look for: </span>
                {q.suggestedLookout}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
