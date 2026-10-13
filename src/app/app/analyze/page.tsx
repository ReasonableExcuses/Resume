'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUploadZone } from '@/components/FileUploadZone';
import { JobDescriptionInput } from '@/components/JobDescriptionInput';
import { SAMPLE_RESUMES, SAMPLE_JOBS } from '@/lib/sampleData';
import { Resume } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Loader2,
} from 'lucide-react';

export default function AnalyzeResumePage() {
  const router = useRouter();

  // Selected or uploaded resume
  const [selectedResume, setSelectedResume] = useState<Resume | null>(SAMPLE_RESUMES[0]);
  const [useSamplePicker, setUseSamplePicker] = useState(true);

  // Job inputs
  const [jobTitle, setJobTitle] = useState(SAMPLE_JOBS[0].title);
  const [company, setCompany] = useState(SAMPLE_JOBS[0].company || '');
  const [jobText, setJobText] = useState(SAMPLE_JOBS[0].rawText);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([
    ...SAMPLE_JOBS[0].requiredSkills,
  ]);

  // Analysis execution state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Reading and extracting structured resume sections',
    'Extracting technical skills, achievements, and competencies',
    'Comparing candidate experience against target job requirements',
    'Inspecting ATS document structure, layout, and reading order',
    'Generating actionable recommendations and authenticity review',
  ];

  const handleStartAnalysis = async () => {
    if (!selectedResume) {
      setError('Please upload or select a resume before beginning analysis.');
      return;
    }

    if (!jobText.trim() || jobText.length < 20) {
      setError('Please provide a job description with at least 20 characters.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Progression sequence
    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      const res = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId: selectedResume.id,
          jobTitle,
          company,
          jobText,
        }),
      });

      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete resume analysis');
      }

      setAnalysisStep(steps.length);
      setTimeout(() => {
        router.push(`/app/reports/${json.data.id}`);
      }, 500);
    } catch (err: unknown) {
      clearInterval(interval);
      setIsAnalyzing(false);
      const msg = err instanceof Error ? err.message : 'Error executing analysis';
      setError(msg);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
          <Sparkles className="h-3.5 w-3.5" /> Comprehensive Analysis Pipeline
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Analyze Resume & Target Job
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
          Upload your resume or pick a demonstration profile, input the job description, and run our multi-stage intelligence analysis.
        </p>
      </div>

      {/* Main 2-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Column 1: Resume Source */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              1. Resume Selection & Upload
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseSamplePicker(!useSamplePicker)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {useSamplePicker ? 'Upload Custom File' : 'Pick Sample Resume'}
              </button>
            </div>
          </div>

          {useSamplePicker ? (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Choose a preloaded demonstration candidate:
              </label>
              <div className="space-y-2">
                {SAMPLE_RESUMES.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedResume?.id === r.id
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{r.candidateName}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded">
                        {r.fileType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{r.title}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.skills.slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-medium text-slate-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <FileUploadZone
              onFileUploaded={(newResume) => {
                setSelectedResume(newResume);
              }}
            />
          )}

          {selectedResume && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Active Resume: {selectedResume.candidateName}</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 line-clamp-2">
                {selectedResume.summary}
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Job Description */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              2. Target Role Requirements
            </h2>
          </div>

          <JobDescriptionInput
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            company={company}
            setCompany={setCompany}
            jobText={jobText}
            setJobText={setJobText}
            requiredSkills={requiredSkills}
            setRequiredSkills={setRequiredSkills}
          />
        </div>
      </div>

      {/* Action Area & Progress */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs text-center space-y-4">
        {error && (
          <div className="max-w-md mx-auto flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 text-left">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isAnalyzing ? (
          <div>
            <button
              onClick={handleStartAnalysis}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="h-4 w-4" /> Analyze Resume
            </button>
            <p className="mt-2 text-xs text-slate-400">
              Performs ATS layout inspection, contextual skill matching, and AI writing signals review.
            </p>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-4 text-left">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Executing Analysis Pipeline...
                </span>
                <span className="text-xs text-slate-500">
                  Step {Math.min(analysisStep + 1, steps.length)} of {steps.length}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-opacity ${
                    idx === analysisStep
                      ? 'font-bold text-indigo-700'
                      : idx < analysisStep
                      ? 'text-emerald-600 font-medium'
                      : 'text-slate-300'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                      idx < analysisStep
                        ? 'bg-emerald-100 text-emerald-700'
                        : idx === analysisStep
                        ? 'bg-indigo-100 text-indigo-700 animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {idx < analysisStep ? '✓' : idx + 1}
                  </div>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
