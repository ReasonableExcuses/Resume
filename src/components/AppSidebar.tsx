'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import {
  LayoutDashboard,
  FileSearch,
  Cpu,
  PenTool,
  MessageSquare,
  Users,
  History,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  Sparkles,
} from 'lucide-react';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ isMobileOpen, onCloseMobile }: AppSidebarProps) {
  const pathname = usePathname();
  const { role, switchRole, isDemoMode } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/app/analyze', label: 'Analyze Resume', icon: FileSearch },
    { href: '/app/ats-simulator', label: 'ATS Simulator', icon: Cpu },
    { href: '/app/writing-insights', label: 'AI Writing Insights', icon: PenTool },
    { href: '/app/chat', label: 'Resume Chat (RAG)', icon: MessageSquare },
    ...(role === 'recruiter'
      ? [{ href: '/app/compare', label: 'Candidate Comparison', icon: Users }]
      : []),
    { href: '/app/history', label: 'Analysis History', icon: History },
    { href: '/app/settings', label: 'Settings & AI Keys', icon: Settings },
    { href: '/app/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 md:static ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <Link href="/app" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
                  Smart Resume
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mt-0.5">
                  Intelligence AI
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Role Indicator Banner */}
        {!isCollapsed && (
          <div className="m-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Active Experience
              </span>
              {isDemoMode && (
                <span className="rounded bg-indigo-200/60 px-1.5 py-0.2 text-[9px] font-bold text-indigo-800">
                  DEMO
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 capitalize">
                {role === 'recruiter' ? 'Recruiter Hub' : 'Job Seeker'}
              </span>
              <button
                onClick={() => switchRole(role === 'recruiter' ? 'job_seeker' : 'recruiter')}
                className="text-[10px] font-semibold text-indigo-600 hover:underline"
              >
                Switch Role
              </button>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-100 p-3">
          {!isCollapsed ? (
            <div className="rounded-xl bg-slate-50 p-2 text-center text-[10px] text-slate-400">
              Smart Resume Analyzer v2.0
              <br />
              ATS & RAG Grounded Engine
            </div>
          ) : (
            <div className="flex justify-center text-[10px] font-bold text-slate-300">
              SRA
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
