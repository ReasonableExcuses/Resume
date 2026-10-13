'use client';

import React, { useState } from 'react';
import { SAMPLE_JOBS } from '@/lib/sampleData';
import { Briefcase, Sparkles, Plus, X } from 'lucide-react';

interface JobDescriptionInputProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  company: string;
  setCompany: (val: string) => void;
  jobText: string;
  setJobText: (val: string) => void;
  requiredSkills: string[];
  setRequiredSkills: (skills: string[]) => void;
}

export function JobDescriptionInput({
  jobTitle,
  setJobTitle,
  company,
  setCompany,
  jobText,
  setJobText,
  requiredSkills,
  setRequiredSkills,
}: JobDescriptionInputProps) {
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const job = SAMPLE_JOBS.find((j) => j.id === selectedId);
    if (job) {
      setJobTitle(job.title);
      setCompany(job.company || '');
      setJobText(job.rawText);
      setRequiredSkills([...job.requiredSkills]);
    }
  };

  const handleExtractRequirements = () => {
    if (!jobText.trim()) return;

    const commonSkills = [
      'TypeScript', 'JavaScript', 'React.js', 'Next.js', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL',
      'Redis', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'SQL', 'Tableau', 'Power BI', 'Snowflake',
      'A/B Testing', 'Agile', 'Scrum', 'JIRA', 'PMP', 'dbt', 'Pandas', 'Looker', 'CI/CD'
    ];

    const extracted = commonSkills.filter((s) =>
      new RegExp(`\\b${s.replace('.', '\\.')}\\b`, 'i').test(jobText)
    );

    const merged = Array.from(new Set([...requiredSkills, ...extracted]));
    setRequiredSkills(merged);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !requiredSkills.includes(newSkillInput.trim())) {
      setRequiredSkills([...requiredSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  return (
    <div className="w-full space-y-4">
      {/* Preset selector */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Target Job Description
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Quick Preset:</span>
          <select
            onChange={handleSelectPreset}
            defaultValue=""
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="" disabled>
              Select a sample job...
            </option>
            {SAMPLE_JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title & Company */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Full-Stack Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Company Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Starlight Scale Technologies"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Main Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-semibold text-slate-600">
            Paste Job Description Content <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleExtractRequirements}
            disabled={!jobText.trim()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 disabled:opacity-40"
          >
            <Sparkles className="h-3 w-3" /> Auto-Extract Key Requirements
          </button>
        </div>
        <textarea
          rows={7}
          placeholder="Paste requirements, responsibilities, and preferred qualifications..."
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 leading-relaxed focus:border-indigo-500 focus:bg-white focus:outline-hidden"
        />
      </div>

      {/* Required Skills Tags */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
          Required Skills to Check ({requiredSkills.length})
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {requiredSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-800"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <div className="inline-flex items-center gap-1">
            <input
              type="text"
              placeholder="+ Add skill"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              className="w-24 rounded-md border border-dashed border-slate-300 bg-white px-2 py-0.5 text-[11px] text-slate-700 focus:w-36 focus:border-indigo-500 focus:outline-hidden transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
