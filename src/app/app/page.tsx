'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { MetricCard } from '@/components/MetricCard';
import { ScoreGauge } from '@/components/ScoreGauge';
import { AnalysisResult } from '@/lib/types';
import {
  FileText,
  Percent,
  Cpu,
  CheckSquare,
  Plus,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, role, switchRole, isDemoMode } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/analyses');
        const json = await res.json();
        if (json.success && json.data) {
          setAnalyses(json.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard analyses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalResumes = analyses.length;
  const avgMatchScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((acc, curr) => acc + curr.overallMatchScore, 0) / analyses.length
        )
      : 88;
  const latestATS = analyses.length > 0 ? analyses[0].atsResult.score : 96;
  const totalImprovements = analyses.reduce(
    (acc, curr) => acc + curr.recommendations.length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-indigo-200 backdrop-blur-xs mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              {role === 'recruiter' ? 'Recruiter Talent Intelligence' : 'Job Seeker Dashboard'}
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Welcome back, {user?.name || 'Explorer'}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-indigo-200 max-w-xl">
              {role === 'recruiter'
                ? 'Review candidate alignments, run structured ATS inspections, and compare profiles against target job requisitions.'
                : 'Optimize your resumes with evidence-grounded ATS analysis, skill alignment, and targeted recommendations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/app/analyze"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-950 shadow-sm hover:bg-indigo-50 transition-colors"
            >
              <Plus className="h-4 w-4 text-indigo-600" /> Analyze New Resume
            </Link>
            {role === 'recruiter' && (
              <Link
                href="/app/compare"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-700/80 border border-indigo-500/40 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors"
              >
                <Users className="h-4 w-4" /> Compare Candidates
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Resumes Analyzed"
          value={totalResumes}
          subtext="Processed in platform"
          icon={FileText}
          accentColor="indigo"
          badge={{ text: 'Active Records', variant: 'info' }}
          linkHref="/app/history"
          linkText="View All Records"
        />
        <MetricCard
          title="Average Match Score"
          value={`${avgMatchScore}%`}
          subtext="Target role alignment"
          icon={Percent}
          accentColor="emerald"
          badge={{ text: 'Strong Alignment', variant: 'success' }}
        />
        <MetricCard
          title="Latest ATS Health"
          value={`${latestATS}/100`}
          subtext="Document parsing score"
          icon={Cpu}
          accentColor="cyan"
          badge={{ text: 'Format Verified', variant: 'success' }}
          linkHref="/app/ats-simulator"
          linkText="Run Simulator"
        />
        <MetricCard
          title="Identified Improvements"
          value={totalImprovements}
          subtext="High & medium priority"
          icon={CheckSquare}
          accentColor="amber"
          badge={{ text: 'Actionable', variant: 'warning' }}
        />
      </div>

      {/* Main Grid: Recent Analyses & Resume Checklist */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (2 cols): Recent Analyses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Resume Analyses</h2>
            <Link
              href="/app/history"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View History →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
                Loading stored resume records...
              </div>
            ) : analyses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No analyses found yet. Click &quot;Analyze New Resume&quot; to begin!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Candidate & Resume</th>
                      <th className="py-3.5 px-4">Target Job</th>
                      <th className="py-3.5 px-4">Match Score</th>
                      <th className="py-3.5 px-4">ATS Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {analyses.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-900 block truncate max-w-[180px]">
                            {item.candidateName}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-[180px]">
                            {item.resumeTitle}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-800 block truncate max-w-[180px]">
                            {item.targetJobTitle}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate block max-w-[180px]">
                            {item.targetCompany || 'General Posting'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">
                              {item.overallMatchScore}%
                            </span>
                            <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500"
                                style={{ width: `${item.overallMatchScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${
                              item.atsResult.score >= 85
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {item.atsResult.score}/100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/app/reports/${item.id}`}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-indigo-600 hover:bg-indigo-50 shadow-2xs"
                            >
                              Report
                            </Link>
                            <Link
                              href={`/app/chat?resumeId=${item.resumeId}`}
                              className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 shadow-2xs"
                              title="Chat with resume"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
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

        {/* Right Column (1 col): Resume Improvement Checklist & Activity */}
        <div className="space-y-6">
          {/* Resume Improvement Checklist */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-indigo-600" />
              Optimization Checklist
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ✓
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Single-Column Hierarchy</span>
                  <span className="text-[11px] text-slate-500">
                    Verified for Alex Rivera — prevents reading order cross-talk.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/50 p-2.5">
                <div className="h-4 w-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  !
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Clarify Terraform Experience</span>
                  <span className="text-[11px] text-slate-600">
                    Add 1 sentence on IaC or AWS provisioning if accurate.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <div className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px] mt-0.5 shrink-0">
                  ✓
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block">Contact Header Verified</span>
                  <span className="text-[11px] text-slate-500">
                    Phone and email extracted cleanly in body stream.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Hub Launchers */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Quick Tools Access</h3>
            <Link
              href="/app/chat"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Resume Chat (RAG)</span>
                  <span className="text-[11px] text-slate-500">Ask evidence-grounded questions</span>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <Link
              href="/app/ats-simulator"
              className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-cyan-300 hover:bg-cyan-50/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">ATS Simulator</span>
                  <span className="text-[11px] text-slate-500">Audit layouts and text streams</span>
                </div>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
