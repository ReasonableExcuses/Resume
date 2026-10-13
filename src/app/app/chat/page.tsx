'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SAMPLE_RESUMES } from '@/lib/sampleData';
import { ChatInterface } from '@/components/ChatInterface';
import { Resume } from '@/lib/types';
import { MessageSquare, Sparkles, BookOpen } from 'lucide-react';

function ResumeChatContent() {
  const searchParams = useSearchParams();
  const queryResumeId = searchParams.get('resumeId');

  const [selectedResume, setSelectedResume] = useState<Resume>(() => {
    if (queryResumeId) {
      const found = SAMPLE_RESUMES.find((r) => r.id === queryResumeId);
      if (found) return found;
    }
    return SAMPLE_RESUMES[0];
  });

  useEffect(() => {
    if (queryResumeId) {
      const found = SAMPLE_RESUMES.find((r) => r.id === queryResumeId);
      if (found) setSelectedResume(found);
    }
  }, [queryResumeId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Retrieval-Augmented Generation (RAG)
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Interactive Resume Chatbot
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Ask targeted questions about candidate experience. Every response is strictly grounded in the document with page and section citations.
          </p>
        </div>

        {/* Candidate Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Selected Resume:
          </span>
          <select
            value={selectedResume.id}
            onChange={(e) => {
              const found = SAMPLE_RESUMES.find((r) => r.id === e.target.value);
              if (found) setSelectedResume(found);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-indigo-500 focus:outline-hidden"
          >
            {SAMPLE_RESUMES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.candidateName} ({r.title.split('-')[1]?.trim() || r.title})
              </option>
            ))}
          </select>
        </div>
      </div>

      <ChatInterface
        key={selectedResume.id}
        resumeId={selectedResume.id}
        candidateName={selectedResume.candidateName}
      />
    </div>
  );
}

export default function ResumeChatPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading chat...</div>}>
      <ResumeChatContent />
    </Suspense>
  );
}
