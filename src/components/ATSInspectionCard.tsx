'use client';

import React, { useState } from 'react';
import { ATSResult, ATSFindingSeverity } from '@/lib/types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle,
  FileText,
  Download,
  Eye,
} from 'lucide-react';

interface ATSInspectionCardProps {
  atsResult: ATSResult;
  candidateName?: string;
}

export function ATSInspectionCard({ atsResult, candidateName = 'Candidate' }: ATSInspectionCardProps) {
  const [activeTab, setActiveTab] = useState<'findings' | 'extraction' | 'guidance'>('findings');

  const severityBadge = (severity: ATSFindingSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700">
            <ShieldAlert className="h-3 w-3" /> Critical Issue
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
            <AlertTriangle className="h-3 w-3" /> High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
            <AlertTriangle className="h-3 w-3" /> Medium Risk
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
            <Info className="h-3 w-3" /> Low / Minor
          </span>
        );
      case 'passed':
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <CheckCircle className="h-3 w-3" /> Passed Check
          </span>
        );
    }
  };

  const handleDownloadCleanText = () => {
    const element = document.createElement('a');
    const file = new Blob([atsResult.textExtractionPreview.extractedOrder], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${candidateName.replace(/\s+/g, '_')}_Clean_ATS_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">ATS Compatibility Simulator</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                atsResult.status === 'pass'
                  ? 'bg-emerald-100 text-emerald-800'
                  : atsResult.status === 'warning'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              Health Score: {atsResult.score}/100
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Simulates parsing heuristics (reading order, tables, text extraction, contact headers).
          </p>
        </div>

        <button
          onClick={handleDownloadCleanText}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <Download className="h-3.5 w-3.5" /> Download Clean ATS Text
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-2 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab('findings')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'findings'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Inspection Findings ({atsResult.findings.length})
        </button>
        <button
          onClick={() => setActiveTab('extraction')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'extraction'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Extracted Text Order Preview
        </button>
        <button
          onClick={() => setActiveTab('guidance')}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            activeTab === 'guidance'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          ATS Layout Guide
        </button>
      </div>

      {/* Tab 1: Findings */}
      {activeTab === 'findings' && (
        <div className="mt-4 space-y-3">
          {atsResult.findings.map((finding) => (
            <div
              key={finding.id}
              className={`rounded-xl border p-4 transition-all ${
                finding.severity === 'critical' || finding.severity === 'high'
                  ? 'border-rose-200 bg-rose-50/40'
                  : finding.severity === 'medium'
                  ? 'border-amber-200 bg-amber-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-bold text-slate-900 text-sm">{finding.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {finding.confidence}
                  </span>
                  {severityBadge(finding.severity)}
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-600 space-y-1">
                <div>
                  <span className="font-semibold text-slate-700">Evidence: </span>
                  {finding.evidence}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Why it matters: </span>
                  {finding.whyItMatters}
                </div>
                {finding.severity !== 'passed' && (
                  <div className="rounded-md bg-white border border-slate-200 p-2 text-slate-800 font-medium">
                    <span className="text-indigo-600 font-bold">Recommended fix: </span>
                    {finding.recommendedFix}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Extraction Preview */}
      {activeTab === 'extraction' && (
        <div className="mt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto max-h-96">
            <div className="text-slate-400 text-[10px] mb-2 uppercase tracking-wider">
              --- Raw Sequential Text Stream Ingested by ATS ({atsResult.textExtractionPreview.extractedWordCount} words) ---
            </div>
            <pre className="whitespace-pre-wrap">{atsResult.textExtractionPreview.extractedOrder}</pre>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">
            Note: This preview mirrors the linear reading order parsed by recruitment scanners. If text from columns merges unexpectedly, convert to a single-column format.
          </p>
        </div>
      )}

      {/* Tab 3: Guidance */}
      {activeTab === 'guidance' && (
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs text-indigo-900">
            <h4 className="font-bold mb-1">Standard Single-Column Structure</h4>
            <p>{atsResult.singleColumnGuidance}</p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">Recommended Section Heading Hierarchy:</h4>
            <div className="flex flex-wrap gap-2">
              {atsResult.suggestedHeadings.map((h, i) => (
                <span
                  key={i}
                  className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {i + 1}. {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
