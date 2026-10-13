'use client';

import React from 'react';
import { useAuth } from '@/lib/authContext';
import { User, Shield, Briefcase, Mail, LogOut, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, role, switchRole, isDemoMode, logout } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-2">
          <User className="h-3.5 w-3.5" /> User Account
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          User Profile & Experience Mode
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage your role preferences, active demonstration persona, and session settings.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-xl font-black text-white shadow-md">
            {user?.avatar || 'AR'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              {isDemoMode && (
                <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                  Demo Account
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <span className="mt-2 inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 capitalize">
              Role: {role.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Select Active Platform Role
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => switchRole('job_seeker')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                role === 'job_seeker'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Job Seeker</span>
                <input
                  type="radio"
                  name="userRole"
                  checked={role === 'job_seeker'}
                  onChange={() => switchRole('job_seeker')}
                  className="text-indigo-600"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Persona: Alex Rivera (Senior Full-Stack Engineer). Focuses on ATS health, skill gap closing, and resume optimization.
              </p>
            </div>

            <div
              onClick={() => switchRole('recruiter')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                role === 'recruiter'
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                  : 'border-slate-200 bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Recruiter</span>
                <input
                  type="radio"
                  name="userRole"
                  checked={role === 'recruiter'}
                  onChange={() => switchRole('recruiter')}
                  className="text-indigo-600"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Persona: Sarah Jenkins (Lead Talent Partner). Focuses on candidate comparison, verification questions, and structured profiles.
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Session stored locally in browser
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
