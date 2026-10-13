'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ScoreGauge } from '@/components/ScoreGauge';
import { SkillBreakdown } from '@/components/SkillBreakdown';
import { ATSInspectionCard } from '@/components/ATSInspectionCard';
import { WritingInsightCard } from '@/components/WritingInsightCard';
import { ChatInterface } from '@/components/ChatInterface';
import { AnalysisResult } from '@/lib/types';
import {
  Printer,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
  Cpu,
  PenTool,
  MessageSquare,
  Layers,
} from 'lucide-react';
import { clientGetAnalysisById } from '@/lib/clientServices';

export function ClientReport({ id }: { id: string }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'ats' | 'writing' | 'chat'
  >('overview');

  useEffect(() => {
    async function fetchReport() {
      try {
        const data = await clientGetAnalysisById(id);
        setAnalysis(data);
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
        Loading intelligence report for analysis #{id}...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Analysis Record Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested analysis could not be located or has been deleted.
        </p>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${analysis.candidateName.replace(/\s+/g, '_')}_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions (hidden in print) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadJSON}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export JSON
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Main Candidate Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
              Analysis Report
            </span>
            <span className="text-xs text-slate-400">
              Generated {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {analysis.candidateName}
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Target Role:{' '}
            <span className="font-semibold text-slate-800">{analysis.targetJobTitle}</span>{' '}
            {analysis.targetCompany && `• ${analysis.targetCompany}`}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <ScoreGauge score={analysis.overallMatchScore} label="Job Match" size="sm" />
          <ScoreGauge score={analysis.atsResult.score} label="ATS Health" size="sm" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 print:hidden">
        {[
          { id: 'overview', label: '1. Overview', icon: Layers },
          { id: 'skills', label: '2. Skills & Experience', icon: FileText },
          { id: 'ats', label: '3. ATS Simulator', icon: Cpu },
          { id: 'writing', label: '4. AI Writing Insights', icon: PenTool },
          { id: 'chat', label: '5. Resume Chat (RAG)', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {(activeTab === 'overview' || typeof window === 'undefined') && (
        <div className="space-y-6">
          {/* Category Breakdown Bars */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Weighted Category Alignment Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Required Skills (35%)', score: analysis.categoryScores.requiredSkills },
                { label: 'Work Experience (25%)', score: analysis.categoryScores.workExperience },
                { label: 'Responsibilities (15%)', score: analysis.categoryScores.responsibilities },
                { label: 'Education & Certs (10%)', score: analysis.categoryScores.educationCertifications },
                { label: 'Project Evidence (15%)', score: analysis.categoryScores.projectEvidence },
              ].map((cat, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-center">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                    {cat.label}
                  </span>
                  <span className="text-xl font-black text-slate-900">{cat.score}%</span>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Gaps Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5">
              <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Key Documented Strengths
              </h4>
              <ul className="space-y-2 text-xs text-emerald-800">
                {analysis.experienceAnalysis.keyAchievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Identified Missing Areas or Gaps
              </h4>
              <ul className="space-y-2 text-xs text-amber-800">
                {analysis.experienceAnalysis.missingExperienceAreas.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Priority Actionable Recommendations */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Highest-Priority Recommendations
            </h3>

            <div className="space-y-3">
              {analysis.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{rec.title}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        rec.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-600">{rec.description}</p>
                  <div className="rounded-lg bg-white border border-slate-200 p-2.5 text-indigo-700 font-medium">
                    <span className="font-bold text-indigo-900">Recommended Action: </span>
                    {rec.actionableStep}
                  </div>
                  {rec.exampleDiff && (
                    <div className="rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-slate-200 space-y-1">
                      <div className="text-rose-400">- {rec.exampleDiff.original}</div>
                      <div className="text-emerald-400">+ {rec.exampleDiff.suggested}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Skills & Experience */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <SkillBreakdown skillAnalysis={analysis.skillAnalysis} />

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Experience Summary</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {analysis.experienceAnalysis.summary}
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: ATS Simulator */}
      {activeTab === 'ats' && (
        <div className="space-y-6">
          <ATSInspectionCard
            atsResult={analysis.atsResult}
            candidateName={analysis.candidateName}
          />
        </div>
      )}

      {/* Tab 4: AI Writing Insights */}
      {activeTab === 'writing' && (
        <div className="space-y-6">
          <WritingInsightCard writingInsights={analysis.writingInsights} />
        </div>
      )}

      {/* Tab 5: Resume Chat (RAG) */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          <ChatInterface
            resumeId={analysis.resumeId}
            candidateName={analysis.candidateName}
          />
        </div>
      )}
    </div>
  );
}
