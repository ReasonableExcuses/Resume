'use client';

import React, { useState } from 'react';
import { SAMPLE_RESUMES } from '@/lib/sampleData';
import { runATSInspection } from '@/lib/atsSimulator';
import { ATSInspectionCard } from '@/components/ATSInspectionCard';
import { FileUploadZone } from '@/components/FileUploadZone';
import { Resume } from '@/lib/types';
import { Cpu, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

export default function ATSSimulatorPage() {
  const [selectedResume, setSelectedResume] = useState<Resume>(SAMPLE_RESUMES[0]);
  const [useCustomUpload, setUseCustomUpload] = useState(false);

  const atsResult = runATSInspection(
    selectedResume.rawText,
    selectedResume.layoutStructure,
    selectedResume.candidateName,
    selectedResume.email,
    selectedResume.phone
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 mb-2">
          <Cpu className="h-3.5 w-3.5" /> Heuristic Layout & Ingestion Simulator
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          ATS Compatibility Simulator
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
          Inspect document layout, reading order risks, tables, text boxes, and contact headers before submitting your resume to recruitment systems.
        </p>
      </div>

      {/* Candidate Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Active Resume Under Test
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">
              {selectedResume.candidateName}
            </span>
            <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-700 uppercase">
              {selectedResume.fileType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedResume.id}
            onChange={(e) => {
              const found = SAMPLE_RESUMES.find((r) => r.id === e.target.value);
              if (found) setSelectedResume(found);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-cyan-500 focus:outline-hidden"
          >
            {SAMPLE_RESUMES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.candidateName} ({r.fileType.toUpperCase()})
              </option>
            ))}
          </select>
          <button
            onClick={() => setUseCustomUpload(!useCustomUpload)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
          >
            {useCustomUpload ? 'Hide Upload' : 'Upload New File'}
          </button>
        </div>
      </div>

      {useCustomUpload && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <FileUploadZone
            onFileUploaded={(newResume) => {
              setSelectedResume(newResume);
              setUseCustomUpload(false);
            }}
          />
        </div>
      )}

      {/* Main Inspection Component */}
      <ATSInspectionCard
        atsResult={atsResult}
        candidateName={selectedResume.candidateName}
      />
    </div>
  );
}
