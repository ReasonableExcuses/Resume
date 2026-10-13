'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Menu, Plus, UserCheck, Shield, Sparkles } from 'lucide-react';

interface AppTopbarProps {
  onOpenMobileSidebar: () => void;
}

export function AppTopbar({ onOpenMobileSidebar }: AppTopbarProps) {
  const { user, role, switchRole, isDemoMode } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Platform</span>
          <span className="text-xs text-slate-300">/</span>
          <span className="text-xs font-bold text-slate-800 capitalize">
            {role === 'recruiter' ? 'Recruiter Intelligence Portal' : 'Job Seeker Dashboard'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill */}
        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            onClick={() => switchRole('job_seeker')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              role === 'job_seeker'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Job Seeker
          </button>
          <button
            onClick={() => switchRole('recruiter')}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              role === 'recruiter'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Recruiter
          </button>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <span className="hidden lg:inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
            <Sparkles className="h-3 w-3" /> Demo Mode
          </span>
        )}

        {/* Analyze New Resume Button */}
        <Link
          href="/app/analyze"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Analyze Resume</span>
        </Link>

        {/* User Avatar */}
        <Link
          href="/app/profile"
          className="flex items-center gap-2 rounded-xl border border-slate-200/80 p-1.5 hover:bg-slate-50 transition-colors"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
            {user?.avatar || 'AR'}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
            {user?.name || 'Alex'}
          </span>
        </Link>
      </div>
    </header>
  );
}
