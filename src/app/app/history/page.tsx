'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalysisResult } from '@/lib/types';
import { History, Search, Trash2, ExternalLink, MessageSquare, Download } from 'lucide-react';

import { clientGetAnalyses, clientDeleteAnalysis } from '@/lib/clientServices';

export default function AnalysisHistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await clientGetAnalyses();
        setAnalyses(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this analysis record?')) return;

    try {
      await clientDeleteAnalysis(id);
      setAnalyses(analyses.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting record:', err);
    }
  };

  const filtered = analyses.filter(
    (a) =>
      a.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      a.targetJobTitle.toLowerCase().includes(search.toLowerCase()) ||
      (a.targetCompany && a.targetCompany.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
            <History className="h-3.5 w-3.5" /> Stored Intelligence Records
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Analysis History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Review previous resume compatibility reports, ATS inspection results, and chat sessions.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidates or jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
            Loading analysis records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No matching analysis records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Target Role</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Match Score</th>
                  <th className="py-4 px-6">ATS Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{item.candidateName}</span>
                      <span className="text-[11px] text-slate-400">{item.resumeTitle}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-slate-800 block">
                        {item.targetJobTitle}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.targetCompany || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{item.overallMatchScore}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          item.atsResult.score >= 85
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.atsResult.score}/100
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
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
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded-lg border border-slate-200 bg-white p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-2xs"
                          title="Delete record"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
