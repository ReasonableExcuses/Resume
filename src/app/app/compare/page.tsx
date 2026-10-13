'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '@/lib/sampleData';
import { CandidateComparison } from '@/lib/types';
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function CandidateComparisonPage() {
  const [selectedJobId, setSelectedJobId] = useState(SAMPLE_JOBS[0].id);
  const [selectedResumeIds, setSelectedResumeIds] = useState<string[]>([
    'res-alex-rivera',
    'res-priya-sharma',
    'res-marcus-chen',
  ]);
  const [comparison, setComparison] = useState<CandidateComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'overall' | 'ats' | 'skills' | 'experience'>('overall');

  const fetchComparison = async (jobId: string, resumeIds: string[]) => {
    setLoading(true);
    try {
      const res = await fetch('/api/candidates/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescriptionId: jobId,
          resumeIds,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setComparison(json.data);
      }
    } catch (err) {
      console.error('Error fetching comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(selectedJobId, selectedResumeIds);
  }, [selectedJobId, selectedResumeIds]);

  const toggleCandidateSelection = (rId: string) => {
    if (selectedResumeIds.includes(rId)) {
      if (selectedResumeIds.length <= 2) {
        alert('Please keep at least 2 candidates selected for comparison.');
        return;
      }
      setSelectedResumeIds(selectedResumeIds.filter((id) => id !== rId));
    } else {
      setSelectedResumeIds([...selectedResumeIds, rId]);
    }
  };

  const sortedCandidates = comparison
    ? [...comparison.candidates].sort((a, b) => {
        if (sortBy === 'overall') return b.overallScore - a.overallScore;
        if (sortBy === 'ats') return b.atsScore - a.atsScore;
        if (sortBy === 'skills') return b.matchedSkillsCount - a.matchedSkillsCount;
        if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
        return 0;
      })
    : [];

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
          <Users className="h-3.5 w-3.5" /> Recruiter Decision-Support Matrix
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Candidate Comparison
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
          Compare multiple candidates against the same job requisition using transparent, job-related criteria.
        </p>
      </div>

      {/* Fair Hiring Compliance Notice */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Fair Hiring & Responsible Decision Support: </span>
            This comparison platform assists human hiring teams by summarizing documented qualifications. Match scores and ATS indicators are decision-support estimates and must never replace live interviews, verified employment records, or fair recruitment practices.
          </div>
        </div>
      </div>

      {/* Requisition & Candidate Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Target Requisition
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
            >
              {SAMPLE_JOBS.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Sort Matrix By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-hidden"
            >
              <option value="overall">Overall Alignment Score</option>
              <option value="ats">ATS Parsing Health</option>
              <option value="skills">Matched Skills Count</option>
              <option value="experience">Documented Years</option>
            </select>
          </div>
        </div>

        {/* Candidate Checkboxes */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
            Active Candidates:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_RESUMES.map((r) => {
              const isSelected = selectedResumeIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  onClick={() => toggleCandidateSelection(r.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {r.candidateName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Table Matrix */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
            Generating side-by-side qualification alignment matrix...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-4 px-6 min-w-[180px]">Candidate Profile</th>
                  <th className="py-4 px-6 min-w-[130px]">Match Score</th>
                  <th className="py-4 px-6 min-w-[130px]">ATS Score</th>
                  <th className="py-4 px-6 min-w-[160px]">Skills Alignment</th>
                  <th className="py-4 px-6 min-w-[130px]">Experience</th>
                  <th className="py-4 px-6 min-w-[200px]">Identified Gaps</th>
                  <th className="py-4 px-6 text-right min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedCandidates.map((cand) => (
                  <tr key={cand.resumeId} className="hover:bg-slate-50/50 transition-colors">
                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block text-sm">
                        {cand.candidateName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cand.summaryNotes.slice(0, 50)}...
                      </span>
                    </td>

                    {/* Overall Score */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 font-black text-sm px-2.5 py-1 rounded-lg ${
                          cand.overallScore >= 85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : cand.overallScore >= 70
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {cand.overallScore}%
                      </span>
                    </td>

                    {/* ATS Score */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800">{cand.atsScore}/100</span>
                      <span className="block text-[10px] text-slate-400">
                        {cand.atsScore >= 85 ? 'Single-column pass' : 'Multi-column warning'}
                      </span>
                    </td>

                    {/* Skills */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">
                        {cand.matchedSkillsCount} of {cand.totalRequiredSkills}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        Direct requirements evidenced
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">
                        {cand.experienceYears} Years
                      </span>
                      <span className="text-[10px] text-slate-400 block">Documented depth</span>
                    </td>

                    {/* Gaps */}
                    <td className="py-4 px-6">
                      {cand.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {cand.missingSkills.slice(0, 3).map((ms, i) => (
                            <span
                              key={i}
                              className="rounded bg-rose-50 border border-rose-200 text-rose-700 px-1.5 py-0.5 text-[10px] font-semibold"
                            >
                              {ms}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[11px]">
                          ✓ Zero critical skill gaps
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/app/chat?resumeId=${cand.resumeId}`}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 shadow-2xs"
                        >
                          Chat RAG
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
