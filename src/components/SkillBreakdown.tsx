'use client';

import React, { useState } from 'react';
import { SkillAnalysis, SkillMatchItem } from '@/lib/types';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRightLeft, Sparkles } from 'lucide-react';

interface SkillBreakdownProps {
  skillAnalysis: SkillAnalysis;
}

export function SkillBreakdown({ skillAnalysis }: SkillBreakdownProps) {
  const [filter, setFilter] = useState<'all' | 'strong' | 'partial' | 'missing' | 'transferable'>('all');

  const filteredSkills = skillAnalysis.skills.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Skill Alignment & Gap Analysis</h3>
          <p className="text-xs text-slate-500">
            Transparent breakdown of documented skills against job requirements.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {skillAnalysis.matchedCount} Strong
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <AlertCircle className="h-3.5 w-3.5" />
            {skillAnalysis.partialCount} Partial
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            <HelpCircle className="h-3.5 w-3.5" />
            {skillAnalysis.missingCount} Missing
          </span>
          {skillAnalysis.transferableCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              <ArrowRightLeft className="h-3.5 w-3.5" />
              {skillAnalysis.transferableCount} Transferable
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-5 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {(
          [
            { id: 'all', label: `All (${skillAnalysis.skills.length})` },
            { id: 'strong', label: `Strong Matches (${skillAnalysis.matchedCount})` },
            { id: 'partial', label: `Needs Detail (${skillAnalysis.partialCount})` },
            { id: 'missing', label: `Missing Gaps (${skillAnalysis.missingCount})` },
            { id: 'transferable', label: `Transferable (${skillAnalysis.transferableCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.id
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skill Cards Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {filteredSkills.map((item, idx) => {
          let statusBadge = (
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Strong Match
            </span>
          );
          let borderAccent = 'border-l-4 border-l-emerald-500';

          if (item.status === 'partial') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                <AlertCircle className="h-3 w-3" /> Partial Demonstration
              </span>
            );
            borderAccent = 'border-l-4 border-l-amber-500';
          } else if (item.status === 'missing') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                <HelpCircle className="h-3 w-3" /> Missing from Resume
              </span>
            );
            borderAccent = 'border-l-4 border-l-rose-500';
          } else if (item.status === 'transferable') {
            statusBadge = (
              <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
                <ArrowRightLeft className="h-3 w-3" /> Transferable Skill
              </span>
            );
            borderAccent = 'border-l-4 border-l-indigo-500';
          }

          return (
            <div
              key={`${item.skill}-${idx}`}
              className={`flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-xs ${borderAccent}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{item.skill}</span>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                      {item.requiredByJob ? 'Required' : 'Preferred'}
                    </span>
                  </div>
                  {statusBadge}
                </div>

                <p className="mt-2 text-xs text-slate-600">{item.rationale}</p>

                {item.evidenceInResume && (
                  <div className="mt-2.5 rounded-lg border border-slate-200/80 bg-white p-2.5 text-[11px] text-slate-700">
                    <span className="font-semibold text-slate-500">Document Evidence: </span>
                    <span className="italic">{item.evidenceInResume}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSkills.length === 0 && (
        <div className="py-8 text-center text-xs text-slate-500">
          No skills found under this filter category.
        </div>
      )}
    </div>
  );
}
